import { prisma } from "../../../lib/prisma";

export default async function ApprovalsPage() {
  const approvals = await prisma.approvalItem.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Approvals</p>
        <h2 className="text-2xl font-semibold text-sand-100">Queue + audit trail</h2>
        <p className="text-sm text-sand-400">Clear, calm, unmistakable decisions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {approvals.map((approval) => (
          <div key={approval.id} className="panel space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-sand-100">{approval.title}</p>
                <p className="text-xs text-sand-400">{approval.type}</p>
              </div>
              <span className="rounded-full bg-brass/20 px-3 py-1 text-xs text-brass">{approval.status}</span>
            </div>
            <div className="flex gap-2">
              <button className="btn">Approve</button>
              <button className="btn">Reject</button>
            </div>
          </div>
        ))}
        {approvals.length === 0 ? (
          <div className="panel">
            <p className="text-sm text-sand-400">No approvals yet.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
