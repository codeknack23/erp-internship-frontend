import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// Spinner Component
const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
);

// Format Recent Log Date
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

  // Loading states
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/customers")
      .then((res) => setTotalCustomers(res.data.total))
      .catch(() => setTotalCustomers(0))
      .finally(() => setLoadingCustomers(false));

    axiosClient
      .get("/vendors")
      .then((res) => setTotalVendors(res.data.total))
      .catch(() => setTotalVendors(0))
      .finally(() => setLoadingVendors(false));

    axiosClient
      .get("/audit")
      .then((res) => setRecent(res.data))
      .catch(() => setRecent([]))
      .finally(() => setLoadingRecent(false));
  }, []);

  return (
    <div className="space-y-4">

      {/* Row 1: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Total Customers */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Total Customers</h3>
          <div className="text-3xl mt-2 font-bold">
            {loadingCustomers ? <Spinner /> : totalCustomers}
          </div>
          {/* See All Link */}
          {!loadingCustomers && (
            <a href="/customers" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              See All
            </a>
          )}
        </div>

        {/* Total Vendors */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Total Vendors</h3>
          <div className="text-3xl mt-2 font-bold">
            {loadingVendors ? <Spinner /> : totalVendors}
          </div>
          {/* See All Link */}
          {!loadingVendors && (
            <a href="/vendors" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              See All
            </a>
          )}
        </div>

      </div>

      {/* Row 2: Recent Activity */}
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Recent Activity (Last 5 Logs)</h3>

        <div className="mt-3 space-y-2">

          {/* Show spinner */}
          {loadingRecent && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Spinner /> Loading recent activity...
            </div>
          )}

          {/* No logs */}
          {!loadingRecent && recent.length === 0 && (
            <div className="text-sm text-gray-600">No recent activity.</div>
          )}

          {/* Logs */}
          {!loadingRecent &&
            recent.map((log) => (
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
