import { useNavigate } from "react-router-dom";

export default function SubPageHeader({ title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex items-center gap-3">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        aria-label="Back to dashboard"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink hover:bg-gray-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div>
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
