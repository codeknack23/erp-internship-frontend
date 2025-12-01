import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);        // Current page number
  const [total, setTotal] = useState(0);      // Total number of customers
  const [limit] = useState(10);               // Limit of 10 customers per page
  const navigate = useNavigate();

  // Fetch customers based on the page and limit
  const fetchCustomers = async (pageNum = 1) => {
    try {
      const res = await api.get("/customers", {
        params: {
          page: pageNum,  // Page number
          limit: limit,    // Limit of 10 customers per page
        },
      });

      setCustomers(res.data.items || []);
      setTotal(res.data.total || 0);  // Set total number of customers
      setPage(res.data.page);         // Set the current page from the response
    } catch (err) {
      console.error(err);
      alert("Failed to load customers");
    }
  };

  // Fetch data when component mounts or page changes
  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const toggleStatus = async (id, cur) => {
    try {
      await api.patch(`/customers/${id}/status`, {
        status: cur === "Active" ? "Inactive" : "Active",
      });
      fetchCustomers(page); // Refresh data after status update
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
              {customers.map((c) => (
                <tr key={c._id} className="table-row">
                  <td className="py-2">{c.customerCode}</td>
                  <td>{c.customerName}</td>
                  <td>{c.city}</td>
                  <td>{c.phone}</td>

                  {/* Status color-coded + fixed width */}
                  <td
                    className={`font-semibold ${
                      c.status === "Active" ? "text-green-600" : "text-red-600"
                    } w-24 text-center`}
                  >
                    {c.status}
                  </td>

                  <td>
                    <div className="flex gap-2 justify-center">

                      {/* Edit Button — fixed width */}
                      <button
                        onClick={() => navigate(`/customers/edit/${c._id}`)}
                        className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition w-24"
                      >
                        Edit
                      </button>

                      {/* Active/Inactive Buttons — fixed width */}
                      {c.status === "Active" ? (
                        <button
                          onClick={() => toggleStatus(c._id, c.status)}
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition w-24"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(c._id, c.status)}
                          className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition w-24"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No customers found
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
