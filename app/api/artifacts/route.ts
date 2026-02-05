import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSessionUser } from "../../../lib/auth";
import fs from "fs/promises";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  if (!body.path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }
  try {
    const content = await fs.readFile(body.path, "utf8");
    await prisma.auditLog.create({
      data: {
        action: "artifact.import",
        entity: "Artifact",
        entityId: body.path,
        message: "Imported artifact content",
        userId: session.id,
      },
    });
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Unable to read file" }, { status: 400 });
  }
}

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await prisma.userSettings.findUnique({ where: { userId: session.id } });
  return NextResponse.json({ paths: settings?.openclawPaths ?? "" });
}
