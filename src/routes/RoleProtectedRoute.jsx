import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function RoleProtectedRoute({
  children,
  allowedRoles,
}) {

  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    !allowedRoles.includes(user.role)
  ) {

    if (user.role === "doctor") {
      return (
        <Navigate
          to="/doctor"
          replace
        />
      );
    }

    if (user.role === "patient") {
      return (
        <Navigate
          to="/patient"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default RoleProtectedRoute;