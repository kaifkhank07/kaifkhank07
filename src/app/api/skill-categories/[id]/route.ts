import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import SkillCategory from "@/lib/models/SkillCategory";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const category = await SkillCategory.findByIdAndDelete(resolvedParams.id);
    if (!category) return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
