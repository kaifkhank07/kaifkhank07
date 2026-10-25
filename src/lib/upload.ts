import fs from "fs/promises";
import path from "path";

/**
 * Saves a file buffer to the local filesystem inside the configured uploads directory.
 * 
 * @param fileBuffer The file content as a Buffer.
 * @param fileName The original filename.
 * @param folder The target subfolder (e.g. 'projects', 'about', 'resume').
 * @returns The relative public URL path to the saved file.
 */
export async function saveUploadedFile(
  fileBuffer: Buffer,
  fileName: string,
  folder: string
): Promise<string> {
  const uploadDirName = process.env.UPLOAD_DIR || "uploads";
  const baseUploadDir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), uploadDirName);
  
  // Sanitize the folder name and remove any path traversal characters
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
  
  // Sanitize and make the filename unique
  const sanitizedFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  
  // Resolve absolute paths
  const targetDir = path.resolve(baseUploadDir, safeFolder);
  const targetPath = path.resolve(targetDir, sanitizedFileName);

  // Prevent path traversal attacks
  if (!targetPath.startsWith(baseUploadDir)) {
    throw new Error("Directory traversal attempt detected");
  }

  // Create directories if they do not exist
  await fs.mkdir(targetDir, { recursive: true });

  // Write file buffer to target path
  await fs.writeFile(targetPath, fileBuffer);

  // Return the public relative URL
  return `/api/uploads/${safeFolder}/${sanitizedFileName}`;
}

/**
 * Deletes a file from the local filesystem given its public URL or path.
 * 
 * @param fileUrl The relative public URL or full URL path of the file to delete.
 */
export async function deleteUploadedFile(fileUrl: string): Promise<void> {
  if (!fileUrl) return;

  const prefix = "/api/uploads/";
  const index = fileUrl.indexOf(prefix);
  
  if (index !== -1) {
    const relativePath = fileUrl.substring(index + prefix.length);
    const uploadDirName = process.env.UPLOAD_DIR || "uploads";
    const baseUploadDir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), uploadDirName);
    
    // Resolve absolute path
    const targetPath = path.resolve(baseUploadDir, relativePath);

    // Prevent directory traversal
    if (!targetPath.startsWith(baseUploadDir)) {
      throw new Error("Directory traversal attempt detected");
    }

    try {
      await fs.unlink(targetPath);
    } catch (error: any) {
      // Handle missing files gracefully
      if (error.code !== "ENOENT") {
        console.error(`Error deleting file at ${targetPath}:`, error);
      }
    }
  }
}
