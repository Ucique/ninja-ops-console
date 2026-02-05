import { prisma } from "../../../lib/prisma";
import { VaultManager } from "../../../components/vault-manager";

export default async function VaultPage() {
  const items = await prisma.vaultItem.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Vault</p>
        <h2 className="text-2xl font-semibold">Secured secrets storage</h2>
        <p className="text-sm text-slate-500">Unlock with a vault master password (separate from app login).</p>
      </div>
      <VaultManager initialItems={items} />
    </div>
  );
}
