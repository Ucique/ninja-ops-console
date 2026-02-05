import { prisma } from "../../../lib/prisma";

export default async function PlannerPage() {
  const blocks = await prisma.scheduleBlock.findMany({ orderBy: { startTime: "asc" }, take: 6 });
  return (
    <div className="space-y-6">
      <div className="card">
        <p className="kicker">Daily view</p>
        <div className="grid gap-3 md:grid-cols-3">
          {blocks.map((block) => (
            <div key={block.id} className="rounded-xl border p-3">
              <p className="font-medium">{block.title}</p>
              <p className="text-xs text-slate-500">
                {block.startTime.toLocaleString()} - {block.endTime.toLocaleString()}
              </p>
            </div>
          ))}
          {blocks.length === 0 ? (
            <p className="text-sm text-slate-500">No blocks scheduled yet.</p>
          ) : null}
        </div>
      </div>
      <div className="card">
        <p className="kicker">Weekly view</p>
        <div className="grid gap-3 md:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-3 text-sm text-slate-500">
              <p className="font-medium text-slate-700 dark:text-slate-200">Day {index + 1}</p>
              <p>Drop tasks here.</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <p className="kicker">Next actions</p>
        <ul className="space-y-2 text-sm">
          <li>Review affiliate approvals and update timeline.</li>
          <li>Block 2 hours for OpenClaw asset refresh.</li>
          <li>Schedule creative review with partner network.</li>
        </ul>
      </div>
    </div>
  );
}
