import { prisma } from "../../../lib/prisma";

export default async function ApprovalsPage() {
  const approvals = await prisma.approvalItem.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Approvals</p>
        <h2 className="text-2xl font-semibold">Queue + audit trail</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {approvals.map((approval) => (
          <div key={approval.id} className="card space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">{approval.title}</p>
                <p className="text-xs text-slate-500">{approval.type}</p>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">{approval.status}</span>
            </div>
            <div className="flex gap-2">
              <button className="btn">Approve</button>
              <button className="btn">Reject</button>
            </div>
          </div>
        ))}
        {approvals.length === 0 ? (
          <div className="card">
            <p className="text-sm text-slate-500">No approvals yet.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
