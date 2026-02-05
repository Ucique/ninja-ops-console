import { AccountForm } from "../../../../components/account-form";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">Account security</p>
        <h2 className="text-2xl font-semibold">Update password</h2>
      </div>
      <AccountForm />
    </div>
  );
}
