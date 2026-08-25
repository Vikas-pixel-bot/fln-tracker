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

  let matchedFile = fileName;

  // Fallback matching logic if exact name differs by whitespace/casing
  if (fs.existsSync(manualsDir)) {
    try {
      const existingFiles = fs.readdirSync(manualsDir);
      const normalizedTarget = fileName.replace(/\s+/g, " ").toLowerCase();
      
      const found = existingFiles.find(
        (f) => f.replace(/\s+/g, " ").toLowerCase() === normalizedTarget
      );

      if (found) {
        matchedFile = found;
        filePath = path.join(manualsDir, found);
      }
    } catch (e) {
      console.error("Error reading manuals dir:", e);
    }
  }

  // If local file exists AND is greater than 2KB (i.e. actual binary PDF, not a 134-byte Git LFS pointer file),
  // serve it directly for local offline development.
  if (fs.existsSync(filePath)) {
    try {
      const stat = fs.statSync(filePath);
      if (stat.size > 2000) {
        const fileBuffer = fs.readFileSync(filePath);
        const cleanFilename = matchedFile.replace(/"/g, "'");
        const utf8Filename = encodeURIComponent(matchedFile);

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${cleanFilename}"; filename*=UTF-8''${utf8Filename}`,
            "Content-Length": fileBuffer.length.toString(),
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch (err: any) {
      console.error("Error serving local file:", err);
    }
  }

  // On live production (e.g. Vercel deployment), Vercel doesn't smudge Git LFS binaries and limits API payload sizes.
  // Redirecting to GitHub LFS Media CDN streams the full binary PDF file directly to the user.
  const cdnUrl = `https://media.githubusercontent.com/media/lotbai-pratham/Mission-FLN/main/public/manuals/${encodeURIComponent(matchedFile)}`;

  return NextResponse.redirect(cdnUrl, 307);
}

