// Mock data for the Kiosk demo. No backend — everything lives in memory
// for the session and resets on reload / logout.

export const WORKERS = {
  "emp-10433": {
    id: "emp-10433",
    name: "Amina Yusuf",
    role: "Packaging Operator",
    department: "Production",
    location: "Lagos Plant 2",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Amina",
    shift: {
      label: "Morning",
      start: "7:00 AM",
      end: "4:00 PM",
      station: "Packaging Line B",
      icon: "morning",
    },
    leaveBalance: {
      annual: 18,
      sick: 6,
      casual: 4,
    },
    loanEligibility: {
      maxAmount: 60000,
      currency: "₦",
      outstanding: 0,
    },
    payslips: [
      { month: "June 2026", net: "₦148,200", status: "Paid", date: "2026-06-28" },
      { month: "May 2026", net: "₦148,200", status: "Paid", date: "2026-05-29" },
      { month: "April 2026", net: "₦142,900", status: "Paid", date: "2026-04-28" },
    ],
  },
  "emp-10501": {
    id: "emp-10501",
    name: "Chidi Okonkwo",
    role: "Machine Technician",
    department: "Maintenance",
    location: "Lagos Plant 2",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Chidi",
    shift: {
      label: "Afternoon",
      start: "2:00 PM",
      end: "10:00 PM",
      station: "Maintenance Bay 1",
      icon: "afternoon",
    },
    leaveBalance: {
      annual: 12,
      sick: 8,
      casual: 2,
    },
    loanEligibility: {
      maxAmount: 45000,
      currency: "₦",
      outstanding: 15000,
    },
    payslips: [
      { month: "June 2026", net: "₦165,000", status: "Paid", date: "2026-06-28" },
      { month: "May 2026", net: "₦165,000", status: "Paid", date: "2026-05-29" },
    ],
  },
};

export const HR_UPDATES = [
  {
    id: "u1",
    title: "New PPE policy effective August 1",
    body: "All floor staff must wear updated safety vests starting next month. Collect yours from HR.",
    date: "2026-07-10",
    tag: "Policy",
  },
  {
    id: "u2",
    title: "Plant 2 town hall — July 22",
    body: "Join the quarterly town hall at the cafeteria, 3:00 PM. Attendance is optional but lunch is provided.",
    date: "2026-07-08",
    tag: "Event",
  },
  {
    id: "u3",
    title: "Salary advance limit increased",
    body: "Eligible staff can now request up to 40% of net pay as salary advance, up from 30%.",
    date: "2026-07-02",
    tag: "Benefits",
  },
];

export const RECOGNITION = [
  {
    id: "r1",
    from: "Line Supervisor — Tunde B.",
    note: "Consistently hit output targets this week with zero defects. Great work!",
    date: "2026-07-12",
    type: "praise",
  },
  {
    id: "r2",
    from: "Quality Team",
    note: "Q2 performance review completed — rated 'Exceeds Expectations'.",
    date: "2026-06-30",
    type: "review",
  },
];

export const BENEFITS = [
  {
    id: "b1",
    title: "Health Insurance",
    desc: "HMO cover for you and up to 2 dependents. Card renews yearly every June.",
  },
  {
    id: "b2",
    title: "Pension Savings",
    desc: "8% employer contribution matched with your 8% deduction, remitted monthly.",
  },
  {
    id: "b3",
    title: "Meal Subsidy",
    desc: "Subsidized cafeteria meals on all working days, deducted from monthly pay.",
  },
  {
    id: "b4",
    title: "Transport Allowance",
    desc: "Fixed monthly allowance for staff outside the plant shuttle route.",
  },
];

export function getWorker(employeeId) {
  const key = employeeId.trim().toLowerCase();
  return WORKERS[key];
}
