import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearCredentials } from "../store";
import { authApi } from "../api";
import { Button } from "./ui/Button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(clearCredentials());
      navigate("/");
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
    setIsMenuOpen(false);
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setIsMenuOpen(true);
  };

  const scheduleMenuClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsMenuOpen(false);
    }, 120);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
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
                <div
                  className="relative ml-0"
                  onMouseEnter={openMenu}
                  onMouseLeave={scheduleMenuClose}
                >
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="flex min-w-[170px] cursor-pointer items-center justify-between gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2 transition hover:border-slate-700 hover:bg-slate-800/80"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-200">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate text-sm font-medium text-slate-200">
                        {user?.name}
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">▾</span>
                  </button>
                  <div
                    className={`absolute right-0 z-[70] mt-1 w-full min-w-[170px] rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-xl transition duration-200 ${isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
                    onMouseEnter={openMenu}
                    onMouseLeave={scheduleMenuClose}
                  >
                    <button
                      type="button"
                      onClick={confirmLogout}
                      className="flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : isAuthRoute ? null : (
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
      {showLogoutConfirm ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-xl">
          <div
            className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900/80 p-6 shadow-2xl backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold text-white">Logout?</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Are you sure you want to sign out of your account?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Confirm logout
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <main className="flex-1">{children}</main>
    </div>
  );
}
