import SubPageHeader from "../components/SubPageHeader";
import { BENEFITS } from "../data/mockData";
import { BenefitsIcon } from "../components/icons";

export default function Benefits() {
  return (
    <>
      <SubPageHeader title="Benefits" subtitle="Health, savings and more" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BENEFITS.map((b) => (
          <div key={b.id} className="rounded-2xl border border-line bg-white p-5">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand-indigo/10 text-brand-indigo">
              <BenefitsIcon />
            </span>
            <p className="font-semibold text-ink">{b.title}</p>
            <p className="mt-1 text-sm text-muted">{b.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
