import { BudgetConsole } from "../../../components/budget-console";
import { getSessionUser } from "../../../lib/auth";
import { formatCurrency, getBudgetState, resolveWeeklyLimit } from "../../../lib/budget";
import { prisma } from "../../../lib/prisma";

function startOfWeek(resetDay: number) {
  const now = new Date();
  const dayIndex = now.getDay();
  const normalizedReset = resetDay === 7 ? 0 : resetDay;
  const diff = (dayIndex - normalizedReset + 7) % 7;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export default async function BudgetPage() {
  const user = await getSessionUser();
  const canEdit = user?.role === "OWNER";
  let settings = await prisma.budgetSettings.findFirst();

  if (!settings && user && canEdit) {
    settings = await prisma.budgetSettings.create({
      data: {
        ownerId: user.id,
      },
    });
  }

  const expenses = settings
    ? await prisma.expense.findMany({
        where: { settingsId: settings.id },
        orderBy: { date: "desc" },
        take: 12,
        include: { createdBy: true },
      })
    : [];

  let summary = null;
  if (settings) {
    const now = new Date();
    const weekStart = startOfWeek(settings.resetDay);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekSum = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { settingsId: settings.id, date: { gte: weekStart } },
    });
    const monthSum = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { settingsId: settings.id, date: { gte: monthStart } },
    });
    const weeklyLimit = resolveWeeklyLimit(settings.monthlyLimit, settings.weeklyLimit);
    const weekSpend = weekSum._sum.amount ?? 0;
    const monthSpend = monthSum._sum.amount ?? 0;
    const weekPercent = weeklyLimit ? weekSpend / weeklyLimit : 0;
    const monthPercent = settings.monthlyLimit ? monthSpend / settings.monthlyLimit : 0;
    summary = {
      weekSpend: formatCurrency(weekSpend, settings.currency),
      monthSpend: formatCurrency(monthSpend, settings.currency),
      weekLimit: formatCurrency(weeklyLimit, settings.currency),
      monthLimit: formatCurrency(settings.monthlyLimit, settings.currency),
      weekPercent,
      monthPercent,
      state: getBudgetState(Math.max(weekPercent, monthPercent)),
    };
  }

  return (
    <BudgetConsole
      settings={settings}
      expenses={expenses.map((expense) => ({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        note: expense.note,
        date: expense.date.toISOString().slice(0, 10),
        createdBy: {
          name: expense.createdBy.name,
          email: expense.createdBy.email,
        },
      }))}
      summary={summary}
      canEdit={canEdit}
    />
  );
}
