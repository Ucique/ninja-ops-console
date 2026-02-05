export type BudgetState = "calm" | "warning" | "urgent";

export function getBudgetState(percent: number): BudgetState {
  if (percent >= 0.9) return "urgent";
  if (percent >= 0.6) return "warning";
  return "calm";
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function resolveWeeklyLimit(monthlyLimit: number, weeklyLimit?: number | null) {
  if (weeklyLimit && weeklyLimit > 0) {
    return weeklyLimit;
  }
  return monthlyLimit / 4;
}
