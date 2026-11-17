import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Support multiple files under "files" or "file", or single file
    const filesFromFiles = formData.getAll("files") as File[];
    const filesFromFile = formData.getAll("file") as File[];
    const allFiles = filesFromFiles.length > 0 ? filesFromFiles : filesFromFile;

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Get the target folder for local storage
    const customFolder = formData.get("folder") as string;
    const uploadedUrls: string[] = [];

    for (const file of allFiles) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 5MB limit` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const contentType = file.type;

      let folder = customFolder;
      if (!folder) {
        if (contentType === "application/pdf") {
          folder = "resume";
        } else {
          folder = "general";
        }
      }

      const fileUrl = await saveUploadedFile(buffer, fileName, folder);
      uploadedUrls.push(fileUrl);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Local filesystem deletion
    await deleteUploadedFile(url);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
