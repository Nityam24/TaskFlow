import { Card } from "./ui/Card";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-4">
      <Card className="w-full max-w-md border-slate-800/80 bg-slate-900/80 p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-xl font-semibold text-indigo-300">
            TF
          </div>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
      </Card>
    </div>
  );
}
