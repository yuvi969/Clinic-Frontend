import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (user) {

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

  }

  return children;
}

export default PublicRoute;