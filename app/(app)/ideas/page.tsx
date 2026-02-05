import { prisma } from "../../../lib/prisma";

export default async function IdeasPage() {
  const ideas = await prisma.idea.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker">Ideas inbox</p>
          <h2 className="text-2xl font-semibold text-sand-100">Capture and triage</h2>
          <p className="text-sm text-sand-400">Sort ideas gently before they fade.</p>
        </div>
        <button className="btn btn-primary">Add idea</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {ideas.map((idea) => (
          <div key={idea.id} className="panel space-y-2">
            <p className="text-lg font-semibold text-sand-100">{idea.title}</p>
            <p className="text-sm text-sand-400">{idea.description}</p>
            <div className="flex gap-2">
              <button className="btn">Keep</button>
              <button className="btn">Convert to task</button>
              <button className="btn">Discard</button>
            </div>
          </div>
        ))}
        {ideas.length === 0 ? (
          <div className="panel">
            <p className="text-sm text-sand-400">Capture your next experiments here.</p>
          </div>
        ) : null}
      </div>
      <div className="panel">
        <p className="kicker">Recommendations</p>
        <p className="text-sm text-sand-400">Paste agent suggestions or next steps to review later.</p>
        <textarea className="input mt-3 h-32" placeholder="Add recommendations..." />
      </div>
    </div>
  );
}
