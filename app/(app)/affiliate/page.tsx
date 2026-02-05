import { prisma } from "../../../lib/prisma";

export default async function AffiliatePage() {
  const programs = await prisma.affiliateProgram.findMany({ include: { links: true } });
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Affiliate library</p>
        <h2 className="text-2xl font-semibold text-sand-100">Programs and links</h2>
        <p className="text-sm text-sand-400">Visual groupings for every partner.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((program) => (
          <div key={program.id} className="panel space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-sand-100">{program.name}</p>
                <p className="text-xs text-sand-400">{program.network}</p>
              </div>
              <span className="rounded-full bg-petrol/20 px-3 py-1 text-xs text-petrol">{program.status}</span>
            </div>
            <p className="text-sm text-sand-400">{program.commission} · {program.cookieDays} day cookie</p>
            <div className="space-y-2">
              {program.links.map((link) => (
                <div key={link.id} className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-3 text-sm">
                  <p className="font-medium text-sand-100">{link.label}</p>
                  <p className="text-xs text-sand-400">{link.destination}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {programs.length === 0 ? (
          <div className="panel">
            <p className="text-sm text-sand-400">No programs yet.</p>
          </div>
        ) : null}
      </div>
      <div className="panel">
        <p className="kicker">Creative assets</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-3 text-sm text-sand-400">Copy snippets</div>
          <div className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-3 text-sm text-sand-400">Hooks & angles</div>
          <div className="rounded-2xl border border-ember-700/70 bg-ember-900/40 p-3 text-sm text-sand-400">CTA variations</div>
        </div>
      </div>
    </div>
  );
}
