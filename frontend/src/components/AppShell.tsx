import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearCredentials } from "../store";
import { authApi } from "../api";
import { Button } from "./ui/Button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

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
                  className="rounded-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white"
                >
                  Tasks
                </NavLink>
                <NavLink
                  to="/profile"
                  className="rounded-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white"
                >
                  Profile
                </NavLink>
                <div className="ml-2 flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-200">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-300">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
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
