import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/lib/models/Project";

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
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
