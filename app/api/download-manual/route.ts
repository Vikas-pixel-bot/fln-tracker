import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawFile = searchParams.get("file");

  if (!rawFile) {
    return new NextResponse("File parameter is required", { status: 400 });
  }

  // Clean filename: remove leading slashes or manuals/ prefix
  let fileName = rawFile.replace(/^\/?(manuals\/)?/, "").trim();

  // Prevent directory traversal
  fileName = path.basename(fileName);

  const manualsDir = path.join(process.cwd(), "public", "manuals");
  let filePath = path.join(manualsDir, fileName);

  // Fallback: If exact file doesn't exist, search manuals directory for matching name ignoring double-spaces
  if (!fs.existsSync(filePath)) {
    const existingFiles = fs.readdirSync(manualsDir);
    const normalizedTarget = fileName.replace(/\s+/g, " ").toLowerCase();
    
    const matchedFile = existingFiles.find(
      (f) => f.replace(/\s+/g, " ").toLowerCase() === normalizedTarget
    );

    if (matchedFile) {
      fileName = matchedFile;
      filePath = path.join(manualsDir, matchedFile);
    } else {
      return new NextResponse(`Manual file not found: ${fileName}`, { status: 404 });
    }
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const cleanFilename = fileName.replace(/"/g, "'");
    const utf8Filename = encodeURIComponent(fileName);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cleanFilename}"; filename*=UTF-8''${utf8Filename}`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    return new NextResponse(`Error reading manual file: ${err.message}`, { status: 500 });
  }
}
