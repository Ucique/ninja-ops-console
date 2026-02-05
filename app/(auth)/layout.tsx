export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ember-950 p-6">
      <div className="w-full max-w-md rounded-3xl border border-ember-700/70 bg-ember-850 p-8 shadow-soft">
        {children}
      </div>
    </div>
  );
}
