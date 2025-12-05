import { useEffect, useState, useRef } from "react";
import api from "../api";
import { Search } from "lucide-react"; 

export default function LeadTable({ refresh }) {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [headerShadow, setHeaderShadow] = useState(false);
  const tableWrapperRef = useRef(null);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data || []);
    } catch (err) {
      console.error("Fetch leads error", err);
    }
  };

  useEffect(() => { fetchLeads(); }, [refresh]);

  const deleteLead = async (id) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/leads/${id}`, { status });
      setLeads(prev => prev.map(l => (l._id === id ? res.data : l)));
    } catch (err) { console.error(err); }
  };

  const q = search.toLowerCase();
  const filtered = leads.filter(l =>
    (l.name && l.name.toLowerCase().includes(q)) ||
    (l.phone1 && l.phone1.includes(search)) ||
    (l.phone2 && l.phone2.includes(search)) ||
    (l.email && l.email.toLowerCase().includes(q))
  ).filter(l => (filter ? l.status === filter : true));

  
  useEffect(() => {
    const handleScroll = () => {
      if (!tableWrapperRef.current) return;
      setHeaderShadow(tableWrapperRef.current.scrollTop > 0);
    };
    const wrapper = tableWrapperRef.current;
    if (wrapper) wrapper.addEventListener("scroll", handleScroll);
    return () => {
      if (wrapper) wrapper.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
      
     
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="w-5 h-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name / phone / email"
            className="w-full pl-12 p-3 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/50 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
        </div>

       
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-56 p-3 rounded-xl bg-white/10 backdrop-blur-md text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      
      <div
        className="overflow-x-auto rounded-2xl border border-white/20 max-h-[600px] relative"
        ref={tableWrapperRef}
      >
        <table className="w-full text-white table-auto border-collapse">
          <thead
            className={`sticky top-0 bg-white/20 backdrop-blur-md z-10 transition-shadow ${
              headerShadow ? "shadow-lg" : ""
            }`}
          >
            <tr>
              <th className="p-3 text-left border-b border-white/20">Name</th>
              <th className="p-3 text-left border-b border-white/20">Phone</th>
              <th className="p-3 text-left border-b border-white/20">Email</th>
              <th className="p-3 text-left border-b border-white/20">Source</th>
              <th className="p-3 text-left border-b border-white/20">Status</th>
              <th className="p-3 text-left border-b border-white/20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-300">
                  No leads found.
                </td>
              </tr>
            ) : (
              filtered.map((l, idx) => (
                <tr
                  key={l._id}
                  className={`${idx % 2 === 0 ? "bg-white/5" : "bg-white/10"} hover:bg-white/20 transition`}
                >
                  <td className="p-3 border-b border-white/20">{l.name}</td>
                  <td className="p-3 border-b border-white/20">{l.phone1}{l.phone2 ? `, ${l.phone2}` : ""}</td>
                  <td className="p-3 border-b border-white/20">{l.email}</td>
                  <td className="p-3 border-b border-white/20">{l.source}</td>
                  <td className="p-3 border-b border-white/20 capitalize">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l._id, e.target.value)}
                      className="bg-white/20 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="p-3 border-b border-white/20">
                    <button
                      onClick={() => deleteLead(l._id)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
