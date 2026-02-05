"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BudgetSettings = {
  id: string;
  currency: string;
  monthlyLimit: number;
  weeklyLimit: number | null;
  resetDay: number;
};

type ExpenseItem = {
  id: string;
  amount: number;
  category: string;
  note: string | null;
  date: string;
  createdBy: { name: string | null; email: string };
};

type BudgetSummary = {
  weekSpend: string;
  monthSpend: string;
  weekLimit: string;
  monthLimit: string;
  weekPercent: number;
  monthPercent: number;
  state: "calm" | "warning" | "urgent";
};

const CATEGORIES = ["Ads", "Tools/Subscriptions", "Domains/Hosting", "Contractors", "Other"];

export function BudgetConsole({
  settings,
  expenses,
  summary,
  canEdit,
}: {
  settings: BudgetSettings | null;
  expenses: ExpenseItem[];
  summary: BudgetSummary | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [expenseStatus, setExpenseStatus] = useState<string | null>(null);
  const canAddExpense = Boolean(settings);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: settings?.currency ?? "USD",
    maximumFractionDigits: 0,
  });
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: CATEGORIES[0],
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [settingsForm, setSettingsForm] = useState({
    currency: settings?.currency ?? "USD",
    monthlyLimit: settings?.monthlyLimit?.toString() ?? "5000",
    weeklyLimit: settings?.weeklyLimit?.toString() ?? "",
    resetDay: settings?.resetDay?.toString() ?? "1",
  });

  async function handleSaveSettings() {
    if (!canEdit) return;
    setStatus(null);
    const response = await fetch("/api/budget/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: settingsForm.currency,
        monthlyLimit: Number(settingsForm.monthlyLimit),
        weeklyLimit: settingsForm.weeklyLimit ? Number(settingsForm.weeklyLimit) : null,
        resetDay: Number(settingsForm.resetDay),
      }),
    });
    setStatus(response.ok ? "Budget settings updated." : "Unable to update settings.");
    if (response.ok) {
      router.refresh();
    }
  }

  async function handleAddExpense(event: React.FormEvent) {
    event.preventDefault();
    if (!canAddExpense) {
      setExpenseStatus("Budget settings are required before logging expenses.");
      return;
    }
    setExpenseStatus(null);
    const response = await fetch("/api/budget/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        note: expenseForm.note,
        date: expenseForm.date,
      }),
    });
    setExpenseStatus(response.ok ? "Expense added." : "Unable to add expense.");
    if (response.ok) {
      setExpenseForm((prev) => ({ ...prev, amount: "", note: "" }));
      router.refresh();
    }
  }

  function handleExportCsv() {
    if (!expenses.length) {
      setExpenseStatus("No expenses to export.");
      return;
    }
    const headers = ["Date", "Amount", "Category", "Note", "Created By"];
    const rows = expenses.map((expense) => [
      expense.date,
      expense.amount.toString(),
      expense.category,
      expense.note ?? "",
      expense.createdBy.name ?? expense.createdBy.email,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${value}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "budget-expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker">Budget</p>
          <h2 className="text-2xl font-semibold text-sand-100">Financial calm + spend clarity</h2>
          <p className="text-sm text-sand-400">
            Track weekly + monthly spend. Keep leverage high by preventing creep.
          </p>
        </div>
        {summary ? (
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              summary.state === "urgent"
                ? "bg-wine text-sand-100"
                : summary.state === "warning"
                ? "bg-brass text-ember-950"
                : "bg-petrol text-sand-100"
            }`}
          >
            {summary.state === "urgent" ? "Urgent: spend locked" : summary.state === "warning" ? "Caution zone" : "Calm zone"}
          </span>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel space-y-5">
          <div>
            <p className="kicker">Monthly overview</p>
            {summary ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sand-400">This month</span>
                    <span className="text-sand-200">
                      {summary.monthSpend} / {summary.monthLimit}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-ember-700">
                    <div
                      className={`h-2 rounded-full ${
                        summary.monthPercent >= 0.9
                          ? "bg-wine"
                          : summary.monthPercent >= 0.6
                          ? "bg-brass"
                          : "bg-petrol"
                      }`}
                      style={{ width: `${Math.min(summary.monthPercent * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sand-400">This week</span>
                    <span className="text-sand-200">
                      {summary.weekSpend} / {summary.weekLimit}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-ember-700">
                    <div
                      className={`h-2 rounded-full ${
                        summary.weekPercent >= 0.9
                          ? "bg-wine"
                          : summary.weekPercent >= 0.6
                          ? "bg-brass"
                          : "bg-petrol"
                      }`}
                      style={{ width: `${Math.min(summary.weekPercent * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-sand-400">Budget settings not configured yet.</p>
            )}
          </div>
          <div className="divider" />
          <div>
            <p className="kicker">Quick-add expense</p>
            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleAddExpense}>
              <input
                className="input"
                placeholder="Amount"
                inputMode="decimal"
                type="number"
                value={expenseForm.amount}
                onChange={(event) => setExpenseForm({ ...expenseForm, amount: event.target.value })}
                required
                disabled={!canAddExpense}
              />
              <select
                className="input"
                value={expenseForm.category}
                onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })}
                disabled={!canAddExpense}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                className="input"
                type="date"
                value={expenseForm.date}
                onChange={(event) => setExpenseForm({ ...expenseForm, date: event.target.value })}
                disabled={!canAddExpense}
              />
              <input
                className="input"
                placeholder="Note"
                value={expenseForm.note}
                onChange={(event) => setExpenseForm({ ...expenseForm, note: event.target.value })}
                disabled={!canAddExpense}
              />
              <button className="btn btn-primary md:col-span-2" type="submit" disabled={!canAddExpense}>
                Add expense
              </button>
            </form>
            {expenseStatus ? <p className="mt-2 text-xs text-sand-400">{expenseStatus}</p> : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel space-y-4">
            <p className="kicker">Budget settings</p>
            {settings ? (
              <>
                {canEdit ? (
                  <div className="grid gap-3">
                    <input
                      className="input"
                      placeholder="Currency (USD)"
                      value={settingsForm.currency}
                      onChange={(event) => setSettingsForm({ ...settingsForm, currency: event.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Monthly limit"
                      type="number"
                      value={settingsForm.monthlyLimit}
                      onChange={(event) => setSettingsForm({ ...settingsForm, monthlyLimit: event.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Weekly limit (optional)"
                      type="number"
                      value={settingsForm.weeklyLimit}
                      onChange={(event) => setSettingsForm({ ...settingsForm, weeklyLimit: event.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Reset day (1=Mon, 7=Sun)"
                      type="number"
                      min={1}
                      max={7}
                      value={settingsForm.resetDay}
                      onChange={(event) => setSettingsForm({ ...settingsForm, resetDay: event.target.value })}
                    />
                    <button className="btn btn-primary" type="button" onClick={handleSaveSettings}>
                      Save limits
                    </button>
                    {status ? <p className="text-xs text-sand-400">{status}</p> : null}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-sand-300">
                    <p>
                      Currency: <span className="text-sand-100">{settings.currency}</span>
                    </p>
                    <p>
                      Monthly limit: <span className="text-sand-100">{settings.monthlyLimit}</span>
                    </p>
                    <p>
                      Weekly limit: <span className="text-sand-100">{settings.weeklyLimit ?? "Auto"}</span>
                    </p>
                    <p>
                      Reset day: <span className="text-sand-100">{settings.resetDay}</span>
                    </p>
                    <p className="text-xs text-sand-400">Only owners can update limits or currency.</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-sand-400">
                Budget settings are not available yet. Owners can configure limits.
              </p>
            )}
          </div>

          <div className="panel space-y-4">
            <div className="flex items-center justify-between">
              <p className="kicker">Recent expenses</p>
              <button className="btn" type="button" onClick={handleExportCsv}>
                Export CSV
              </button>
            </div>
            <div className="space-y-3">
              {expenses.length ? (
                expenses.map((expense) => (
                  <div key={expense.id} className="rounded-2xl border border-ember-700/70 bg-ember-900/50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-sand-100">{expense.category}</p>
                        <p className="text-xs text-sand-400">{expense.note ?? "No note"}</p>
                      </div>
                      <span className="text-sm font-semibold text-sand-100">
                        {formatter.format(expense.amount)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-sand-400">
                      {expense.date} · {expense.createdBy.name ?? expense.createdBy.email}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-sand-400">No expenses logged yet.</p>
              )}
            </div>
            {expenseStatus ? <p className="text-xs text-sand-400">{expenseStatus}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
