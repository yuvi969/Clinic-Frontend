import { useEffect, useState } from "react";
import api from "../api/axios";
import BookingModal from "../components/BookingModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPatientPrescription, getPatientStats } from "../api/patientApi";
import ProfileModal from "../components/ProfileModal";

const brand = {
  coral: "#FF6F61",
  coralHover: "#E85B4E",
  coralLight: "#FFF0EE",
  green: "#1AAB2A",
  greenLight: "#E8F6EA",
  blue: "#24A3D8",
  blueLight: "#E8F4FB",
  textPrimary: "#212121",
  textSecondary: "#666666",
  textTertiary: "#999999",
  bgBody: "#F6F8FA",
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F1F4F6",
  borderLight: "#E0E0E0",
  borderMedium: "#CCCCCC",
};

/* ── helpers ── */

const StatusBadge = ({ status }) => {
  const map = {
    completed: { bg: brand.greenLight, color: brand.green },
    pending:   { bg: "#FEF3C7",        color: "#D97706"   },
    waiting:   { bg: brand.blueLight,  color: brand.blue  },
  };
  const style = map[status] || { bg: brand.bgSecondary, color: brand.textTertiary };
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold capitalize"
      style={{ background: style.bg, color: style.color }}
    >
      {status}
    </span>
  );
};

const StatCard = ({ label, value }) => (
  <div
    className="rounded-xl p-4 shadow-sm"
    style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
  >
    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: brand.textTertiary }}>
      {label}
    </p>
    <p className="text-2xl font-bold" style={{ color: brand.textPrimary }}>
      {value}
    </p>
  </div>
);

const SectionCard = ({ title, children, action }) => (
  <div
    className="rounded-xl shadow-sm"
    style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
  >
    <div
      className="flex items-center justify-between px-5 py-4"
      style={{ borderBottom: `1px solid ${brand.borderLight}` }}
    >
      <h2 className="text-base font-bold" style={{ color: brand.textPrimary }}>
        {title}
      </h2>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-baseline gap-1.5">
    <span className="text-xs font-semibold uppercase tracking-wide shrink-0" style={{ color: brand.textTertiary }}>
      {label}
    </span>
    <span className="text-sm font-medium" style={{ color: brand.textPrimary }}>
      {value}
    </span>
  </div>
);

/* ── main component ── */

function PatientDashboard() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState(null);
  const [expandedPrescription, setExpandedPrescription] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({});

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fetchSlots = async () => {
    try {
      const response = await api.get("/slots");
      setSlots(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/my");
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewPrescription = async (appointmentId) => {
    if (expandedPrescription === appointmentId) {
      setExpandedPrescription(null);
      return;
    }
    try {
      const data = await getPatientPrescription(appointmentId);
      setPrescriptionData((prev) => ({ ...prev, [appointmentId]: data.prescription }));
      setExpandedPrescription(appointmentId);
    } catch (error) {
      alert(error.response?.data?.message || "Something failed");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchSlots();
        await fetchAppointments();
        const statsData = await getPatientStats();
        setStats(statsData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {

  const interval = setInterval(() => {
    fetchAppointments();
  }, 30000);

  return () => clearInterval(interval);

}, []);

  const handleBooking = async (reason) => {
    try {
      await api.post("/appointments", { slot_id: selectedSlot.id, reason });
      const response = await api.get("/slots");
      setSlots(response.data);
      await fetchAppointments();
      setSelectedSlot(null);
      alert("Appointment booked!");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: brand.bgBody }}
      >
        <div
          className="h-9 w-9 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: brand.coral, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: brand.bgBody,
        fontFamily: "'Clear Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 shadow-sm"
        style={{ background: brand.bgPrimary, borderBottom: `1px solid ${brand.borderLight}` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ background: brand.coral }}
          >
            C
          </div>
          <span className="text-base font-bold" style={{ color: brand.textPrimary }}>
            Shree Clinic
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProfile(true)}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100"
            style={{
              color: brand.coral,
              border: `1.5px solid ${brand.coral}`,
            }}
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#EF4444" }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Appointments" value={stats.total} />
            <StatCard label="Pending" value={stats.pending} />
            <StatCard label="Completed" value={stats.completed} />
          </div>
        )}

        {/* Available Slots */}
        <SectionCard
          title="Available Slots"
          action={
            <span className="text-xs font-medium" style={{ color: brand.textTertiary }}>
              {slots.length} slot{slots.length !== 1 ? "s" : ""} available
            </span>
          }
        >
          {slots.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-10 rounded-lg"
              style={{ background: brand.bgSecondary }}
            >
              <p className="text-sm font-medium" style={{ color: brand.textTertiary }}>
                No available slots at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-col justify-between rounded-xl p-4"
                  style={{ border: `1px solid ${brand.borderLight}`, background: brand.bgPrimary }}
                >
                  <div className="space-y-1.5 mb-4">
                    <p className="text-sm font-bold" style={{ color: brand.textPrimary }}>
                      Dr. {slot.doctor_name}
                    </p>
                    <InfoRow label="Specialization" value={slot.specialization} />
                    <InfoRow label="Fee" value={`₹${slot.consultation_fee}`} />
                    <InfoRow label="Date" value={new Date(slot.slot_date).toLocaleDateString()} />
                    <InfoRow label="Time" value={`${slot.start_time} – ${slot.end_time}`} />
                  </div>
                  <button
                    onClick={() => setSelectedSlot(slot)}
                    className="w-full rounded-lg py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
                    style={{ background: brand.coral }}
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* My Appointments */}
        <SectionCard title="My Appointments">
          {appointments.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-10 rounded-lg"
              style={{ background: brand.bgSecondary }}
            >
              <p className="text-sm font-medium" style={{ color: brand.textTertiary }}>
                No appointments yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${brand.borderLight}` }}
                >
                  {/* Appointment row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <span
                        className="text-xs font-bold rounded-full px-2.5 py-0.5"
                        style={{ background: brand.coralLight, color: brand.coral }}
                      >
                        #{appointment.token_number}
                      </span>
                      <InfoRow label="Date" value={new Date(appointment.slot_date).toLocaleDateString()} />
                      <InfoRow label="Time" value={`${appointment.start_time} – ${appointment.end_time}`} />
                      <InfoRow label="Reason" value={appointment.reason} />
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={appointment.status} />
                      {appointment.status === "completed" && (
                        <button
                          onClick={() => handleViewPrescription(appointment.id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                          style={{
                            background: expandedPrescription === appointment.id ? brand.greenLight : brand.bgSecondary,
                            color: expandedPrescription === appointment.id ? brand.green : brand.textSecondary,
                            border: `1px solid ${brand.borderLight}`,
                          }}
                        >
                          {expandedPrescription === appointment.id ? "Hide Prescription" : "View Prescription"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Prescription panel */}
                  {expandedPrescription === appointment.id && prescriptionData[appointment.id] && (
                    <div
                      className="px-4 py-4 space-y-3"
                      style={{ borderTop: `1px solid ${brand.borderLight}`, background: brand.bgSecondary }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: brand.textTertiary }}>
                        Prescription
                      </p>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { label: "Diagnosis", value: prescriptionData[appointment.id].diagnosis },
                          { label: "Medications", value: prescriptionData[appointment.id].medications },
                          { label: "Notes", value: prescriptionData[appointment.id].notes || "No notes" },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="rounded-lg p-3"
                            style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
                          >
                            <p className="text-xs font-semibold uppercase mb-1" style={{ color: brand.textTertiary }}>
                              {label}
                            </p>
                            <p className="text-sm" style={{ color: brand.textPrimary }}>
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </main>

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onConfirm={handleBooking}
        />
      )}

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default PatientDashboard;