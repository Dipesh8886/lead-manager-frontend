
import { useEffect, useState } from "react";
import { Search } from "lucide-react";  
import api from "../api";

export default function AdminPanel() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await api.get("/admin/leads");
      setLeads(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const doDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/admin/leads/${id}`);
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (err) { console.error(err); }
  };


  const q = search.toLowerCase();
  const filtered = leads.filter(l => {
    const matchesSearch =
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.phone1 && l.phone1.includes(search)) ||
      (l.companyId?.name && l.companyId.name.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">

      <div className="bg-white/20 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold">Admin Panel — All Leads</h2>
        
        <div className="flex gap-2">

          <div className="flex items-center bg-white/10 rounded px-2">
            <Search size={18} className="text-gray-300" />
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search..."
              className="p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>


          <select
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
            className="p-2 rounded bg-white/10 text-white"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>


      <div className="bg-white/20 p-6 rounded-xl overflow-x-auto">
        <table className="w-full text-white text-sm">
          <thead className="bg-white/10 text-left">
            <tr>
              <th className="p-2 w-[160px]">Company</th>
              <th className="p-2 w-[120px]">Name</th>
              <th className="p-2 w-[120px]">Phone</th>
              <th className="p-2 w-[160px]">Email</th>
              <th className="p-2 w-[120px]">Status</th>
              <th className="p-2 w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l._id} className="border-t border-white/10">
                <td className="p-2 truncate">{l.companyId?.name || "—"}</td>
                <td className="p-2 truncate">{l.name}</td>
                <td className="p-2">{l.phone1}</td>
                <td className="p-2 truncate">{l.email}</td>
                <td className="p-2 capitalize">{l.status}</td>
                <td className="p-2">
                  <button
                    onClick={()=>doDelete(l._id)}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-300">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
