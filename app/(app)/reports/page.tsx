import { prisma } from "../../../lib/prisma";

export default async function ReportsPage() {
  const activity = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 });
  const achievements = await prisma.achievement.findMany({ orderBy: { achievedAt: "desc" }, take: 4 });
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Reports shelf</p>
        <h2 className="text-2xl font-semibold text-sand-100">Artifacts + learning loops</h2>
        <p className="text-sm text-sand-400">Keep signals visible, without noisy lists.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel space-y-4">
          <p className="kicker">Recent signals</p>
          <div className="space-y-3">
            {activity.length ? (
              activity.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-4">
                  <p className="text-sm font-semibold text-sand-100">{entry.action}</p>
                  <p className="text-xs text-sand-400">{entry.message ?? entry.entity}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-sand-400">No activity signals yet.</p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="panel space-y-3">
            <p className="kicker">Artifacts shelf</p>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-4 text-sm text-sand-400">
                Weekly performance recap
              </div>
              <div className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-4 text-sm text-sand-400">
                Creative test results
              </div>
              <div className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-4 text-sm text-sand-400">
                Partner scorecards
              </div>
            </div>
          </div>
          <div className="panel space-y-3">
            <p className="kicker">Achievements</p>
            <div className="space-y-2">
              {achievements.length ? (
                achievements.map((achievement) => (
                  <div key={achievement.id} className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-4">
                    <p className="text-sm font-semibold text-sand-100">{achievement.title}</p>
                    <p className="text-xs text-sand-400">{achievement.description ?? "Achievement logged"}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-sand-400">No achievements logged.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
