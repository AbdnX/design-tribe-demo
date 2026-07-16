import { useNavigate } from "react-router-dom";

export default function TileCard({ to, icon, iconBg = "bg-brand-indigo/10 text-brand-indigo", title, subtitle }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-white p-5 text-left transition hover:border-brand-indigo/40 hover:shadow-sm"
    >
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${iconBg}`}>{icon}</span>
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="block text-sm text-muted">{subtitle}</span>
      </span>
    </button>
  );
}
