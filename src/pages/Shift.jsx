import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

export default function Shift() {
  const { worker, clockedIn, clockInTime, clockIn, clockOut } = useKiosk();
  const { shift } = worker;

  return (
    <>
      <SubPageHeader title="Your shift" subtitle="Today's schedule & location" />

      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm text-muted">{shift.label} shift</p>
            <p className="text-lg font-semibold text-ink">
              {shift.start} – {shift.end}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              clockedIn ? "bg-green-50 text-brand-green" : "bg-orange-50 text-brand-orange"
            }`}
          >
            {clockedIn ? "In progress" : "Not started"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Station</p>
            <p className="font-medium text-ink">{shift.station}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Location</p>
            <p className="font-medium text-ink">{worker.location}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Role</p>
            <p className="font-medium text-ink">{worker.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Clocked in at</p>
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
          {clockedIn ? "Clock Out" : "Clock In"}
        </button>
      </div>
    </>
  );
}
