import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import About from "@/lib/models/About";
import { deleteFromS3 } from "@/lib/s3";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const about = await About.findOne();
    return NextResponse.json({ success: true, data: about });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let about = await About.findOne();
    
    if (about) {
      if (about.profileImage && about.profileImage !== body.profileImage) {
        await deleteFromS3(about.profileImage);
      }
      if (about.resumeUrl && about.resumeUrl !== body.resumeUrl) {
        await deleteFromS3(about.resumeUrl);
      }
      about = await About.findOneAndUpdate({}, body, { new: true, runValidators: true });
    } else {
      about = await About.create(body);
    }
    
    return NextResponse.json({ success: true, data: about }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const existingAbout = await About.findOne();
    if (existingAbout) {
      if (existingAbout.profileImage && existingAbout.profileImage !== body.profileImage) {
        await deleteFromS3(existingAbout.profileImage);
      }
      if (existingAbout.resumeUrl && existingAbout.resumeUrl !== body.resumeUrl) {
        await deleteFromS3(existingAbout.resumeUrl);
      }
    }

    const about = await About.findOneAndUpdate({}, body, {
      new: true,
      runValidators: true,
      upsert: true
    });
    return NextResponse.json({ success: true, data: about });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
