import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSessionUser } from "../../../lib/auth";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const item = await prisma.vaultItem.create({
    data: {
      name: body.name,
      category: body.category,
      tags: body.tags ?? "",
      encrypted: body.encrypted,
      iv: body.iv,
      salt: body.salt,
      metadata: body.metadata ?? null,
      ownerId: session.id,
    },
  });
  await prisma.auditLog.create({
    data: {
      action: "vault.create",
      entity: "VaultItem",
      entityId: item.id,
      message: `Created vault item ${item.name}`,
      userId: session.id,
    },
  });
  return NextResponse.json({ item });
}
