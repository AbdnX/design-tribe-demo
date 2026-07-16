import SubPageHeader from "../components/SubPageHeader";
import { HR_UPDATES } from "../data/mockData";
import { useKiosk } from "../context/KioskContext";

export default function HRUpdates() {
  const { t } = useKiosk();
  return (
    <>
      <SubPageHeader title={t("tiles.hrUpdates.title")} subtitle={t("tiles.hrUpdates.subtitle")} />

      <ul className="space-y-4">
        {HR_UPDATES.map((u) => (
          <li key={u.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-brand-blue">
                {u.tag}
              </span>
              <span className="text-xs text-muted">
                {new Date(u.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            </div>
            <p className="mt-2 font-semibold text-ink">{u.title}</p>
            <p className="mt-1 text-sm text-muted">{u.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
