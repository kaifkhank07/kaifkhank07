import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin";
import dns from "dns";

// Fix Node.js SRV lookup issues on Windows with MongoDB Atlas
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if setting custom DNS servers fails in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = (async () => {
      let lastErr;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          return await mongoose.connect(MONGODB_URI, opts);
        } catch (err) {
          lastErr = err;
          console.warn(`MongoDB connection attempt ${attempt} failed:`, err);
          if (attempt < 3) {
            await new Promise((res) => setTimeout(res, 500));
          }
        }
      }
      throw lastErr;
    })();
  }

  try {
    cached.conn = await cached.promise;
    await initializeDefaultAdmin();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

async function initializeDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await Admin.create({ email, passwordHash });
      console.log("Default admin initialized");
    }
  } catch (err) {
    console.error("Failed to initialize admin", err);
  }
}

export default connectToDatabase;
