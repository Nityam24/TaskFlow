import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCredentials } from "../store";
import { authApi } from "../api";
import "../styles/components/Navbar.css";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(clearCredentials());
      navigate("/");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to={isAuthenticated ? "/tasks" : "/"} className="navbar-brand">
          Task<span>Flow</span>
        </Link>

        {isAuthenticated ? (
          <div className="navbar-user">
            <div className="navbar-links">
              <Link
                to="/tasks"
                className={`nav-link ${isActive("/tasks") ? "active" : ""}`}
              >
                Tasks
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                Profile
              </Link>
            </div>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-links">
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
