import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const brand = {
  coral: "#FF6F61",
  coralLight: "#FFF0EE",
  textPrimary: "#212121",
  textSecondary: "#666666",
  textTertiary: "#999999",
  bgBody: "#F6F8FA",
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F1F4F6",
  borderLight: "#E0E0E0",
  borderMedium: "#CCCCCC",
};

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "doctor" ? "/doctor" : "/patient");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: brand.bgBody,
        fontFamily: "'Clear Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-sm"
              style={{ background: brand.coral }}
            >
              SC
            </div>
            <span className="text-xl font-bold" style={{ color: brand.textPrimary }}>
              Shree Clinic
            </span>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
        >
          {/* Card header */}
          <div
            className="px-7 pt-7 pb-5"
            style={{ borderBottom: `1px solid ${brand.borderLight}` }}
          >
            <h1 className="text-xl font-bold" style={{ color: brand.textPrimary }}>
              Sign in to your account
            </h1>
            <p className="text-sm mt-1" style={{ color: brand.textTertiary }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm font-medium"
                style={{ background: "#FEE2E2", color: "#DC2626" }}
              >
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: brand.textSecondary }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition"
                style={{
                  background: brand.bgSecondary,
                  border: `1px solid ${brand.borderMedium}`,
                  color: brand.textPrimary,
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: brand.textSecondary }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition"
                style={{
                  background: brand.bgSecondary,
                  border: `1px solid ${brand.borderMedium}`,
                  color: brand.textPrimary,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-60 mt-1"
              style={{ background: brand.coral }}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm mt-5" style={{ color: brand.textSecondary }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold hover:underline"
            style={{ color: brand.coral }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;