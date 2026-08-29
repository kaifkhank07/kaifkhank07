import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const contentType = file.type;

    // AWS S3 upload logic - temporarily disabled
    // const fileUrl = await uploadToS3(buffer, fileName, contentType);

    // Get the target folder for local storage
    let folder = formData.get("folder") as string;
    if (!folder) {
      if (contentType === "application/pdf") {
        folder = "resume";
      } else {
        folder = "general";
      }
    }

    const fileUrl = await saveUploadedFile(buffer, fileName, folder);

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // AWS S3 upload logic - temporarily disabled
    // await deleteFromS3(url);

    // Local filesystem deletion
    await deleteUploadedFile(url);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
