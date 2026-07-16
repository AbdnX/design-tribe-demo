import { useState } from "react";
import SubPageHeader from "../components/SubPageHeader";
import { useKiosk } from "../context/KioskContext";

export default function Loans() {
  const { worker, loanRequests, addLoanRequest, t } = useKiosk();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { maxAmount, currency, outstanding } = worker.loanEligibility;
  const available = maxAmount - outstanding;

  function handleSubmit(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    if (value > available) {
      setError(t("loans.errorMax", { amount: `${currency}${available.toLocaleString()}` }));
      return;
    }
    setError("");
    addLoanRequest({ amount: value, reason });
    setAmount("");
    setReason("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <>
      <SubPageHeader title={t("tiles.loans.title")} subtitle={t("tiles.loans.subtitle")} />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-xl font-semibold text-ink">
            {currency}
            {available.toLocaleString()}
          </p>
          <p className="text-xs text-muted">{t("loans.available")}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-xl font-semibold text-ink">
            {currency}
            {outstanding.toLocaleString()}
          </p>
          <p className="text-xs text-muted">{t("loans.outstanding")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm text-ink">
              {t("loans.amountLabel")} ({currency})
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("loans.upTo", { amount: available.toLocaleString() })}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink">{t("loans.reasonOptional")}</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
            />
          </div>
          <button
            type="submit"
            disabled={!amount}
            className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {submitted ? t("loans.sent") : t("loans.requestAdvance")}
          </button>
        </form>

        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="mb-4 font-semibold text-ink">{t("loans.yourRequests")}</p>
          {loanRequests.length === 0 ? (
            <p className="text-sm text-muted">{t("loans.noneYet")}</p>
          ) : (
            <ul className="space-y-3">
              {loanRequests.map((r) => (
                <li key={r.id} className="flex items-center justify-between border-b border-line pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {currency}
                      {r.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted">
                      {r.submittedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                    {r.status}
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
