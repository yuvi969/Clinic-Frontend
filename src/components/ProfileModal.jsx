import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profileApi";

const brand = {
  coral: "#FF6F61",
  coralLight: "#FFF0EE",
  textPrimary: "#212121",
  textSecondary: "#666666",
  textTertiary: "#999999",
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

function ProfileModal({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile(profile);
      alert("Profile updated");
      onClose();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
        style={{ background: brand.bgPrimary }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${brand.borderLight}` }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: brand.textPrimary }}>
              My Profile
            </h2>
            {!loading && profile && (
              <p className="text-xs mt-0.5 capitalize" style={{ color: brand.textTertiary }}>
                {profile.role}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 text-lg leading-none"
            style={{ color: brand.textTertiary }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
              style={{ borderColor: brand.coral, borderTopColor: "transparent" }}
            />
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">

            <InputField
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            {profile.role === "doctor" && (
              <>
                <InputField
                  label="Specialization"
                  name="specialization"
                  value={profile.specialization || ""}
                  onChange={handleChange}
                  placeholder="e.g. Cardiologist"
                />
                <InputField
                  label="Consultation Fee"
                  name="consultation_fee"
                  value={profile.consultation_fee || ""}
                  onChange={handleChange}
                  placeholder="Amount in INR"
                  type="number"
                />
              </>
            )}

            {profile.role === "patient" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Age"
                    name="age"
                    value={profile.age || ""}
                    onChange={handleChange}
                    placeholder="Years"
                    type="number"
                  />
                  <InputField
                    label="Gender"
                    name="gender"
                    value={profile.gender || ""}
                    onChange={handleChange}
                    placeholder="e.g. Male"
                  />
                </div>
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  type="tel"
                />
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors hover:bg-gray-200"
                style={{
                  background: brand.bgSecondary,
                  color: brand.textSecondary,
                  border: `1px solid ${brand.borderLight}`,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: brand.coral }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;