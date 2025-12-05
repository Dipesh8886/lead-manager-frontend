import { useState } from "react";
import api from "../api";

export default function LeadForm({ onLeadCreated }) {
  const [form, setForm] = useState({
    name: "", phone1: "", phone2: "", email: "", message: "", source: "", status: "new"
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!/^\d{10}$/.test(form.phone1)) newErrors.phone1 = "Enter a valid 10-digit number";
    if (form.phone2 && !/^\d{10}$/.test(form.phone2)) newErrors.phone2 = "Secondary phone must be 10 digits";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;


    if (name === "phone1" || name === "phone2") {
      val = val.replace(/\D/g, "");
    }

    setForm({ ...form, [name]: val });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await api.post("/leads", form);
      onLeadCreated(res.data);
      setForm({ name: "", phone1: "", phone2: "", email: "", message: "", source: "", status: "new" });
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error("Error saving lead:", err);
      alert(err.response?.data?.message || "Failed to save lead");
    }
  };

  const isValid = Object.keys(validate()).length === 0;

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl space-y-5"
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        {form._id ? "✏️ Edit Lead" : "➕ Add New Lead"}
      </h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-200 mb-1">Full Name</label>
          <input 
            name="name" value={form.name} onChange={handleChange} onBlur={handleBlur}
            placeholder="John Doe" required
            className={`w-full p-3 rounded-lg bg-white/10 text-white 
              focus:outline-none focus:ring-2 ${errors.name && touched.name ? "border border-red-500 focus:ring-red-500" : "focus:ring-pink-500"}`} />
          {errors.name && touched.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-200 mb-1">Primary Phone</label>
          <input 
            name="phone1" value={form.phone1} onChange={handleChange} onBlur={handleBlur}
            placeholder="+91 98765..." required
            className={`w-full p-3 rounded-lg bg-white/10 text-white 
              focus:outline-none focus:ring-2 ${errors.phone1 && touched.phone1 ? "border border-red-500 focus:ring-red-500" : "focus:ring-pink-500"}`} />
          {errors.phone1 && touched.phone1 && <p className="text-red-400 text-sm mt-1">{errors.phone1}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-200 mb-1">Secondary Phone</label>
          <input 
            name="phone2" value={form.phone2} onChange={handleChange} onBlur={handleBlur}
            placeholder="Optional"
            className={`w-full p-3 rounded-lg bg-white/10 text-white 
              focus:outline-none focus:ring-2 ${errors.phone2 && touched.phone2 ? "border border-red-500 focus:ring-red-500" : "focus:ring-purple-500"}`} />
          {errors.phone2 && touched.phone2 && <p className="text-red-400 text-sm mt-1">{errors.phone2}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-200 mb-1">Email</label>
          <input 
            name="email" value={form.email} onChange={handleChange} onBlur={handleBlur}
            placeholder="example@email.com"
            className={`w-full p-3 rounded-lg bg-white/10 text-white 
              focus:outline-none focus:ring-2 ${errors.email && touched.email ? "border border-red-500 focus:ring-red-500" : "focus:ring-purple-500"}`} />
          {errors.email && touched.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-200 mb-1">Source</label>
        <input 
          name="source" value={form.source} onChange={handleChange}
          placeholder="Google, Referral..."
          className="w-full p-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm text-gray-200 mb-1">Status</label>
        <select 
          name="status" value={form.status} onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-200 mb-1">Notes</label>
        <textarea 
          name="message" value={form.message} onChange={handleChange}
          placeholder="Enter notes here..." rows="4"
          className="w-full p-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <button 
        type="submit" disabled={!isValid}
        className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 
          ${isValid 
            ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-white hover:opacity-90" 
            : "bg-gray-500 cursor-not-allowed text-gray-300"}`}
      >
        Save Lead
      </button>
    </form>
  );
}
