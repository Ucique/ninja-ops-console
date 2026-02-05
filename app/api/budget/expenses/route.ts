import { getSessionUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await prisma.budgetSettings.findFirst();
  if (!settings) {
    return Response.json({ expenses: [] });
  }
  const expenses = await prisma.expense.findMany({
    where: { settingsId: settings.id },
    orderBy: { date: "desc" },
    include: { createdBy: true },
  });
  return Response.json({ expenses });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await prisma.budgetSettings.findFirst();
  if (!settings) {
    return Response.json({ error: "Budget settings not found" }, { status: 404 });
  }
  const payload = await request.json();
  const expense = await prisma.expense.create({
    data: {
      amount: Number(payload.amount ?? 0),
      category: payload.category ?? "Other",
      note: payload.note ?? null,
      date: payload.date ? new Date(payload.date) : new Date(),
      createdById: user.id,
      settingsId: settings.id,
    },
  });
  return Response.json({ expense });
}
