import { redirect } from "next/navigation";
import { VaultManager } from "../../../components/vault-manager";
import { getSessionUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export default async function VaultPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "OWNER") {
    redirect("/");
  }
  const items = await prisma.vaultItem.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Vault</p>
        <h2 className="text-2xl font-semibold">Secured secrets storage</h2>
        <p className="text-sm text-sand-400">Unlock with a vault master password (separate from app login).</p>
      </div>
      <VaultManager initialItems={items} />
    </div>
  );
}
