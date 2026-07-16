import { useState } from "react";
import { useKiosk } from "../context/KioskContext";

export default function KioskHeader() {
  const { worker, clockedIn, endSession, t } = useKiosk();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-line px-6 py-4 bg-white">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue via-brand-green to-brand-orange" />
        <span className="text-lg font-semibold text-ink">SeamlessHR</span>
        <span className="ml-2 hidden text-sm text-muted sm:inline">Kiosk</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
            clockedIn ? "bg-green-50 text-brand-green" : "bg-red-50 text-red-500"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${clockedIn ? "bg-brand-green" : "bg-red-500"}`} />
          {clockedIn ? t("common.clockedIn") : t("common.notClockedIn")}
        </span>

        <button
          type="button"
          className="hidden items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-sm text-ink sm:flex"
        >
          {t("header.worker")}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          aria-label={t("header.notifications")}
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="h-9 w-9 overflow-hidden rounded-full border border-line"
          >
            {worker && <img src={worker.avatar} alt={worker.name} className="h-full w-full object-cover" />}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-line bg-white p-2 shadow-lg">
              <p className="truncate px-2 py-1 text-sm font-medium text-ink">{worker?.name}</p>
              <p className="truncate px-2 pb-2 text-xs text-muted">{worker?.id}</p>
              <button
                type="button"
                onClick={endSession}
                className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
              >
                {t("header.doneEndSession")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
