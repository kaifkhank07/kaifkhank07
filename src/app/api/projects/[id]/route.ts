import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/lib/models/Project";
import { deleteFromS3 } from "@/lib/s3";
import { deleteUploadedFile } from "@/lib/upload";
import { generateUniqueSlug } from "@/lib/slug";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const body = await req.json();
    
    // Find existing project to compare images
    const existingProject = await Project.findById(resolvedParams.id);
    if (!existingProject) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Auto-generate slug if title/category updated or slug is missing
    const title = body.title || existingProject.title;
    const category = body.category || existingProject.category;
    if (!existingProject.slug || title !== existingProject.title || category !== existingProject.category) {
      body.slug = await generateUniqueSlug(title, category, resolvedParams.id);
    }

    // Strip domain if sent by older clients
    if ("domain" in body) {
      delete body.domain;
    }

    const oldImages = existingProject.images || [];
    const newImages = body.images || [];

    // Find images that were removed
    const removedImages = oldImages.filter((img: string) => !newImages.includes(img));

    // AWS S3 upload logic - temporarily disabled
    // for (const imgUrl of removedImages) {
    //   await deleteFromS3(imgUrl);
    // }

    // Delete removed images from local filesystem
    for (const imgUrl of removedImages) {
      await deleteUploadedFile(imgUrl);
    }

    const project = await Project.findByIdAndUpdate(resolvedParams.id, body, {
      new: true,
      runValidators: true,
    });
    
    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    
    const deletedProject = await Project.findByIdAndDelete(resolvedParams.id);
    if (!deletedProject) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // AWS S3 upload logic - temporarily disabled
    // if (deletedProject.images && deletedProject.images.length > 0) {
    //   for (const imgUrl of deletedProject.images) {
    //     await deleteFromS3(imgUrl);
    //   }
    // }

    // Delete all associated images from local filesystem
    if (deletedProject.images && deletedProject.images.length > 0) {
      for (const imgUrl of deletedProject.images) {
        await deleteUploadedFile(imgUrl);
      }
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
