import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function getContentType(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".pdf":
      return "application/pdf";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.path;
    
    if (!pathParts || pathParts.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const uploadDirName = process.env.UPLOAD_DIR || "uploads";
    const baseUploadDir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), uploadDirName);
    const targetPath = path.resolve(baseUploadDir, ...pathParts);

    // Prevent directory traversal attacks
    if (!targetPath.startsWith(baseUploadDir)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
      const fileBuffer = await fs.readFile(targetPath);
      const ext = path.extname(targetPath);
      const contentType = getContentType(ext);

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (err: any) {
      if (err.code === "ENOENT") {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      throw err;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
