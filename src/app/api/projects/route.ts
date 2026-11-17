import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/lib/models/Project";
import { generateUniqueSlug } from "@/lib/slug";
import { ProjectCategory } from "@/lib/constants/project";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const showOnHome = searchParams.get("showOnHome");
    const slug = searchParams.get("slug");
    const visibility = searchParams.get("visibility");

    const filter: Record<string, unknown> = {};
    if (showOnHome === "true") {
      filter.showOnHome = true;
    }
    if (slug) {
      filter.slug = slug;
    }
    if (visibility === "true") {
      filter.visibility = true;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    // Dynamic slug check: ensure all loaded projects have valid unique slugs
    for (const project of projects) {
      if (!project.slug) {
        project.slug = await generateUniqueSlug(project.title, project.category, project._id.toString());
        await project.save();
      }
    }

    return NextResponse.json({ success: true, data: projects });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Auto-generate the slug on the backend (do not trust client)
    if (!body.title || !body.category) {
      return NextResponse.json({ success: false, error: "Title and Category are required" }, { status: 400 });
    }

    if (!Object.values(ProjectCategory).includes(body.category)) {
      return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 });
    }

    if (body.images && Array.isArray(body.images) && body.images.length > 4) {
      return NextResponse.json({ success: false, error: "A project can have a maximum of 4 images" }, { status: 400 });
    }

    body.slug = await generateUniqueSlug(body.title, body.category);

    // Remove domain if sent by older clients
    if ("domain" in body) {
      delete body.domain;
    }

    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bad request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
