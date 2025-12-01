import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function formatLogDate(log) {
  if (!log.timestamp) return "Unknown time";
  const dt = new Date(log.timestamp);
  if (isNaN(dt.getTime())) return "Unknown time";
  return dt.toLocaleString();
}

export default function Dashboard() {
  const [totalCustomers, setTotalCustomers] = useState("0");
  const [totalVendors, setTotalVendors] = useState("0");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    axiosClient.get("/customers")
      .then((res) => setTotalCustomers(res.data.total))
      .catch(() => setTotalCustomers(0));

    axiosClient.get("/vendors")
      .then((res) => setTotalVendors(res.data.total))
      .catch(() => setTotalVendors(0));

    axiosClient.get("/audit")
      .then((res) => setRecent(res.data))
      .catch(() => setRecent([]));
  }, []);

  return (
    <div className="space-y-4">

      {/* Row 1: Only 2 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Total Customers */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Total Customers</h3>
          <div className="text-3xl mt-2 font-bold">{totalCustomers}</div>
        </div>

        {/* Total Vendors */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Total Vendors</h3>
          <div className="text-3xl mt-2 font-bold">{totalVendors}</div>
        </div>

      </div>

      {/* Row 2: Recent Activity (Full Width) */}
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Recent Activity ( Last 5 Logs )</h3>

        <div className="mt-3 space-y-2">
          {recent.length === 0 && (
            <div className="text-sm text-gray-600">No recent activity.</div>
          )}

          {recent.map((log) => (
            <div key={log._id} className="text-sm border-b pb-1 text-gray-700">
              <strong>{log.module}</strong> — {log.action}
              <div className="text-xs text-gray-500">{formatLogDate(log)}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
