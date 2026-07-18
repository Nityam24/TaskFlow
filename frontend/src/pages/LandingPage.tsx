import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const features = [
  {
    icon: "📋",
    title: "Smart task lists",
    description:
      "Create polished task boards with priorities, status, dates, and tags in a single workflow.",
  },
  {
    icon: "🔒",
    title: "Secure by default",
    description:
      "Your workspace stays protected with refresh-token-based auth and resilient request handling.",
  },
  {
    icon: "📊",
    title: "Clear progress tracking",
    description:
      "Monitor completion, overdue items, and workload with simple insight cards.",
  },
];

export function LandingPage() {
  return (
    <div className="page-section bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_40%)]">
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-200">
            Task management made simple
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Organize your work with calm, focused momentum.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            TaskFlow helps teams and solo builders manage work with clarity,
            modern styling, and smarter task visibility.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <Button>Start free</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <Card className="flex flex-col items-center justify-between gap-6 px-8 py-10 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Ready to get started?
            </h2>
            <p className="mt-2 text-slate-400">
              Join TaskFlow and take control of your day with a calmer workflow.
            </p>
          </div>
          <Link to="/register">
            <Button>Create free account</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
