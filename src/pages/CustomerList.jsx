import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [loadingId, setLoadingId] = useState(null); // For Activate/Deactivate button
  const [loadingList, setLoadingList] = useState(true); // For table loading

  const navigate = useNavigate();

  const Spinner = () => (
    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
  );
  const Spinner2 = () => (
    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  );

  const fetchCustomers = async (pageNum = 1) => {
    setLoadingList(true); // Start loader
    try {
      const res = await api.get("/customers", {
        params: { page: pageNum, limit },
      });
      setCustomers(res.data.items || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page);
    } catch {
      alert("Failed to load customers");
    } finally {
      setLoadingList(false); // Stop loader
    }
  };

  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const toggleStatus = async (id, cur) => {
    setLoadingId(id);
    try {
      await api.patch(`/customers/${id}/status`, {
        status: cur === "Active" ? "Inactive" : "Active",
      });
      await fetchCustomers(page);
    } catch {
      alert("Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page * limit < total && setPage(page + 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Customer Master</h1>
        <Link to="/customers/new">
          <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded">
            Add Customer
          </button>
        </Link>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="text-sm text-gray-500">
              <tr>
                <th className="py-2">Code</th>
                <th className="py-2">Name</th>
                <th className="py-2">City</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    <Spinner />
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id}>
                    <td className="py-2">{c.customerCode}</td>
                    <td>{c.customerName}</td>
                    <td>{c.city}</td>
                    <td>{c.phone}</td>
                    <td
                      className={`font-semibold ${
                        c.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      } w-24 text-center`}
                    >
                      {c.status}
                    </td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/customers/edit/${c._id}`)}
                          className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition w-24"
                        >
                          Edit
                        </button>

                        {c.status === "Active" ? (
                          <button
                            onClick={() => toggleStatus(c._id, c.status)}
                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition w-32 flex items-center justify-center gap-2"
                            disabled={loadingId === c._id}
                          >
                            {loadingId === c._id ? (
                              <>
                                <Spinner2 />
                              </>
                            ) : (
                              "Deactivate"
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleStatus(c._id, c.status)}
                            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition w-32 flex items-center justify-center gap-2"
                            disabled={loadingId === c._id}
                          >
                            {loadingId === c._id ? (
                              <>
                                <Spinner2 />
                              </>
                            ) : (
                              "Activate"
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loadingList && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page * limit >= total}
              className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
