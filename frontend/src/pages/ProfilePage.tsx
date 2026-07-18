import { useAppSelector } from "../store/hooks";
import { useTaskStats } from "../hooks/useTasks";
import { TaskStatus, TaskPriority } from "../types";
import { getErrorMessage } from "../api/client";
import { Card } from "../components/ui/Card";

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, error } = useTaskStats();
  const stats = data?.data?.stats;

  const maxStatusCount = stats
    ? Math.max(...Object.values(stats.byStatus), 1)
    : 1;
  const maxPriorityCount = stats
    ? Math.max(...Object.values(stats.byPriority), 1)
    : 1;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <Card className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/20 text-3xl font-semibold text-indigo-200">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">{user?.name}</h1>
          <p className="mt-1 text-slate-400">{user?.email}</p>
          {user?.createdAt ? (
            <p className="mt-2 text-sm text-slate-500">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5"
              >
                <div className="h-8 w-16 rounded bg-slate-800" />
                <div className="mt-3 h-3 w-24 rounded bg-slate-800/70" />
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6"
              >
                <div className="h-5 w-32 rounded bg-slate-800" />
                <div className="mt-4 space-y-3">
                  <div className="h-3 w-full rounded bg-slate-800/70" />
                  <div className="h-3 w-5/6 rounded bg-slate-800/70" />
                  <div className="h-3 w-4/6 rounded bg-slate-800/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {getErrorMessage(error)}
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="p-5">
              <div className="text-3xl font-semibold text-white">
                {stats.total}
              </div>
              <div className="mt-2 text-sm text-slate-400">Total tasks</div>
            </Card>
            <Card className="p-5">
              <div className="text-3xl font-semibold text-emerald-300">
                {stats.byStatus[TaskStatus.COMPLETED]}
              </div>
              <div className="mt-2 text-sm text-slate-400">Completed</div>
            </Card>
            <Card className="p-5">
              <div className="text-3xl font-semibold text-rose-300">
                {stats.overdue}
              </div>
              <div className="mt-2 text-sm text-slate-400">Overdue</div>
            </Card>
            <Card className="p-5">
              <div className="text-3xl font-semibold text-indigo-300">
                {stats.completedThisWeek}
              </div>
              <div className="mt-2 text-sm text-slate-400">Done this week</div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white">
                Tasks by status
              </h3>
              <div className="mt-4 space-y-3">
                {Object.values(TaskStatus).map((status) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-28 text-sm text-slate-400">
                      {status}
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-indigo-400"
                        style={{
                          width: `${(stats.byStatus[status] / maxStatusCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm text-slate-300">
                      {stats.byStatus[status]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white">
                Tasks by priority
              </h3>
              <div className="mt-4 space-y-3">
                {Object.values(TaskPriority).map((priority) => (
                  <div key={priority} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-slate-400">
                      {priority}
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-amber-400"
                        style={{
                          width: `${(stats.byPriority[priority] / maxPriorityCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm text-slate-300">
                      {stats.byPriority[priority]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
