import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import HomePage from "./pages/HomePage";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Routes>

        <Route path="/" element={<HomePage />} />

       <Route
  path="/login"
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  }
/>

        <Route
  path="/register"
  element={
    <PublicRoute>
      <RegisterPage />
    </PublicRoute>
  }
/>

       <Route
  path="/doctor"
  element={
    <RoleProtectedRoute
      allowedRoles={["doctor"]}
    >
      <DoctorDashboard />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/patient"
  element={
    <RoleProtectedRoute
      allowedRoles={["patient"]}
    >
      <PatientDashboard />
    </RoleProtectedRoute>
  }
/>

      </Routes>

    </div>
  );
}

export default App;