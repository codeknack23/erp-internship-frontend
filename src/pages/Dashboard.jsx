import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

// ✅ Spinner
const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
);

// ✅ Format Date
function formatLogDate(log) {
  if (!log.timestamp) return "Unknown time";
  const dt = new Date(log.timestamp);
  if (isNaN(dt.getTime())) return "Unknown time";
  return dt.toLocaleString();
}

export default function Dashboard() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);

  const [totalProjects, setTotalProjects] = useState(0);
  const [pendingProjects, setPendingProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);

  const [recent, setRecent] = useState([]);

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    axiosClient.get("/customers")
      .then(res => setTotalCustomers(res.data.total))
      .catch(() => setTotalCustomers(0))
      .finally(() => setLoadingCustomers(false));

    axiosClient.get("/vendors")
      .then(res => setTotalVendors(res.data.total))
      .catch(() => setTotalVendors(0))
      .finally(() => setLoadingVendors(false));

    axiosClient.get("/projects/stats")
      .then(res => {
        setTotalProjects(res.data.total || 0);
        setPendingProjects(res.data.pending || 0);
        setCompletedProjects(res.data.completed || 0);
      })
      .catch(() => {
        setTotalProjects(0);
        setPendingProjects(0);
        setCompletedProjects(0);
      })
      .finally(() => setLoadingProjects(false));

    axiosClient.get("/audit")
      .then(res => setRecent(res.data))
      .catch(() => setRecent([]))
      .finally(() => setLoadingRecent(false));
  }, []);

  return (
    <div className="space-y-6">

      {/* ✅ TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Total Customers</p>
          <div className="text-3xl font-bold mt-2">
            {loadingCustomers ? <Spinner /> : totalCustomers}
          </div>
          <Link to="/customers" className="text-sm text-blue-600 hover:underline mt-2 block text-right">
            View
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Total Vendors</p>
          <div className="text-3xl font-bold mt-2">
            {loadingVendors ? <Spinner /> : totalVendors}
          </div>
          <Link to="/vendors" className="text-sm text-blue-600 hover:underline mt-2 block text-right">
            View
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Total Projects</p>
          <div className="text-3xl font-bold mt-2">
            {loadingProjects ? <Spinner /> : totalProjects}
          </div>
          <Link to="/projects" className="text-sm text-blue-600 hover:underline mt-2 block text-right">
            View
          </Link>
        </div>

      </div>

      {/* ✅ PROJECT STATUS (CLEAN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Pending Projects</p>
          <div className="text-3xl font-bold text-yellow-700 mt-2">
            {loadingProjects ? <Spinner /> : pendingProjects}
          </div>
          <p className="text-xs text-gray-500 mt-1">Not Started / On Hold</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Completed Projects</p>
          <div className="text-3xl font-bold text-green-700 mt-2">
            {loadingProjects ? <Spinner /> : completedProjects}
          </div>
          <p className="text-xs text-gray-500 mt-1">Successfully Delivered</p>
        </div>

      </div>

      {/* ✅ RECENT ACTIVITY */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-sm text-gray-500 mb-3">Recent Activity</h3>

        {loadingRecent && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner /> Loading...
          </div>
        )}

        {!loadingRecent && recent.length === 0 && (
          <div className="text-sm text-gray-500">No recent activity</div>
        )}

        {!loadingRecent && recent.map(log => (
          <div key={log._id} className="text-sm border-b py-2">
            <strong>{log.module}</strong> — {log.action}
            <div className="text-xs text-gray-400">
              {formatLogDate(log)}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
