import { useState } from "react";
import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

const LEAVE_TYPES = ["Annual", "Sick", "Casual"];

export default function Leave() {
  const { worker, leaveRequests, addLeaveRequest } = useKiosk();
  const [type, setType] = useState("Annual");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!start || !end) return;
    addLeaveRequest({ type, start, end, reason });
    setStart("");
    setEnd("");
    setReason("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <>
      <SubPageHeader title="Leave" subtitle="Request time off" />

      <div className="mb-6 grid grid-cols-3 gap-3">
        {Object.entries(worker.leaveBalance).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-line bg-white p-4 text-center">
            <p className="text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs capitalize text-muted">{key} days left</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm text-ink">Leave type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm text-ink">Start date</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink">End date</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink">Reason (optional)</label>
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
            {submitted ? "Request sent ✓" : "Submit request"}
          </button>
        </form>

        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="mb-4 font-semibold text-ink">Your requests</p>
          {leaveRequests.length === 0 ? (
            <p className="text-sm text-muted">No leave requests yet.</p>
          ) : (
            <ul className="space-y-3">
              {leaveRequests.map((r) => (
                <li key={r.id} className="border-b border-line pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{r.type} leave</p>
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
