import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/lib/models/Project";
import { deleteUploadedFile } from "@/lib/upload";
import { generateUniqueSlug } from "@/lib/slug";
import { ProjectCategory } from "@/lib/constants/project";

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

    // Category validation if provided
    if (body.category && !Object.values(ProjectCategory).includes(body.category)) {
      return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 });
    }

    // Maximum 4 images validation if provided
    if (body.images && Array.isArray(body.images) && body.images.length > 4) {
      return NextResponse.json({ success: false, error: "A project can have a maximum of 4 images" }, { status: 400 });
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
    if ("clientName" in body) {
      delete body.clientName;
    }

    // Only compare and delete removed images if images field is explicitly provided in body
    if (body.images !== undefined) {
      const oldImages = existingProject.images || [];
      const newImages = Array.isArray(body.images) ? body.images : [];

      // Find images that were removed
      const removedImages = oldImages.filter((img: string) => !newImages.includes(img));

      // Delete removed images from local filesystem
      for (const imgUrl of removedImages) {
        await deleteUploadedFile(imgUrl);
      }
    }

    const project = await Project.findByIdAndUpdate(resolvedParams.id, body, {
      new: true,
      runValidators: true,
    });
    
    return NextResponse.json({ success: true, data: project });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bad request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
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

    // Delete all associated images from local filesystem
    if (deletedProject.images && deletedProject.images.length > 0) {
      for (const imgUrl of deletedProject.images) {
        await deleteUploadedFile(imgUrl);
      }
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bad request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
