"use client";

import { useState, useEffect, useCallback } from "react";
import StatsBar from "@/components/StatsBar";
import LeadForm from "@/components/LeadForm";
import LeadTable from "@/components/LeadTable";
import SearchFilter from "@/components/SearchFilter";

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  status: "New" | "Contacted" | "Converted";
  createdAt: string;
  updatedAt: string;
};

export type LeadFormData = Omit<Lead, "id" | "createdAt" | "updatedAt">;

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setError("Could not load leads. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const handleSaveLead = async (data: LeadFormData) => {
    try {
      const url = editingLead ? `/api/leads/${editingLead.id}` : "/api/leads";
      const method = editingLead ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return result.error || "An error occurred";
      }
      await fetchLeads();
      setShowForm(false);
      setEditingLead(null);
      return null;
    } catch {
      return "Network error. Please try again.";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchLeads();
    } catch {
      alert("Failed to delete lead. Please try again.");
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleStatusChange = async (id: number, status: Lead["status"]) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchLeads();
    } catch {
      alert("Failed to update status. Please try again.");
    }
  };

  const stats = {
    total: leads.length,
    newLeads: leads.filter((l) => l.status === "New").length,
    converted: leads.filter((l) => l.status === "Converted").length,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Mini CRM</h1>
              <p className="text-xs text-slate-500">Lead Management Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingLead(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lead
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Search & Filter */}
        <SearchFilter
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Leads Table */}
        <div className="mt-6">
          <LeadTable
            leads={leads}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>

      {/* Modal Form */}
      {showForm && (
        <LeadForm
          initialData={editingLead}
          onSave={handleSaveLead}
          onClose={() => { setShowForm(false); setEditingLead(null); }}
        />
      )}
    </div>
  );
}
