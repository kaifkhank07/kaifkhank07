import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Social from "@/lib/models/Social";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const socials = await Social.find({});
    return NextResponse.json({ success: true, data: socials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const social = await Social.create(body);
    return NextResponse.json({ success: true, data: social }, { status: 201 });
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
    const social = await Social.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!social) return NextResponse.json({ success: false, error: "Link not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: social });
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

    const social = await Social.findByIdAndDelete(id);
    if (!social) return NextResponse.json({ success: false, error: "Link not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
