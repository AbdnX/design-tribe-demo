import { useState } from "react";
import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";
import { PayslipsIcon } from "../components/icons";

export default function Payslips() {
  const { worker, t } = useKiosk();
  const [downloading, setDownloading] = useState(null);

  function handleDownload(month) {
    setDownloading(month);
    setTimeout(() => setDownloading(null), 1200);
  }

  return (
    <>
      <SubPageHeader title={t("tiles.payslips.title")} subtitle={t("tiles.payslips.subtitle")} />

      <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
        {worker.payslips.map((p) => (
          <li key={p.month} className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-indigo/10 text-brand-indigo">
                <PayslipsIcon />
              </span>
              <div>
                <p className="font-medium text-ink">{p.month}</p>
                <p className="text-sm text-muted">{t("payslips.netPay", { amount: p.net })}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDownload(p.month)}
              className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-gray-50"
            >
              {downloading === p.month ? t("payslips.downloading") : t("payslips.download")}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
