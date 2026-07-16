import SubPageHeader from "../components/SubPageHeader";
import { RECOGNITION } from "../data/mockData";
import { ReviewIcon } from "../components/icons";
import { useKiosk } from "../context/KioskContext";

export default function Recognition() {
  const { t } = useKiosk();
  return (
    <>
      <SubPageHeader title={t("tiles.recognition.title")} subtitle={t("tiles.recognition.subtitle")} />

      <ul className="space-y-4">
        {RECOGNITION.map((r) => (
          <li key={r.id} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-500">
              <ReviewIcon />
            </span>
            <div>
              <p className="font-semibold text-ink">{r.from}</p>
              <p className="mt-1 text-sm text-muted">{r.note}</p>
              <p className="mt-2 text-xs text-muted">
                {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
