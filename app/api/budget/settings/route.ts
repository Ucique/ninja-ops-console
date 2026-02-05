import { getSessionUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await prisma.budgetSettings.findFirst();
  if (!settings) {
    return Response.json({ settings: null });
  }
  return Response.json({ settings });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "OWNER") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await request.json();
  const settings = await prisma.budgetSettings.upsert({
    where: { ownerId: user.id },
    update: {
      currency: payload.currency ?? "USD",
      monthlyLimit: Number(payload.monthlyLimit ?? 0),
      weeklyLimit: payload.weeklyLimit ? Number(payload.weeklyLimit) : null,
      resetDay: Number(payload.resetDay ?? 1),
    },
    create: {
      ownerId: user.id,
      currency: payload.currency ?? "USD",
      monthlyLimit: Number(payload.monthlyLimit ?? 0),
      weeklyLimit: payload.weeklyLimit ? Number(payload.weeklyLimit) : null,
      resetDay: Number(payload.resetDay ?? 1),
    },
  });
  return Response.json({ settings });
}
