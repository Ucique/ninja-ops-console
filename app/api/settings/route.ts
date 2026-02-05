import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSessionUser } from "../../../lib/auth";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const settings = await prisma.userSettings.upsert({
    where: { userId: session.id },
    update: {
      workingHours: body.workingHours,
      timezone: body.timezone,
      priorityRules: body.priorityRules,
      urgentDefinition: body.urgentDefinition,
      openclawPaths: body.openclawPaths,
    },
    create: {
      userId: session.id,
      workingHours: body.workingHours,
      timezone: body.timezone,
      priorityRules: body.priorityRules,
      urgentDefinition: body.urgentDefinition,
      openclawPaths: body.openclawPaths,
    },
  });
  return NextResponse.json({ settings });
}
