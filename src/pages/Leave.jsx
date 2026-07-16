import { useState } from "react";
import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

const LEAVE_TYPE_KEYS = ["leaveType.annual", "leaveType.sick", "leaveType.casual"];

export default function Leave() {
  const { worker, leaveRequests, addLeaveRequest, t } = useKiosk();
  const [typeKey, setTypeKey] = useState(LEAVE_TYPE_KEYS[0]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!start || !end) return;
    addLeaveRequest({ type: t(typeKey), start, end, reason });
    setStart("");
    setEnd("");
    setReason("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <>
      <SubPageHeader title={t("tiles.leave.title")} subtitle={t("tiles.leave.subtitle")} />

      <div className="mb-6 grid grid-cols-3 gap-3">
        {Object.entries(worker.leaveBalance).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-line bg-white p-4 text-center">
            <p className="text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs capitalize text-muted">
              {t(`leaveType.${key}`)} {t("leave.daysLeft")}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm text-ink">{t("leave.type")}</label>
            <select
              value={typeKey}
              onChange={(e) => setTypeKey(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
            >
              {LEAVE_TYPE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(key)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm text-ink">{t("leave.startDate")}</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink">{t("leave.endDate")}</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink">{t("leave.reasonOptional")}</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
            />
          </div>
          <button
            type="submit"
            disabled={!start || !end}
            className="w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {submitted ? t("leave.sent") : t("leave.submit")}
          </button>
        </form>

        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="mb-4 font-semibold text-ink">{t("leave.yourRequests")}</p>
          {leaveRequests.length === 0 ? (
            <p className="text-sm text-muted">{t("leave.noneYet")}</p>
          ) : (
            <ul className="space-y-3">
              {leaveRequests.map((r) => (
                <li key={r.id} className="border-b border-line pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">
                      {r.type} {t("leave.suffix")}
                    </p>
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    {r.start} → {r.end}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
