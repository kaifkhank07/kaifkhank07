import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Skill from "@/lib/models/Skill";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const skills = await Skill.find({});
    return NextResponse.json({ success: true, data: skills });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const skill = await Skill.create(body);
    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    const body = await req.json();
    const skill = await Skill.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return NextResponse.json({ success: false, error: "Skill group not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: skill });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) return NextResponse.json({ success: false, error: "Skill group not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
