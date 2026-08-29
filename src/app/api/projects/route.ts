import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/lib/models/Project";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const showOnHome = searchParams.get("showOnHome");
    const slug = searchParams.get("slug");
    const visibility = searchParams.get("visibility");

    let filter: any = {};
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

    // Dynamic backward-compatibility check: ensure all loaded projects have valid unique slugs
    for (const project of projects) {
      if (!project.slug) {
        project.slug = await generateUniqueSlug(project.title, project.category, project._id.toString());
        await project.save();
      }
    }

    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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

    body.slug = await generateUniqueSlug(body.title, body.category);

    // Remove domain if sent by older clients
    if ("domain" in body) {
      delete body.domain;
    }

    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
