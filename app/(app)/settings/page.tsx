import { prisma } from "../../../lib/prisma";
import { SettingsForm } from "../../../components/settings-form";
import { ArtifactImporter } from "../../../components/artifact-importer";

export default async function SettingsPage() {
  const settings = await prisma.userSettings.findFirst();
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Settings</p>
        <h2 className="text-2xl font-semibold text-sand-100">Preferences & integrations</h2>
        <p className="text-sm text-sand-400">Tune your cabinet workflow.</p>
      </div>
      {settings ? (
        <SettingsForm initial={settings} />
      ) : (
        <div className="panel">
          <p className="text-sm text-sand-400">No settings found.</p>
        </div>
      )}
      <ArtifactImporter />
      <div className="panel">
        <p className="kicker">Agent handoff</p>
        <p className="text-sm text-sand-400">OpenClaw should read/write within:</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-sand-400">
          <li>/app/api (API endpoints)</li>
          <li>/app/(app) (UI screens)</li>
          <li>/prisma (data model + seed)</li>
        </ul>
      </div>
    </div>
  );
}
