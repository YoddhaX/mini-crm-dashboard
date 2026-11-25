"use client";

import { useState } from "react";
import { Lead, LeadFormData } from "@/app/page";

type Props = {
  initialData: Lead | null;
  onSave: (data: LeadFormData) => Promise<string | null>;
  onClose: () => void;
};

type FormErrors = Partial<Record<keyof LeadFormData, string>>;

function validateForm(data: LeadFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name || data.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email address.";
  if (!data.phone || data.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Phone must be at least 7 digits.";
  if (!data.businessName || data.businessName.trim().length < 1)
    errors.businessName = "Business name is required.";
  return errors;
}

export default function LeadForm({ initialData, onSave, onClose }: Props) {
  const [form, setForm] = useState<LeadFormData>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    businessName: initialData?.businessName ?? "",
    status: initialData?.status ?? "New",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LeadFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    setServerError(null);
    const error = await onSave(form);
    setSaving(false);
    if (error) setServerError(error);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? "Edit Lead" : "Add New Lead"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder-slate-400 ${
                  errors.name ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder-slate-400 ${
                  errors.email ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder-slate-400 ${
                  errors.phone ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Acme Corp"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder-slate-400 ${
                  errors.businessName ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.businessName && (
                <p className="text-xs text-red-600 mt-1">{errors.businessName}</p>
              )}
            </div>

            {/* Status */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {saving ? "Saving..." : initialData ? "Update Lead" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

