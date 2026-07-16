import { useEffect, useState } from "react";
import { useKiosk } from "../context/KioskContext";

export default function IdleWarningModal() {
  const { idleWarning, staySignedIn, endSession, t } = useKiosk();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!idleWarning) {
      setCountdown(10);
      return;
    }
    const interval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [idleWarning]);

  if (!idleWarning) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <p className="text-lg font-semibold text-ink">{t("idle.stillThere")}</p>
        <p className="mt-1 text-sm text-muted">{t("idle.lockWarning", { seconds: countdown })}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={endSession}
            className="flex-1 rounded-xl border border-line py-2.5 text-sm font-medium text-ink"
          >
            {t("idle.endSession")}
          </button>
          <button
            type="button"
            onClick={staySignedIn}
            className="flex-1 rounded-xl bg-brand-blue py-2.5 text-sm font-medium text-white"
          >
            {t("idle.stillHere")}
          </button>
        </div>
      </div>
    </div>
  );
}
