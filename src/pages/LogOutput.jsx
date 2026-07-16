import { useState } from "react";
import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

const TASK_KEYS = ["task.packaging", "task.quality", "task.palletizing", "task.sorting"];

export default function LogOutput() {
  const { outputEntries, addOutputEntry, t } = useKiosk();
  const [taskKey, setTaskKey] = useState(TASK_KEYS[0]);
  const [units, setUnits] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const total = outputEntries.reduce((sum, e) => sum + Number(e.units), 0);

  function handleSubmit(e) {
    e.preventDefault();
    const value = Number(units);
    if (!value || value <= 0) return;
    addOutputEntry({ task: t(taskKey), units: value });
    setUnits("");
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2000);
  }

  return (
    <>
      <SubPageHeader title={t("tiles.output.title")} subtitle={t("tiles.output.subtitle")} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="mb-5 flex items-center justify-between rounded-xl bg-brand-indigo/5 p-4">
            <span className="text-sm text-muted">{t("output.totalLoggedToday")}</span>
            <span className="text-xl font-semibold text-ink">
              {total} {t("output.units")}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-ink">{t("output.taskLine")}</label>
              <select
                value={taskKey}
                onChange={(e) => setTaskKey(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              >
                {TASK_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t(key)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink">{t("output.unitsCompleted")}</label>
              <input
                type="number"
                min="1"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                placeholder={t("output.unitsPlaceholder")}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <button
              type="submit"
              disabled={!units}
              className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {confirmed ? t("output.logged") : t("output.addEntry")}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="mb-4 font-semibold text-ink">{t("output.todaysEntries")}</p>
          {outputEntries.length === 0 ? (
            <p className="text-sm text-muted">{t("output.noneYet")}</p>
          ) : (
            <ul className="space-y-3">
              {outputEntries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between border-b border-line pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{entry.task}</p>
                    <p className="text-xs text-muted">
                      {entry.time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className="font-semibold text-ink">
                    {entry.units} {t("output.units")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
