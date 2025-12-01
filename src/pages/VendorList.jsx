import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);  // You can change this value based on your needs
  const navigate = useNavigate();

  // Fetch vendors with pagination
  const fetchVendors = async (pageNum = 1) => {
    try {
      const res = await api.get("/vendors", {
        params: {
          page: pageNum,
          limit,
        },
      });

      setVendors(res.data.items || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page);
    } catch (e) {
      console.error(e);
      alert("Failed to load vendors");
    }
  };

  // Fetch data when component mounts or page changes
  useEffect(() => {
    fetchVendors(page);
  }, [page]);

  const toggleStatus = async (id, cur) => {
    try {
      await api.patch(`/vendors/${id}/status`, {
        status: cur === "Active" ? "Inactive" : "Active",
      });
      fetchVendors(page); // Refresh data after status update
    } catch (e) {
      alert("Status update failed");
    }
  };

  // Pagination handling
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Vendor Master</h1>
        <button
          onClick={() => navigate("/vendors/new")}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded"
        >
          Add Vendor
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="text-sm text-gray-500">
              <tr>
                <th className="py-2">Code</th>
                <th className="py-2">Name</th>
                <th className="py-2">City</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="table-row">
                  <td className="py-2">{v.vendorCode}</td>
                  <td>{v.vendorName}</td>
                  <td>{v.city}</td>

                  {/* Status color-coded + fixed width */}
                  <td
                    className={`font-semibold ${
                      v.status === "Active" ? "text-green-600" : "text-red-600"
                    } w-24 text-center`}
                  >
                    {v.status}
                  </td>

                  <td>
                    <div className="flex gap-2 justify-center">
                      {/* Edit Button — fixed width */}
                      <button
                        onClick={() => navigate(`/vendors/edit/${v._id}`)}
                        className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition w-24"
                      >
                        Edit
                      </button>

                      {/* Active/Inactive Buttons — fixed width */}
                      {v.status === "Active" ? (
                        <button
                          onClick={() => toggleStatus(v._id, v.status)}
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition w-24"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(v._id, v.status)}
                          className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition w-24"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {vendors.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
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
      </div>
    </div>
  );
}
