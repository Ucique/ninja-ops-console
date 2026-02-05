import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await request.json();
  if (!payload.items || !Array.isArray(payload.items)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  for (const item of payload.items) {
    await prisma.vaultItem.create({
      data: {
        name: item.name,
        category: item.category,
        tags: item.tags ?? "",
        encrypted: item.encrypted,
        iv: item.iv,
        salt: item.salt,
        metadata: item.metadata ?? null,
        ownerId: session.id,
      },
    });
  }
  return NextResponse.json({ ok: true });
}
