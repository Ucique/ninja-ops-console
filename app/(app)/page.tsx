import { prisma } from "../../lib/prisma";

export default async function DashboardPage() {
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
    take: 20,
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Backlog", value: "12" },
          { label: "In Progress", value: "6" },
          { label: "Waiting Approval", value: "3" },
          { label: "Done", value: "28" },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <p className="kicker">Status</p>
            <p className="text-lg font-semibold">{stat.label}</p>
            <p className="text-3xl font-bold text-accent">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card space-y-4">
          <div>
            <p className="kicker">Today focus</p>
            <h2 className="text-xl font-semibold">Top urgent tasks</h2>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.status} · {task.priority}</p>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">{task.urgency}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card space-y-3">
            <p className="kicker">Approvals pending</p>
            {approvals.length === 0 ? (
              <p className="text-sm text-slate-500">No approvals queued.</p>
            ) : (
              approvals.map((approval) => (
                <div key={approval.id} className="rounded-xl border p-3">
                  <p className="font-medium">{approval.title}</p>
                  <p className="text-xs text-slate-500">{approval.type}</p>
                </div>
              ))
            )}
          </div>
          <div className="card space-y-3">
            <p className="kicker">Ideas to triage</p>
            {ideas.map((idea) => (
              <div key={idea.id} className="rounded-xl border p-3">
                <p className="font-medium">{idea.title}</p>
                <p className="text-xs text-slate-500">{idea.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card space-y-4">
          <p className="kicker">Quick add</p>
          <form className="grid gap-3 md:grid-cols-2">
            <input className="input" placeholder="Task" />
            <input className="input" placeholder="Idea" />
            <input className="input" placeholder="Affiliate link" />
            <input className="input" placeholder="Note" />
            <button className="btn btn-primary md:col-span-2" type="button">
              Save capture
            </button>
          </form>
        </div>
        <div className="card space-y-3">
          <p className="kicker">Recent activity</p>
          <div className="space-y-2 text-sm">
            {activity.map((entry) => (
              <div key={entry.id} className="rounded-xl border px-3 py-2">
                <p className="font-medium">{entry.action}</p>
                <p className="text-xs text-slate-500">{entry.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
