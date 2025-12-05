import { useEffect, useState } from "react";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import api from "../api";
import { useAuth } from "../auth";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId") || null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {

    if (user?.companyId) {
      setCompanyId(user.companyId);
      localStorage.setItem("companyId", user.companyId);
    }
  }, [user]);


  const handleRefresh = () => setRefresh(r => r + 1);

  const copyId = async () => {
    if (!companyId) return;
    await navigator.clipboard.writeText(companyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl">
        <div>
          <h3 className="text-sm text-gray-300">Company ID</h3>
          <div className="flex items-center gap-3">
            <code className="bg-white/10 px-3 py-1 rounded font-mono text-sm">{companyId || "—"}</code>
            <button onClick={copyId} className="px-3 py-1 rounded bg-green-600 text-white">
              {copied ? "✅ Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div>
          <span className="text-sm text-gray-300">Welcome</span>
        </div>
      </div>

      
      <LeadForm onLeadCreated={() => handleRefresh()} />

      
      <LeadTable refresh={refresh} />
    </div>
  );
}
