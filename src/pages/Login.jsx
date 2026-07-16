import { useState } from "react";
import { useKiosk } from "../context/KioskContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Login() {
  const { login, voiceGuidance, setVoiceGuidance, t } = useKiosk();
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!employeeId.trim()) return;
    setSubmitting(true);
    setError("");
    setTimeout(() => {
      const result = login(employeeId);
      if (!result.ok) {
        setError(result.error);
        setSubmitting(false);
      }
    }, 300);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-between px-8 py-8 sm:px-16">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-ink">Kiosk</span>
          <div className="flex gap-2">
            <LanguageSwitcher
              ariaLabel="Change voice guidance language"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5 6 9H2v6h4l5 4Z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                </svg>
              }
            />
            <LanguageSwitcher
              ariaLabel="Change display language"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 flex justify-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-blue via-brand-green to-brand-orange" />
          </div>
          <h1 className="text-center text-2xl font-semibold">
            <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
              {t("login.heading")}
            </span>
          </h1>
          <p className="mt-2 text-center text-sm text-muted">{t("login.subheading")}</p>

          <hr className="my-6 border-line" />

          <label className="mb-6 flex items-center justify-between gap-3 rounded-xl bg-brand-indigo/5 p-4">
            <span className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5 6 9H2v6h4l5 4Z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                </svg>
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{t("login.voiceGuidanceTitle")}</span>
                <span className="block text-xs text-muted">{t("login.voiceGuidanceDesc")}</span>
              </span>
            </span>
            <input
              type="checkbox"
              checked={voiceGuidance}
              onChange={(e) => setVoiceGuidance(e.target.checked)}
              className="h-6 w-11 shrink-0 appearance-none rounded-full bg-gray-300 checked:bg-brand-blue relative transition
                before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition
                checked:before:translate-x-5"
            />
          </label>

          <form onSubmit={handleSubmit}>
            <label htmlFor="employeeId" className="mb-1.5 block text-sm text-ink">
              {t("login.employeeIdLabel")}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder={t("login.employeeIdPlaceholder")}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand-blue"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={!employeeId.trim() || submitting}
              className="mt-4 w-full rounded-xl bg-gray-200 py-3 text-sm font-medium text-gray-500 transition
                disabled:cursor-not-allowed enabled:bg-brand-blue enabled:text-white"
            >
              {submitting ? t("login.checking") : t("login.continue")}
            </button>
            <p className="mt-3 text-center text-xs text-muted">{t("login.tryHint")}</p>
          </form>
        </div>

        <p className="text-center text-sm text-muted">
          {t("login.poweredBy")} <span className="font-semibold text-brand-blue">Seamless</span>
          <span className="font-semibold text-brand-green">HR</span>
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-orange-50 lg:flex lg:flex-col lg:justify-center lg:px-16">
        <h2 className="text-3xl font-bold text-brand-blue">{t("login.heroTitle")}</h2>
        <p className="mt-3 max-w-md text-ink/80">{t("login.heroSubtitle")}</p>
        <div className="mt-10 flex h-64 items-center gap-4">
          <div className="flex flex-col gap-4">
            <span className="h-16 w-16 rounded-full bg-pink-200" />
            <span className="h-16 w-16 rounded-full bg-purple-200" />
            <span className="h-16 w-16 rounded-full bg-amber-200" />
            <span className="h-14 w-14 rounded-full bg-teal-200" />
          </div>
          <span className="h-56 w-56 rounded-full bg-indigo-100" />
        </div>
      </div>
    </div>
  );
}
