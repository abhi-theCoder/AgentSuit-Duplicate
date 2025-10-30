import React from "react";
import { Plus, Filter, Search, Edit, Trash } from "lucide-react";

export default function Campaigns() {
  const campaigns = [
    { name: "Summer Sale", leads: 120, status: "Active" },
    { name: "Email Drip #1", leads: 80, status: "Paused" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Campaigns</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="border pl-8 pr-3 py-2 rounded-lg w-72"
          />
        </div>
        <button className="flex items-center gap-2 border px-3 py-2 rounded-lg">
          <Filter size={16} /> Filter
        </button>
      </div>

      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Leads</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.leads}</td>
              <td className="p-3">{c.status}</td>
              <td className="p-3 flex gap-3">
                <button><Edit size={16} /></button>
                <button><Trash size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
