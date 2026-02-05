import { prisma } from "../../../lib/prisma";

export default async function GoalsPage() {
  const goals = await prisma.goal.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker">Goals</p>
          <h2 className="text-2xl font-semibold">Long-term + short-term</h2>
        </div>
        <button className="btn btn-primary">Add goal</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.length === 0 ? (
          <div className="card">
            <p className="text-sm text-slate-500">No goals yet. Start by adding a long-term target.</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold">{goal.title}</p>
                  <p className="text-xs text-slate-500">{goal.type}</p>
                </div>
                <span className="text-sm font-semibold text-accent">{goal.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
