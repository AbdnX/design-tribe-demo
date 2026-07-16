import { useState } from "react";
import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

const CATEGORY_KEYS = ["category.harassment", "category.safety", "category.pay", "category.equipment", "category.other"];

export default function ReportProblem() {
  const { problemReports, addProblemReport, t } = useKiosk();
  const [categoryKey, setCategoryKey] = useState(CATEGORY_KEYS[0]);
  const [details, setDetails] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!details.trim()) return;
    addProblemReport({ category: t(categoryKey), details, anonymous });
    setDetails("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <>
      <SubPageHeader title={t("tiles.report.title")} subtitle={t("tiles.report.subtitle")} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm text-ink">{t("report.category")}</label>
            <select
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
            >
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(key)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink">{t("report.whatHappened")}</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              placeholder={t("report.detailsPlaceholder")}
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
            {t("report.anonymousCheckbox")}
          </label>
          <button
            type="submit"
            disabled={!details.trim()}
            className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {submitted ? t("report.sent") : t("report.submit")}
          </button>
        </form>

        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="mb-4 font-semibold text-ink">{t("report.yourReports")}</p>
          {problemReports.length === 0 ? (
            <p className="text-sm text-muted">{t("report.noneYet")}</p>
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
                  <p className="mt-1 text-xs text-muted">
                    {r.anonymous ? t("report.anonymous") : t("report.named")} {t("report.suffix")}
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
