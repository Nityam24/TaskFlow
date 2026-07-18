import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface PrivateRouteProps {
  redirectTo?: string;
}

export function NotFoundRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/tasks" : "/"} replace />;
}

export function PrivateRoute({ redirectTo = "/login" }: PrivateRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export function PublicRoute({ redirectTo = "/tasks" }: PrivateRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
