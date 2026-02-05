import { prisma } from "../../../lib/prisma";

export default async function IdeasPage() {
  const ideas = await prisma.idea.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker">Ideas inbox</p>
          <h2 className="text-2xl font-semibold">Capture and triage</h2>
        </div>
        <button className="btn btn-primary">Add idea</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {ideas.map((idea) => (
          <div key={idea.id} className="card space-y-2">
            <p className="text-lg font-semibold">{idea.title}</p>
            <p className="text-sm text-slate-500">{idea.description}</p>
            <div className="flex gap-2">
              <button className="btn">Keep</button>
              <button className="btn">Convert to task</button>
              <button className="btn">Discard</button>
            </div>
          </div>
        ))}
        {ideas.length === 0 ? (
          <div className="card">
            <p className="text-sm text-slate-500">Capture your next experiments here.</p>
          </div>
        ) : null}
      </div>
      <div className="card">
        <p className="kicker">Recommendations</p>
        <p className="text-sm text-slate-500">Paste agent suggestions or next steps to review later.</p>
        <textarea className="input mt-3 h-32" placeholder="Add recommendations..." />
      </div>
    </div>
  );
}
