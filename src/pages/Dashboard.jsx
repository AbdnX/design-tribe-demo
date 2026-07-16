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
  const { worker, clockedIn, clockIn, clockOut, t } = useKiosk();
  const { shift } = worker;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {t("dashboard.greeting", { name: worker.name.split(" ")[0] })}
          </h1>
          <p className="text-sm text-muted">{t("dashboard.subheading")}</p>
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
            {clockedIn ? t("common.clockedIn") : t("common.notClockedIn")}
          </p>
          <p className="mt-1 font-semibold text-ink">
            {shift.label} · {shift.start} – {shift.end}
          </p>
          <p className="text-sm text-muted">
            {shift.station} {!clockedIn && `| ${t("dashboard.tapToStart")}`}
          </p>
        </div>
        <button
          type="button"
          onClick={clockedIn ? clockOut : clockIn}
          className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold text-white ${
            clockedIn ? "bg-red-500" : "bg-brand-orange"
          }`}
        >
          {clockedIn ? t("common.clockOut") : t("common.clockIn")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TileCard to="/shift" icon={<ShiftIcon />} title={t("tiles.shift.title")} subtitle={t("tiles.shift.subtitle")} />
        <TileCard
          to="/log-output"
          icon={<OutputIcon />}
          title={t("tiles.output.title")}
          subtitle={t("tiles.output.subtitle")}
        />
        <TileCard
          to="/leave"
          icon={<LeaveIcon />}
          iconBg="bg-brand-green/10 text-brand-green"
          title={t("tiles.leave.title")}
          subtitle={t("tiles.leave.subtitle")}
        />
        <TileCard
          to="/benefits"
          icon={<BenefitsIcon />}
          title={t("tiles.benefits.title")}
          subtitle={t("tiles.benefits.subtitle")}
        />
        <TileCard to="/loans" icon={<LoansIcon />} title={t("tiles.loans.title")} subtitle={t("tiles.loans.subtitle")} />
        <TileCard
          to="/report-problem"
          icon={<ReportIcon />}
          title={t("tiles.report.title")}
          subtitle={t("tiles.report.subtitle")}
        />
        <TileCard
          to="/recognition"
          icon={<ReviewIcon />}
          title={t("tiles.recognition.title")}
          subtitle={t("tiles.recognition.subtitle")}
        />
        <TileCard
          to="/payslips"
          icon={<PayslipsIcon />}
          title={t("tiles.payslips.title")}
          subtitle={t("tiles.payslips.subtitle")}
        />
        <TileCard
          to="/hr-updates"
          icon={<UpdatesIcon />}
          title={t("tiles.hrUpdates.title")}
          subtitle={t("tiles.hrUpdates.subtitle")}
        />
      </div>
    </>
  );
}
