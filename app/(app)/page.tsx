import { CabinetDashboard } from "../../components/cabinet-dashboard";
import { formatCurrency, getBudgetState, resolveWeeklyLimit } from "../../lib/budget";
import { prisma } from "../../lib/prisma";

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

export default async function CabinetPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const approvals = await prisma.approvalItem.findMany({
    where: { status: "pending" },
    take: 3,
  });
  const ideas = await prisma.idea.findMany({ take: 3 });
  const activity = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  const goals = await prisma.goal.findMany({ orderBy: { createdAt: "desc" }, take: 3 });
  const achievements = await prisma.achievement.findMany({ orderBy: { achievedAt: "desc" }, take: 3 });
  const programs = await prisma.affiliateProgram.findMany({ take: 3 });
  const blocks = await prisma.scheduleBlock.findMany({ orderBy: { startTime: "asc" }, take: 3 });
  const budgetSettings = await prisma.budgetSettings.findFirst();

  let budgetSummary = null;
  let budgetStateLabel = "Spend calm";

  if (budgetSettings) {
    const now = new Date();
    const weekStart = startOfWeek(budgetSettings.resetDay);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekSum = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { settingsId: budgetSettings.id, date: { gte: weekStart } },
    });
    const monthSum = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { settingsId: budgetSettings.id, date: { gte: monthStart } },
    });

    const weeklyLimit = resolveWeeklyLimit(budgetSettings.monthlyLimit, budgetSettings.weeklyLimit);
    const weekSpend = weekSum._sum.amount ?? 0;
    const monthSpend = monthSum._sum.amount ?? 0;
    const weekPercent = weeklyLimit ? weekSpend / weeklyLimit : 0;
    const monthPercent = budgetSettings.monthlyLimit ? monthSpend / budgetSettings.monthlyLimit : 0;
    const state = getBudgetState(Math.max(weekPercent, monthPercent));

    budgetStateLabel = state === "urgent" ? "Spend locked" : state === "warning" ? "Spend cautious" : "Spend calm";

    budgetSummary = {
      weekSpend: formatCurrency(weekSpend, budgetSettings.currency),
      monthSpend: formatCurrency(monthSpend, budgetSettings.currency),
      weekLimit: formatCurrency(weeklyLimit, budgetSettings.currency),
      monthLimit: formatCurrency(budgetSettings.monthlyLimit, budgetSettings.currency),
      weekPercent,
      monthPercent,
      state,
    };
  }

  const compartments = [
    {
      id: "today",
      title: "🔥 Today / Urgent",
      href: "/workboard",
      description: "Now + next actions with time pressure.",
      tone: "bg-gradient-to-br from-ember-850/80 via-ember-900/70 to-wine/10",
      primaryAction: "Open Workboard",
      urgencyScore: 5,
      leverageScore: 3,
      stats: [`${tasks.length} tasks live`, `${approvals.length} approvals`],
      items: tasks.length
        ? tasks.map((task) => ({
            title: task.title,
            meta: `${task.status} · ${task.urgency}`,
          }))
        : [{ title: "No urgent tasks. Keep the day light.", meta: "Ready for creative focus." }],
    },
    {
      id: "money",
      title: "⚡ Money & High-Leverage",
      href: "/budget",
      description: "Protect spend, amplify impact.",
      tone: "bg-gradient-to-br from-ember-850/90 via-ember-900/80 to-brass/10",
      primaryAction: "Review Budget",
      urgencyScore: 4,
      leverageScore: 5,
      stats: budgetSummary ? [`Budget: ${budgetStateLabel}`] : ["Budget not set"],
      items: [
        {
          title: budgetSummary ? budgetSummary.monthSpend : "No budget data yet",
          meta: budgetSummary ? `This month · ${budgetSummary.monthLimit}` : "Set limits in Budget",
        },
        {
          title: "Approvals + spend checkpoints",
          meta: `${approvals.length} approvals pending`,
        },
      ],
    },
    {
      id: "budget",
      title: "💰 Budget",
      href: "/budget",
      description: "Weekly + monthly spend against limits.",
      tone: "bg-gradient-to-br from-ember-850/80 via-ember-900/80 to-brass/10",
      primaryAction: "Open Budget",
      urgencyScore: budgetSummary?.state === "urgent" ? 5 : budgetSummary?.state === "warning" ? 4 : 2,
      leverageScore: 5,
      stats: budgetSummary ? [`${budgetSummary.weekSpend} · this week`] : ["Set weekly + monthly limits"],
      items: budgetSummary
        ? [
            {
              title: budgetSummary.weekSpend,
              meta: `Week limit · ${budgetSummary.weekLimit}`,
            },
            {
              title: budgetSummary.monthSpend,
              meta: `Month limit · ${budgetSummary.monthLimit}`,
            },
          ]
        : [{ title: "Budget not configured", meta: "Add limits and track spend." }],
    },
    {
      id: "strategy",
      title: "🧠 Strategy & Thinking",
      href: "/goals",
      description: "Long-horizon planning and narrative clarity.",
      tone: "bg-gradient-to-br from-aubergine-800/70 via-ember-900/80 to-ember-850/80",
      primaryAction: "Open Goals",
      urgencyScore: 2,
      leverageScore: 4,
      stats: [`${goals.length} active goals`],
      items: goals.length
        ? goals.map((goal) => ({ title: goal.title, meta: `${goal.type} · ${goal.progress}%` }))
        : [{ title: "No strategic goals yet.", meta: "Add a north star goal." }],
    },
    {
      id: "waiting",
      title: "⏳ Waiting / Blocked",
      href: "/approvals",
      description: "Things pending other humans or systems.",
      tone: "bg-gradient-to-br from-ember-850/80 via-ember-900/70 to-ash/10",
      primaryAction: "See Approvals",
      urgencyScore: 3,
      leverageScore: 3,
      stats: [`${approvals.length} approvals pending`],
      items: approvals.length
        ? approvals.map((approval) => ({ title: approval.title, meta: approval.type }))
        : [{ title: "No blockers right now.", meta: "Keep the flow open." }],
    },
    {
      id: "ideas",
      title: "🌱 Ideas & Research",
      href: "/ideas",
      description: "Capture, triage, and elevate experiments.",
      tone: "bg-gradient-to-br from-ember-850/80 via-ember-900/80 to-petrol/10",
      primaryAction: "Open Inbox",
      urgencyScore: 2,
      leverageScore: 4,
      stats: [`${ideas.length} ideas waiting`],
      items: ideas.length
        ? ideas.map((idea) => ({ title: idea.title, meta: idea.status }))
        : [{ title: "Ready for new ideas.", meta: "Capture a spark." }],
    },
    {
      id: "weekly",
      title: "📆 Weekly Plan",
      href: "/planner",
      description: "Drag blocks into a calm weekly rhythm.",
      tone: "bg-gradient-to-br from-ember-850/80 via-ember-900/80 to-aubergine-900/10",
      primaryAction: "Open Planner",
      urgencyScore: 3,
      leverageScore: 3,
      stats: [`${blocks.length} blocks scheduled`],
      items: blocks.length
        ? blocks.map((block) => ({
            title: block.title,
            meta: `${block.startTime.toLocaleDateString()} → ${block.endTime.toLocaleTimeString()}`,
          }))
        : [{ title: "No blocks scheduled.", meta: "Create a gentle plan." }],
    },
    {
      id: "affiliate",
      title: "🔗 Affiliate Programs & Links",
      href: "/affiliate",
      description: "Programs, links, creative assets.",
      tone: "bg-gradient-to-br from-ember-850/80 via-ember-900/80 to-petrol/10",
      primaryAction: "Open Library",
      urgencyScore: 2,
      leverageScore: 4,
      stats: [`${programs.length} programs`],
      items: programs.length
        ? programs.map((program) => ({ title: program.name, meta: program.network }))
        : [{ title: "No programs yet.", meta: "Add affiliate partners." }],
    },
    {
      id: "reports",
      title: "📊 KPIs & Reports",
      href: "/reports",
      description: "Signals, artifacts, and learning loops.",
      tone: "bg-gradient-to-br from-ember-850/80 via-ember-900/80 to-petrol/10",
      primaryAction: "Open Reports",
      urgencyScore: 3,
      leverageScore: 4,
      stats: [`${activity.length} recent signals`],
      items: activity.length
        ? activity.map((entry) => ({ title: entry.action, meta: entry.message ?? entry.entity }))
        : [{ title: "No reports logged.", meta: "Import new artifacts." }],
    },
    {
      id: "achievements",
      title: "🏆 Achievements",
      href: "/goals",
      description: "Celebrate momentum and wins.",
      tone: "bg-gradient-to-br from-ember-850/80 via-ember-900/80 to-brass/10",
      primaryAction: "View Progress",
      urgencyScore: 1,
      leverageScore: 3,
      stats: [`${achievements.length} recent wins`],
      items: achievements.length
        ? achievements.map((achievement) => ({
            title: achievement.title,
            meta: achievement.description ?? "Achievement logged",
          }))
        : [{ title: "No achievements logged yet.", meta: "Mark wins as they happen." }],
    },
  ];

  return <CabinetDashboard compartments={compartments} budgetSummary={budgetSummary} />;
}
