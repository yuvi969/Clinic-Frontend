import { useState } from "react";

const brand = {
  coral: "#FF6F61",
  coralHover: "#E85B4E",
  coralLight: "#FFF0EE",
  textPrimary: "#212121",
  textSecondary: "#666666",
  textTertiary: "#999999",
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F1F4F6",
  borderLight: "#E0E0E0",
  borderMedium: "#CCCCCC",
};

function BookingModal({ slot, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(reason);
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
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${brand.borderLight}` }}
        >
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: brand.textPrimary }}
            >
              Book Appointment
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: brand.textTertiary }}
            >
              Slot #{slot.id}
            </p>
          </div>

          {/* Close X */}
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
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: brand.textSecondary }}
            >
              Reason for Visit
            </label>
            <textarea
              placeholder="Briefly describe your symptoms or reason for the visit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
              className="w-full rounded-lg px-3 py-2.5 text-sm resize-none outline-none transition"
              style={{
                background: brand.bgSecondary,
                border: `1px solid ${brand.borderMedium}`,
                color: brand.textPrimary,
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
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
              type="submit"
              className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
              style={{ background: brand.coral }}
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;