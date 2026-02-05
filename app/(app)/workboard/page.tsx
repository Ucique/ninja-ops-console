import { prisma } from "../../../lib/prisma";

const COLUMNS = ["Backlog", "In Progress", "Review", "Waiting for Approval", "Approved", "Done"];

export default async function WorkboardPage() {
  const tasks = await prisma.task.findMany();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker">Workboard</p>
          <h2 className="text-2xl font-semibold">Execution flow</h2>
        </div>
        <button className="btn btn-primary">New task</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-6">
        {COLUMNS.map((column) => (
          <div key={column} className="card space-y-3">
            <p className="text-sm font-semibold">{column}</p>
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <div key={task.id} className="rounded-xl border p-3">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.priority} · {task.urgency}</p>
                  </div>
                ))}
              {tasks.filter((task) => task.status === column).length === 0 ? (
                <p className="text-xs text-slate-500">Empty</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
