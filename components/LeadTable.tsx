import { Lead } from "@/app/page";

type Props = {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Lead["status"]) => void;
};

const STATUS_STYLES: Record<Lead["status"], string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  Converted: "bg-emerald-100 text-emerald-700",
};

export default function LeadTable({
  leads,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-slate-700 font-semibold text-lg">No leads found</p>
        <p className="text-slate-400 text-sm max-w-xs">
          No leads match your search or filter. Try adjusting the filters or add a new lead.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Desktop table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600 hidden md:table-cell">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600 hidden lg:table-cell">Phone</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600 hidden lg:table-cell">Business</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">Status</th>
              <th className="text-right px-6 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-800">{lead.name}</p>
                    <p className="text-xs text-slate-400 md:hidden">{lead.email}</p>
                    <p className="text-xs text-slate-400 lg:hidden">{lead.businessName}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 hidden md:table-cell">{lead.email}</td>
                <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">{lead.phone}</td>
                <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">{lead.businessName}</td>
                <td className="px-6 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      onStatusChange(lead.id, e.target.value as Lead["status"])
                    }
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${STATUS_STYLES[lead.status]}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit lead"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(lead.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete lead"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

