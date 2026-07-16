import { useState } from "react";
import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

const CATEGORIES = ["Harassment", "Safety concern", "Pay issue", "Equipment fault", "Other"];

export default function ReportProblem() {
  const { problemReports, addProblemReport } = useKiosk();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [details, setDetails] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!details.trim()) return;
    addProblemReport({ category, details, anonymous });
    setDetails("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <>
      <SubPageHeader title="Report a Problem" subtitle="Talk to HR, privately" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm text-ink">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink">What happened?</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              placeholder="Describe the issue. Only HR will see this."
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-line"
            />
            Submit anonymously
          </label>
          <button
            type="submit"
            disabled={!details.trim()}
            className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {submitted ? "Sent to HR ✓" : "Submit report"}
          </button>
        </form>

        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="mb-4 font-semibold text-ink">Your reports</p>
          {problemReports.length === 0 ? (
            <p className="text-sm text-muted">No reports submitted yet.</p>
          ) : (
            <ul className="space-y-3">
              {problemReports.map((r) => (
                <li key={r.id} className="border-b border-line pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{r.category}</p>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-brand-blue">
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{r.anonymous ? "Anonymous" : "Named"} report</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
