import { useState } from "react";
import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

const TASKS = ["Packaging Line B", "Quality Check", "Palletizing", "Sorting"];

export default function LogOutput() {
  const { outputEntries, addOutputEntry } = useKiosk();
  const [task, setTask] = useState(TASKS[0]);
  const [units, setUnits] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const total = outputEntries.reduce((sum, e) => sum + Number(e.units), 0);

  function handleSubmit(e) {
    e.preventDefault();
    const value = Number(units);
    if (!value || value <= 0) return;
    addOutputEntry({ task, units: value });
    setUnits("");
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2000);
  }

  return (
    <>
      <SubPageHeader title="Log Output" subtitle="Add units for today's task" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="mb-5 flex items-center justify-between rounded-xl bg-brand-indigo/5 p-4">
            <span className="text-sm text-muted">Total logged today</span>
            <span className="text-xl font-semibold text-ink">{total} units</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-ink">Task / Line</label>
              <select
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              >
                {TASKS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink">Units completed</label>
              <input
                type="number"
                min="1"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                placeholder="e.g. 120"
                className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <button
              type="submit"
              disabled={!units}
              className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {confirmed ? "Logged ✓" : "Add entry"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="mb-4 font-semibold text-ink">Today's entries</p>
          {outputEntries.length === 0 ? (
            <p className="text-sm text-muted">No output logged yet.</p>
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
                  <span className="font-semibold text-ink">{entry.units} units</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
