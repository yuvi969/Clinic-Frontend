import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getQueue,
  callNextPatient,
  completeAppointment,
  getPrescriptionByAppointment,
  createPrescription,
  updatePrescription,
  generateSlots,
  getDoctorStats,
} from "../api/doctorApi";
import socket from "../socket";
import ProfileModal from "../components/ProfileModal";

/* ── brand tokens (1mg palette) ── */
const brand = {
  coral: "#FF6F61",
  coralHover: "#E85B4E",
  coralLight: "#FFF0EE",
  green: "#1AAB2A",
  greenLight: "#E8F6EA",
  blue: "#24A3D8",
  yellow: "#FFC000",
  textPrimary: "#212121",
  textSecondary: "#666666",
  textTertiary: "#999999",
  bgBody: "#F6F8FA",
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F1F4F6",
  borderLight: "#E0E0E0",
  borderMedium: "#CCCCCC",
};

/* ── small reusable styled components ── */

const StatCard = ({ label, value }) => (
  <div
    className="flex items-center gap-4 rounded-xl p-4 shadow-sm"
    style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
  >
    <div>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: brand.textTertiary }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: brand.textPrimary }}>
        {value}
      </p>
    </div>
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div
    className={`rounded-xl shadow-sm ${className}`}
    style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
  >
    <div
      className="px-5 py-4"
      style={{ borderBottom: `1px solid ${brand.borderLight}` }}
    >
      <h2 className="text-base font-bold" style={{ color: brand.textPrimary }}>
        {title}
      </h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: brand.textSecondary }}>
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2"
      style={{
        background: brand.bgSecondary,
        border: `1px solid ${brand.borderMedium}`,
        color: brand.textPrimary,
        "--tw-ring-color": brand.coral,
      }}
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: brand.textSecondary }}>
      {label}
    </label>
    <textarea
      rows={3}
      {...props}
      className="w-full rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2 resize-none"
      style={{
        background: brand.bgSecondary,
        border: `1px solid ${brand.borderMedium}`,
        color: brand.textPrimary,
        "--tw-ring-color": brand.coral,
      }}
    />
  </div>
);

const Btn = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary: { background: brand.coral, color: "#fff" },
    success: { background: brand.green, color: "#fff" },
    outline: {
      background: "transparent",
      color: brand.coral,
      border: `1.5px solid ${brand.coral}`,
    },
    danger: { background: "#EF4444", color: "#fff" },
    ghost: { background: brand.bgSecondary, color: brand.textSecondary },
  };
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95 ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, color = "coral" }) => {
  const map = {
    coral: { bg: brand.coralLight, text: brand.coral },
    green: { bg: brand.greenLight, text: brand.green },
    blue: { bg: "#E8F4FB", text: brand.blue },
  };
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{ background: map[color].bg, color: map[color].text }}
    >
      {children}
    </span>
  );
};

/* ── main dashboard ── */

function DoctorDashboard() {
  const [queue, setQueue] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptionExists, setPrescriptionExists] = useState(false);

  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState(15);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!user?.doctor_id) return;
    socket.emit("joinQueue", user.doctor_id);
  }, [user]);

  useEffect(() => {
    socket.on("queueUpdated", async () => {
      await fetchQueue();
    });
    return () => socket.off("queueUpdated");
  }, []);

  const loadPrescription = async (appointmentId) => {
    try {
      const data = await getPrescriptionByAppointment(appointmentId);
      if (data.prescription) {
        setDiagnosis(data.prescription.diagnosis);
        setMedications(data.prescription.medications);
        setNotes(data.prescription.notes || "");
        setPrescriptionExists(true);
      } else {
        setDiagnosis("");
        setMedications("");
        setNotes("");
        setPrescriptionExists(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (queue?.current_consultation?.id) {
      loadPrescription(queue.current_consultation.id);
    }
  }, [queue?.current_consultation?.id]);

  const handleGenerateSlots = async () => {
    try {
      const data = await generateSlots({
        slot_date: slotDate,
        start_time: startTime,
        end_time: endTime,
        duration,
      });
      alert(`${data.message}\nCreated: ${data.total_slots}\nSkipped: ${data.skipped_duplicates}`);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleSavePrescription = async () => {
    try {
      const payload = {
        appointment_id: queue.current_consultation.id,
        diagnosis,
        medications,
        notes,
      };
      if (prescriptionExists) {
        await updatePrescription(queue.current_consultation.id, { diagnosis, medications, notes });
        alert("Prescription updated");
      } else {
        await createPrescription(payload);
        alert("Prescription created");
        await loadPrescription(queue.current_consultation.id);
        setPrescriptionExists(true);
      }
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const fetchQueue = async () => {
    try {
      const data = await getQueue();
      setQueue(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchQueue();
      setLoading(false);
      const statsData = await getDoctorStats();
      setStats(statsData);
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCallNext = async () => {
    try {
      await callNextPatient();
      await fetchQueue();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleComplete = async () => {
    try {
      await completeAppointment(queue.current_consultation.id);
      await fetchQueue();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete consultation");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: brand.bgBody }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
            style={{ borderColor: brand.coral, borderTopColor: "transparent" }}
          />
          <p className="text-sm font-medium" style={{ color: brand.textSecondary }}>
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: brand.bgBody, fontFamily: "'Clear Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── Top Navigation Bar ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 shadow-sm"
        style={{ background: brand.bgPrimary, borderBottom: `1px solid ${brand.borderLight}` }}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ background: brand.coral }}
          >
            D
          </div>
          <span className="text-base font-bold" style={{ color: brand.textPrimary }}>
            DocPortal
          </span>
        </div>

        {/* Doctor name */}
        <p className="hidden sm:block text-sm font-medium" style={{ color: brand.textSecondary }}>
          Welcome back,{" "}
          <span className="font-bold" style={{ color: brand.textPrimary }}>
            Dr. {user?.name || "Doctor"}
          </span>
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Btn variant="outline" onClick={() => setShowProfile(true)}>
            Profile
          </Btn>
          <Btn variant="danger" onClick={handleLogout}>
            Logout
          </Btn>
        </div>
      </header>

      {/* ── Page Body ── */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">

        {/* ── Stats Row ── */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Waiting" value={stats.waiting} />
            <StatCard label="In Consultation" value={stats.current} />
            <StatCard label="Completed Today" value={stats.completed_today} />
          </div>
        )}

        {/* ── Slot Management ── */}
        <SectionCard title="Slot Management">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InputField
              label="Date"
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
            />
            <InputField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <InputField
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <InputField
              label="Duration (mins)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Btn
              variant="primary"
              onClick={handleGenerateSlots}
              style={{ background: "#7C3AED" }}  
            >
              Generate Slots
            </Btn>
          </div>
        </SectionCard>

        {/* ── Two-column layout: Consultation + Queue ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Current Consultation */}
          <SectionCard title="Current Consultation">
            {queue.current_consultation ? (
              <div className="space-y-4">
                {/* Patient info */}
                <div
                  className="flex items-start justify-between rounded-lg p-3"
                  style={{ background: brand.coralLight }}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase" style={{ color: brand.coral }}>
                      Patient
                    </p>
                    <p className="font-bold" style={{ color: brand.textPrimary }}>
                      {queue.current_consultation.patient_name}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: brand.textSecondary }}>
                      {queue.current_consultation.reason}
                    </p>
                  </div>
                  <Badge color="coral">Active</Badge>
                </div>

                {/* Prescription form */}
                <Textarea
                  label="Diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
                <Textarea
                  label="Medications"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                />
                <Textarea
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <Btn variant="primary" onClick={handleSavePrescription}>
                    {prescriptionExists ? "Update Prescription" : "Create Prescription"}
                  </Btn>
                  <Btn variant="success" onClick={handleComplete}>
                    Complete Consultation
                  </Btn>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-10 rounded-lg"
                style={{ background: brand.bgSecondary }}
              >
                <span className="text-4xl mb-2"></span>
                <p className="text-sm font-medium" style={{ color: brand.textTertiary }}>
                  No active consultation
                </p>
              </div>
            )}
          </SectionCard>

          {/* Waiting Queue */}
          <SectionCard title="Waiting Queue">
            <Btn variant="primary" className="mb-4 w-full" onClick={handleCallNext}>
              Call Next Patient
            </Btn>

            {queue.waiting.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-10 rounded-lg"
                style={{ background: brand.bgSecondary }}
              >
                <span className="text-4xl mb-2"></span>
                <p className="text-sm font-medium" style={{ color: brand.textTertiary }}>
                  Queue is empty
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {queue.waiting.map((patient, idx) => (
                  <li
                    key={patient.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                    style={{ border: `1px solid ${brand.borderLight}`, background: brand.bgPrimary }}
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0"
                      style={{ background: brand.coral }}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: brand.textPrimary }}>
                        {patient.patient_name}
                      </p>
                      <p className="text-xs truncate" style={{ color: brand.textSecondary }}>
                        {patient.reason}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        {/* ── Recent Completed ── */}
        <SectionCard title="Recent Completed">
          {queue.recent_completed.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: brand.textTertiary }}>
              No completed appointments yet today.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${brand.borderLight}` }}>
                    {["Token", "Patient", "Reason"].map((h) => (
                      <th
                        key={h}
                        className="pb-2 text-left text-xs font-semibold uppercase tracking-wide pr-4"
                        style={{ color: brand.textTertiary }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queue.recent_completed.map((appt) => (
                    <tr
                      key={appt.id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: `1px solid ${brand.borderLight}` }}
                    >
                      <td className="py-2.5 pr-4">
                        <Badge color="green">#{appt.token_number}</Badge>
                      </td>
                      <td className="py-2.5 pr-4 font-medium" style={{ color: brand.textPrimary }}>
                        {appt.patient_name}
                      </td>
                      <td className="py-2.5" style={{ color: brand.textSecondary }}>
                        {appt.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </main>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default DoctorDashboard;