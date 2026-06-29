import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/lib/models/Project";
import { deleteFromS3 } from "@/lib/s3";

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

    const oldImages = existingProject.images || [];
    const newImages = body.images || [];

    // Find images that were removed
    const removedImages = oldImages.filter((img: string) => !newImages.includes(img));

    // Delete removed images from S3
    for (const imgUrl of removedImages) {
      await deleteFromS3(imgUrl);
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

    // Delete all associated images from S3
    if (deletedProject.images && deletedProject.images.length > 0) {
      for (const imgUrl of deletedProject.images) {
        await deleteFromS3(imgUrl);
      }
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
