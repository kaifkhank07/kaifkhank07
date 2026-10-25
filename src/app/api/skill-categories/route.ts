import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import SkillCategory from "@/lib/models/SkillCategory";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const categories = await SkillCategory.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const category = await SkillCategory.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
