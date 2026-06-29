import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Enquiry from "@/lib/models/Enquiry";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Save to database
    const enquiry = await Enquiry.create(body);

    // Send Email via SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${body.name}" <${process.env.EMAIL_USER}>`, // sender address must be authenticated user usually
      replyTo: body.email,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER, // list of receivers
      subject: `New Enquiry from ${body.name}`, // Subject line
      text: `Name: ${body.name}\nEmail: ${body.email}\nNumber: ${body.number}\nMessage: ${body.message}`, // plain text body
      html: `
        <h3>New Enquiry Received</h3>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Number:</strong> ${body.number}</p>
        <p><strong>Message:</strong><br/>${body.message}</p>
      `,
    });

    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (error: any) {
    console.error("Enquiry Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    if (!deletedEnquiry) return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
