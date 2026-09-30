import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { bookId, page } = await params;
  const n = Number(page);

  if (!Number.isInteger(n) || n < 1) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  const filename = `page-${String(n).padStart(2, "0")}.svg`;
  const filePath = path.join(
    process.cwd(),
    "public",
    "books",
    bookId,
    filename
  );

  try {
    const image = await fs.readFile(filePath);

    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }
}
