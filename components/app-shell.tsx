"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Cabinet", href: "/" },
  { label: "Planner", href: "/planner" },
  { label: "Workboard", href: "/workboard" },
  { label: "Inbox", href: "/ideas" },
  { label: "Approvals", href: "/approvals" },
  { label: "Affiliate Library", href: "/affiliate" },
  { label: "Budget", href: "/budget" },
  { label: "Reports", href: "/reports" },
  { label: "Goals & Achievements", href: "/goals" },
  { label: "Vault", href: "/vault" },
  { label: "Settings", href: "/settings" },
];

type AppShellProps = {
  children: React.ReactNode;
  userName: string | null;
  userRole: "OWNER" | "OPERATOR";
};

export function AppShell({ children, userName, userRole }: AppShellProps) {
  const pathname = usePathname();
  const navItems = userRole === "OWNER" ? NAV_ITEMS : NAV_ITEMS.filter((item) => item.href !== "/vault");
  return (
    <div className="flex min-h-screen bg-ember-900 text-sand-200">
      <CommandPalette commands={navItems} />
      <aside className="hidden w-72 flex-col gap-6 border-r border-ember-700/70 bg-ember-950/60 p-6 lg:flex">
        <div>
          <p className="kicker">Cabinet</p>
          <h1 className="text-lg font-semibold text-sand-100">Ninja Ops Console</h1>
          <p className="text-xs text-sand-400">Warm, deliberate, and visual-first.</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
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
          <div className="rounded-3xl border border-ember-700/70 bg-ember-850 p-4 text-xs text-sand-400">
            <p className="font-semibold text-sand-100">Signed in</p>
            <p>{userName ?? "Ops User"}</p>
            <p className="mt-1 uppercase tracking-[0.2em] text-[10px] text-sand-400">{userRole}</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="btn w-full" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-ember-700/60 bg-ember-900/80 px-6 py-4">
          <div>
            <p className="text-sm text-sand-400">Press ⌘/Ctrl + K for quick navigation</p>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
