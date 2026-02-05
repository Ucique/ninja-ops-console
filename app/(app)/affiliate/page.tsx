import { prisma } from "../../../lib/prisma";

export default async function AffiliatePage() {
  const programs = await prisma.affiliateProgram.findMany({ include: { links: true } });
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Affiliate library</p>
        <h2 className="text-2xl font-semibold">Programs and links</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((program) => (
          <div key={program.id} className="card space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">{program.name}</p>
                <p className="text-xs text-slate-500">{program.network}</p>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">{program.status}</span>
            </div>
            <p className="text-sm text-slate-500">{program.commission} · {program.cookieDays} day cookie</p>
            <div className="space-y-2">
              {program.links.map((link) => (
                <div key={link.id} className="rounded-xl border p-3 text-sm">
                  <p className="font-medium">{link.label}</p>
                  <p className="text-xs text-slate-500">{link.destination}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {programs.length === 0 ? (
          <div className="card">
            <p className="text-sm text-slate-500">No programs yet.</p>
          </div>
        ) : null}
      </div>
      <div className="card">
        <p className="kicker">Creative assets</p>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border p-3 text-sm text-slate-500">Copy snippets</div>
          <div className="rounded-xl border p-3 text-sm text-slate-500">Hooks & angles</div>
          <div className="rounded-xl border p-3 text-sm text-slate-500">CTA variations</div>
        </div>
      </div>
    </div>
  );
}
