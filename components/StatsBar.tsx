type Stats = {
  total: number;
  newLeads: number;
  converted: number;
};

export default function StatsBar({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Leads",
      value: stats.total,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      label: "New Leads",
      value: stats.newLeads,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      bgColor: "bg-amber-500",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
    },
    {
      label: "Converted",
      value: stats.converted,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4"
        >
          <div className={`${card.bgLight} ${card.textColor} p-3 rounded-lg`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{card.label}</p>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

