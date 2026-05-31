import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-xs font-semibold uppercase tracking-wide"
      style={{ color: brand.textSecondary }}
    >
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition"
      style={{
        background: brand.bgSecondary,
        border: `1px solid ${brand.borderMedium}`,
        color: brand.textPrimary,
      }}
    />
  </div>
);

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/register", formData);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
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
              S
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
              Create your account
            </h1>
            <p className="text-sm mt-1" style={{ color: brand.textTertiary }}>
              Join Shree Clinic to manage your healthcare
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

            <InputField
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />

            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
              required
            />

            {/* Role toggle */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: brand.textSecondary }}
              >
                I am a
              </label>
              <div
                className="grid grid-cols-2 rounded-lg p-1 gap-1"
                style={{ background: brand.bgSecondary, border: `1px solid ${brand.borderLight}` }}
              >
                {["patient", "doctor"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className="rounded-md py-2 text-sm font-semibold capitalize transition-all"
                    style={
                      formData.role === r
                        ? { background: brand.bgPrimary, color: brand.coral, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                        : { color: brand.textTertiary }
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-60 mt-1"
              style={{ background: brand.coral }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm mt-5" style={{ color: brand.textSecondary }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold hover:underline"
            style={{ color: brand.coral }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;