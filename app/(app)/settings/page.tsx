import { prisma } from "../../../lib/prisma";
import { SettingsForm } from "../../../components/settings-form";
import { ArtifactImporter } from "../../../components/artifact-importer";

export default async function SettingsPage() {
  const settings = await prisma.userSettings.findFirst();
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Settings</p>
        <h2 className="text-2xl font-semibold">Preferences & integrations</h2>
      </div>
      {settings ? (
        <SettingsForm initial={settings} />
      ) : (
        <div className="card">
          <p className="text-sm text-slate-500">No settings found.</p>
        </div>
      )}
      <ArtifactImporter />
      <div className="card">
        <p className="kicker">Agent handoff</p>
        <p className="text-sm text-slate-500">OpenClaw should read/write within:</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-500">
          <li>/app/api (API endpoints)</li>
          <li>/app/(app) (UI screens)</li>
          <li>/prisma (data model + seed)</li>
        </ul>
      </div>
    </div>
  );
}
