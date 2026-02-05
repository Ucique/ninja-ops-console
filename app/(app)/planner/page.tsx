import { prisma } from "../../../lib/prisma";

export default async function PlannerPage() {
  const blocks = await prisma.scheduleBlock.findMany({ orderBy: { startTime: "asc" }, take: 6 });
  return (
    <div className="space-y-6">
      <div className="panel">
        <p className="kicker">Daily view</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {blocks.map((block) => (
            <div key={block.id} className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-4">
              <p className="font-medium text-sand-100">{block.title}</p>
              <p className="text-xs text-sand-400">
                {block.startTime.toLocaleString()} - {block.endTime.toLocaleString()}
              </p>
            </div>
          ))}
          {blocks.length === 0 ? (
            <p className="text-sm text-sand-400">No blocks scheduled yet.</p>
          ) : null}
        </div>
      </div>
      <div className="panel">
        <p className="kicker">Weekly view</p>
        <div className="mt-4 grid gap-3 md:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-4 text-sm text-sand-400">
              <p className="font-medium text-sand-100">Day {index + 1}</p>
              <p>Drop tasks here.</p>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <p className="kicker">Next actions</p>
        <ul className="mt-4 space-y-2 text-sm text-sand-300">
          <li>Review affiliate approvals and update timeline.</li>
          <li>Block 2 hours for OpenClaw asset refresh.</li>
          <li>Schedule creative review with partner network.</li>
        </ul>
      </div>
    </div>
  );
}
