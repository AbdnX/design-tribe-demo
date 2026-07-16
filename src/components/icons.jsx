const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export const ShiftIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
);
export const OutputIcon = () => (
  <svg {...base}><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
);
export const LeaveIcon = () => (
  <svg {...base}><path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
);
export const BenefitsIcon = () => (
  <svg {...base}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
);
export const LoansIcon = () => (
  <svg {...base}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 6v12M18 6v12" /></svg>
);
export const ReportIcon = () => (
  <svg {...base}><path d="M4 22V4" /><path d="M4 4h11l-1.5 3.5L15 11H4" /></svg>
);
export const ReviewIcon = () => (
  <svg {...base}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z" /></svg>
);
export const PayslipsIcon = () => (
  <svg {...base}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></svg>
);
export const UpdatesIcon = () => (
  <svg {...base}><path d="M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z" /><path d="M15 8a5 5 0 0 1 0 8" /><path d="M18 5a9 9 0 0 1 0 14" /></svg>
);
