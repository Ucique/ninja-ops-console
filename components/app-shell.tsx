"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Planner", href: "/planner" },
  { label: "Workboard", href: "/workboard" },
  { label: "Goals", href: "/goals" },
  { label: "Ideas", href: "/ideas" },
  { label: "Affiliate", href: "/affiliate" },
  { label: "Approvals", href: "/approvals" },
  { label: "Vault", href: "/vault" },
  { label: "Settings", href: "/settings" },
];

export function AppShell({ children, userName }: { children: React.ReactNode; userName: string | null }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <CommandPalette />
      <aside className="hidden w-64 flex-col gap-6 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 lg:flex">
        <div>
          <p className="kicker">Command Center</p>
          <h1 className="text-lg font-semibold">Ninja Ops</h1>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-200">Signed in</p>
            <p>{userName ?? "Ops User"}</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="btn w-full" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
          <div>
            <p className="text-sm text-slate-500">Press ⌘/Ctrl + K for quick navigation</p>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
