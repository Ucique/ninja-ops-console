import { prisma } from "../../../lib/prisma";

export default async function GoalsPage() {
  const goals = await prisma.goal.findMany({ orderBy: { createdAt: "desc" } });
  const achievements = await prisma.achievement.findMany({ orderBy: { achievedAt: "desc" }, take: 6 });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker">Goals</p>
          <h2 className="text-2xl font-semibold text-sand-100">Long-term + short-term</h2>
          <p className="text-sm text-sand-400">Track intent, celebrate momentum.</p>
        </div>
        <button className="btn btn-primary">Add goal</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.length === 0 ? (
          <div className="panel">
            <p className="text-sm text-sand-400">No goals yet. Start by adding a long-term target.</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="panel space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-sand-100">{goal.title}</p>
                  <p className="text-xs text-sand-400">{goal.type}</p>
                </div>
                <span className="text-sm font-semibold text-accent">{goal.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-ember-700">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="panel space-y-4">
        <p className="kicker">Achievements</p>
        <div className="grid gap-3 md:grid-cols-2">
          {achievements.length ? (
            achievements.map((achievement) => (
              <div key={achievement.id} className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-4">
                <p className="text-sm font-semibold text-sand-100">{achievement.title}</p>
                <p className="text-xs text-sand-400">{achievement.description ?? "Win logged"}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-sand-400">Log wins to reinforce momentum.</p>
          )}
        </div>
      </div>
    </div>
  );
}
