import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

export default function Shift() {
  const { worker, clockedIn, clockInTime, clockIn, clockOut, t } = useKiosk();
  const { shift } = worker;

  return (
    <>
      <SubPageHeader title={t("tiles.shift.title")} subtitle={t("tiles.shift.subtitle")} />

      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm text-muted">
              {shift.label} {t("shift.suffix")}
            </p>
            <p className="text-lg font-semibold text-ink">
              {shift.start} – {shift.end}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              clockedIn ? "bg-green-50 text-brand-green" : "bg-orange-50 text-brand-orange"
            }`}
          >
            {clockedIn ? t("shift.inProgress") : t("shift.notStarted")}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">{t("shift.station")}</p>
            <p className="font-medium text-ink">{shift.station}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">{t("shift.location")}</p>
            <p className="font-medium text-ink">{worker.location}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">{t("shift.role")}</p>
            <p className="font-medium text-ink">{worker.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">{t("shift.clockedInAt")}</p>
            <p className="font-medium text-ink">
              {clockInTime
                ? clockInTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                : "—"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clockedIn ? clockOut : clockIn}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white ${
            clockedIn ? "bg-red-500" : "bg-brand-orange"
          }`}
        >
          {clockedIn ? t("common.clockOut") : t("common.clockIn")}
        </button>
      </div>
    </>
  );
}
