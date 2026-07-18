import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearCredentials } from "../store";
import { authApi } from "../api";
import { Button } from "./ui/Button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(clearCredentials());
      navigate("/");
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <Link
            to={isAuthenticated ? "/tasks" : "/"}
            className="text-lg font-semibold text-white"
          >
            TaskFlow
          </Link>
          <nav className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-indigo-500/15 text-white"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }`
                  }
                >
                  Tasks
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-indigo-500/15 text-white"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <div className="relative ml-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2 transition hover:border-slate-700 hover:bg-slate-800/80"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-200">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm text-slate-300">{user?.name}</span>
                  </button>
                  {isProfileOpen ? (
                    <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/profile");
                        }}
                        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        View Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                      >
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="rounded-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white"
                >
                  Login
                </NavLink>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
