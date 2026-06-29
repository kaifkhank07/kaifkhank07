import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Journey from "@/lib/models/Journey";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const journey = await Journey.find({}).sort({ joinedDate: -1 });
    return NextResponse.json({ success: true, data: journey });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const journey = await Journey.create(body);
    return NextResponse.json({ success: true, data: journey }, { status: 201 });
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
    const journey = await Journey.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!journey) return NextResponse.json({ success: false, error: "Entry not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: journey });
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

    const journey = await Journey.findByIdAndDelete(id);
    if (!journey) return NextResponse.json({ success: false, error: "Entry not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
