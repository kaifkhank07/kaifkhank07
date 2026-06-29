import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.redirect(url);
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/pdf");
    
    // Extract filename from URL or default to resume.pdf
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1] || "resume.pdf";
    
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(blob, { status: 200, headers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
