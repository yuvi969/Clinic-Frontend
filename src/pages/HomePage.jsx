import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

const services = [
  {
    category: "Panchakarma",
    items: [
      { title: "Abhyanga", desc: "Full-body Ayurvedic oil massage to detoxify, relax muscles and restore energy balance." },
      { title: "Shirodhara", desc: "Continuous warm oil pour on the forehead to relieve stress, anxiety and insomnia." },
      { title: "Basti (Vasti)", desc: "Medicated enema therapy — the most powerful Panchakarma treatment for Vata disorders." },
      { title: "Nasya", desc: "Nasal administration of herbal oils for sinus, headaches and neurological concerns." },
    ],
  },
  {
    category: "Ayurvedic Care",
    items: [
      { title: "General Consultation", desc: "Prakriti assessment, lifestyle counselling and personalised herbal treatment plans." },
      { title: "Digestive Disorders", desc: "Treatment for IBS, acidity, constipation and other gut-related conditions." },
      { title: "Joint & Bone Care", desc: "Ayurvedic management of arthritis, back pain and musculoskeletal conditions." },
      { title: "Women's Health", desc: "PCOS, menstrual irregularities, and hormonal balance through Ayurvedic protocols." },
    ],
  },
  {
    category: "Derma Care",
    items: [
      { title: "Skin Consultation", desc: "Ayurvedic diagnosis and treatment of acne, eczema, psoriasis and pigmentation." },
      { title: "Hair & Scalp Therapy", desc: "Herbal treatments for hair fall, dandruff and scalp conditions." },
    ],
  },
];

const timings = [
  { day: "Monday – Saturday", morning: "9:00 AM – 1:00 PM", evening: "5:00 PM – 8:00 PM" },
  { day: "Sunday", morning: "Closed", evening: "—" },
];

const steps = [
  { number: "01", title: "Create an account", desc: "Register as a patient in under a minute." },
  { number: "02", title: "Pick a slot", desc: "Browse available appointment times and choose one that suits you." },
  { number: "03", title: "Visit the clinic", desc: "Arrive at your scheduled time and get seen without a long wait." },
];

const GOOGLE_BUSINESS_URL =
  "https://www.google.com/search?q=Dr.+Manasi+S.+Pawar&newwindow=1&sca_esv=e4d67c525560de97&rlz=1C1YTUH_enIN1088IN1088&sxsrf=ANbL-n4r7Ji7vGu5iJH-PdWu0xg1Hlxnlg%3A1780210650933&ei=2tsbapfUOIWSseMPmJnBkQw&biw=1536&bih=695&ved=0ahUKEwiXqeW7-eKUAxUFSWwGHZhMMMIQ4dUDCBE&uact=5&oq=Dr.+Manasi+S.+Pawar";

const Divider = () => (
  <div className="h-px w-full" style={{ background: brand.borderLight }} />
);

function HomePage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: brand.bgBody }}>
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
        color: brand.textPrimary,
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
            S
          </div>
          <span className="text-base font-bold" style={{ color: brand.textPrimary }}>
            Shree Clinic
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: brand.textSecondary }}>
          <a href="#services" className="hover:text-gray-900 transition-colors">Services</a>
          <a href="#doctor" className="hover:text-gray-900 transition-colors">Doctor</a>
          <a href="#timings" className="hover:text-gray-900 transition-colors">Timings</a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:block text-sm" style={{ color: brand.textSecondary }}>
                Hi,{" "}
                <span className="font-semibold" style={{ color: brand.textPrimary }}>{user.name}</span>
              </span>
              <button
                onClick={() => navigate(user.role === "doctor" ? "/doctor" : "/patient")}
                className="rounded-lg px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: brand.coral }}
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100"
                style={{ color: brand.textSecondary, border: `1px solid ${brand.borderLight}` }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100"
                style={{ color: brand.textPrimary, border: `1px solid ${brand.borderLight}` }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-lg px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: brand.coral }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="px-6 py-16 text-center"
        style={{ background: brand.bgPrimary, borderBottom: `1px solid ${brand.borderLight}` }}
      >
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4"
          style={{ background: brand.coralLight, color: brand.coral }}
        >
          Hingne Khurd, Pune
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-3" style={{ color: brand.textPrimary }}>
          Shree Clinic
        </h1>
        <p className="text-base mb-2 font-medium" style={{ color: brand.textSecondary }}>
          Ayurveda · Panchakarma · Derma Care
        </p>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: brand.textTertiary }}>
          Book your appointments online with Dr. Manasi S. Pawar, BAMS — trusted Ayurvedic care in Damodar Nagar, Hingne Khurd.
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} className="w-4 h-4" viewBox="0 0 20 20" fill={brand.yellow}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-bold" style={{ color: brand.textPrimary }}>4.9</span>
          <span className="text-sm" style={{ color: brand.textTertiary }}>· 55 reviews on JustDial</span>
        </div>

        {user ? (
          <button
            onClick={() => navigate(user.role === "doctor" ? "/doctor" : "/patient")}
            className="rounded-lg px-8 py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: brand.coral }}
          >
            Go to Dashboard
          </button>
        ) : (
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/register")}
              className="rounded-lg px-8 py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-95"
              style={{ background: brand.coral }}
            >
              Book an Appointment
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg px-8 py-3 text-sm font-semibold transition-colors hover:bg-gray-100"
              style={{ color: brand.textPrimary, border: `1px solid ${brand.borderLight}`, background: brand.bgPrimary }}
            >
              Sign In
            </button>
          </div>
        )}
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: brand.coral }}>
          How it works
        </p>
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: brand.textPrimary }}>
          Three steps to your appointment
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl p-5 shadow-sm"
              style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
            >
              <p className="text-3xl font-bold mb-3" style={{ color: brand.coral, opacity: 0.25 }}>
                {step.number}
              </p>
              <p className="text-sm font-bold mb-1" style={{ color: brand.textPrimary }}>{step.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: brand.textSecondary }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Doctor profile ── */}
      <section id="doctor" className="mx-auto max-w-4xl px-6 py-14">
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: brand.coral }}>
          Meet your doctor
        </p>
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: brand.textPrimary }}>
          Dr. Manasi S. Pawar
        </h2>

        <div
          className="rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row"
          style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center sm:w-48 shrink-0 py-10 sm:py-0"
            style={{ background: brand.coralLight }}
          >
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white"
              style={{ background: brand.coral }}
            >
              MP
            </div>
          </div>

          {/* Info */}
          <div className="p-6 space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: brand.textPrimary }}>
                Dr. Manasi S. Pawar
              </p>
              <p className="text-sm font-semibold" style={{ color: brand.coral }}>
                BAMS · Ayurvedic Physician
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Ayurveda", "Panchakarma", "Derma Care", "Women's Health", "Digestive Health"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: brand.bgSecondary, color: brand.textSecondary }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed" style={{ color: brand.textSecondary }}>
              Dr. Manasi S. Pawar is a qualified Ayurvedic physician (BAMS) running Shree Clinic in Hingne Khurd.
              She specialises in Panchakarma therapies, Ayurvedic derma care, and holistic health management.
              Rated 4.9 stars by 55 patients on JustDial, she is known for her thorough consultations and
              personalised treatment plans.
            </p>

            {/* Address */}
            <div className="flex items-start gap-2 text-sm" style={{ color: brand.textSecondary }}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                Laxmi Residency, Opposite Aayshmaan Aarogya, Damodar Nagar Road, Hingne Khurd, Pune – 411051
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-sm" style={{ color: brand.textSecondary }}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a
                href="tel:+919922945687"
                className="font-semibold hover:underline"
                style={{ color: brand.textPrimary }}
              >
                +91 99229 45687
              </a>
            </div>

            {/* Google Business link */}
            <div className="flex items-center gap-2 text-sm" style={{ color: brand.textSecondary }}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
              </svg>
              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: brand.blue }}
              >
                View on Google
              </a>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Services ── */}
      <section id="services" className="mx-auto max-w-4xl px-6 py-14">
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: brand.coral }}>
          What we offer
        </p>
        <h2 className="text-2xl font-bold text-center mb-10" style={{ color: brand.textPrimary }}>
          Services at Shree Clinic
        </h2>

        <div className="space-y-10">
          {services.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1" style={{ background: brand.borderLight }} />
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: brand.coralLight, color: brand.coral }}
                >
                  {group.category}
                </span>
                <div className="h-px flex-1" style={{ background: brand.borderLight }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.items.map((s) => (
                  <div
                    key={s.title}
                    className="rounded-xl p-5 shadow-sm"
                    style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
                  >
                    <div className="mb-3 h-1 w-8 rounded-full" style={{ background: brand.coral }} />
                    <p className="text-sm font-bold mb-1" style={{ color: brand.textPrimary }}>{s.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: brand.textSecondary }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Timings ── */}
      <section id="timings" className="mx-auto max-w-2xl px-6 py-14">
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: brand.coral }}>
          Plan your visit
        </p>
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: brand.textPrimary }}>
          Clinic timings
        </h2>
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: brand.bgPrimary, border: `1px solid ${brand.borderLight}` }}
        >
          <div
            className="grid grid-cols-3 px-5 py-3 text-xs font-bold uppercase tracking-wide"
            style={{ background: brand.bgSecondary, borderBottom: `1px solid ${brand.borderLight}`, color: brand.textTertiary }}
          >
            <span>Day</span>
            <span>Morning</span>
            <span>Evening</span>
          </div>
          {timings.map((t, i) => (
            <div
              key={t.day}
              className="grid grid-cols-3 px-5 py-3.5 text-sm"
              style={{
                borderBottom: i < timings.length - 1 ? `1px solid ${brand.borderLight}` : "none",
                color: t.morning === "Closed" ? brand.textTertiary : brand.textPrimary,
              }}
            >
              <span className="font-semibold">{t.day}</span>
              <span>{t.morning}</span>
              <span>{t.evening}</span>
            </div>
          ))}
          <div
            className="px-5 py-3 text-xs"
            style={{ background: brand.coralLight, color: brand.coral, borderTop: `1px solid ${brand.borderLight}` }}
          >
            Timings may vary on public holidays. Please call ahead to confirm.
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      {!user && (
        <section
          className="px-6 py-12 text-center"
          style={{ background: brand.bgPrimary, borderTop: `1px solid ${brand.borderLight}` }}
        >
          <h2 className="text-xl font-bold mb-2" style={{ color: brand.textPrimary }}>
            Ready to book your appointment?
          </h2>
          <p className="text-sm mb-6" style={{ color: brand.textSecondary }}>
            Register for free and book a slot in under a minute.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="rounded-lg px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: brand.coral }}
          >
            Get Started
          </button>
        </section>
      )}

      {/* ── Footer ── */}
      <footer
        className="px-6 py-6 text-center text-xs"
        style={{ borderTop: `1px solid ${brand.borderLight}`, color: brand.textTertiary }}
      >
        © {new Date().getFullYear()} Shree Clinic, Hingne Khurd, Pune. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;