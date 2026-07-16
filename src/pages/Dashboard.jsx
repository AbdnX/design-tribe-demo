import TileCard from "../components/TileCard";
import { useKiosk } from "../context/KioskContext";
import {
  ShiftIcon,
  OutputIcon,
  LeaveIcon,
  BenefitsIcon,
  LoansIcon,
  ReportIcon,
  ReviewIcon,
  PayslipsIcon,
  UpdatesIcon,
} from "../components/icons";

const TODAY = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const NOW = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export default function Dashboard() {
  const { worker, clockedIn, clockIn, clockOut } = useKiosk();
  const { shift } = worker;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Hi, {worker.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted">Tap a tile to get started. Kiosk auto-locks when idle.</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-ink">{TODAY}</p>
          <p className="text-sm text-muted">{NOW}</p>
        </div>
      </div>

      <div
        className={`mb-8 flex flex-col gap-4 rounded-2xl border-l-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
          clockedIn ? "border-brand-green bg-green-50" : "border-brand-orange bg-orange-50"
        }`}
      >
        <div>
          <p className={`text-xs font-medium ${clockedIn ? "text-brand-green" : "text-brand-orange"}`}>
            {clockedIn ? "Clocked in" : "Not clocked in"}
          </p>
          <p className="mt-1 font-semibold text-ink">
            {shift.label} · {shift.start} – {shift.end}
          </p>
          <p className="text-sm text-muted">
            {shift.station} {!clockedIn && "| Tap to start your shift"}
          </p>
        </div>
        <button
          type="button"
          onClick={clockedIn ? clockOut : clockIn}
          className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold text-white ${
            clockedIn ? "bg-red-500" : "bg-brand-orange"
          }`}
        >
          {clockedIn ? "Clock Out" : "Clock In"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TileCard to="/shift" icon={<ShiftIcon />} title="Your shift" subtitle="Today's schedule & location" />
        <TileCard to="/log-output" icon={<OutputIcon />} title="Log Output" subtitle="Add units for today's task" />
        <TileCard
          to="/leave"
          icon={<LeaveIcon />}
          iconBg="bg-brand-green/10 text-brand-green"
          title="Leave"
          subtitle="Request time off"
        />
        <TileCard to="/benefits" icon={<BenefitsIcon />} title="Benefits" subtitle="Health, savings and more" />
        <TileCard to="/loans" icon={<LoansIcon />} title="Loans" subtitle="Apply for a salary advance" />
        <TileCard to="/report-problem" icon={<ReportIcon />} title="Report a Problem" subtitle="Talk to HR, privately" />
        <TileCard to="/recognition" icon={<ReviewIcon />} title="Review & Recognition" subtitle="See praise and performance" />
        <TileCard to="/payslips" icon={<PayslipsIcon />} title="Payslips" subtitle="View and download your pay" />
        <TileCard to="/hr-updates" icon={<UpdatesIcon />} title="HR Updates" subtitle="News and announcements" />
      </div>
    </>
  );
}
