import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

export async function PUT(req: NextRequest) {
  try {
    // Verify user manually since API routes don't enforce redirect from middleware automatically
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const adminId = payload.id as string;

    await connectToDatabase();
    const { currentPassword, newPassword } = await req.json();

    const admin = await Admin.findById(adminId);
    if (!admin) return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) return NextResponse.json({ success: false, error: "Incorrect current password" }, { status: 400 });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = passwordHash;
    await admin.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
