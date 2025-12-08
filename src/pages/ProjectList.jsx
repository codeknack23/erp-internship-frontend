import { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import api from "../api/axiosClient";
import { toast } from "react-toastify";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [loadingList, setLoadingList] = useState(true);

  // ✅ MODAL STATE
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const Spinner = () => (
    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
  );

  const fetchProjects = async (pageNum = 1) => {
    setLoadingList(true);
    try {
      const res = await api.get("/projects", {
        params: { page: pageNum, limit },
      });
      setProjects(res.data.items || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page * limit < total && setPage(page + 1);

  // ✅ OPEN FILE MODAL
  const openFiles = (files) => {
    setFiles(files);
    setOpen(true);
  };

  // ✅ DATE FORMATTER
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div>
      {/* ✅ HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Project Master</h1>

        <Link to="/projects/new">
          <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded">
            Add Project
          </button>
        </Link>
      </div>

      {/* ✅ TABLE */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="text-sm text-gray-500">
              <tr>
                <th className="py-2">Code</th>
                <th className="py-2">Project Name</th>
                <th className="py-2">Company</th>
                <th className="py-2">Branch</th>
                <th className="py-2">Department</th>
                <th className="py-2">Start Date</th>
                <th className="py-2">End Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Files</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan="10" className="py-6 text-center text-gray-500">
                    <Spinner />
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-6 text-center text-gray-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id}>
                    <td className="py-2">{p.projectCode}</td>
                    <td>{p.projectName}</td>
                    <td>{p.company}</td>
                    <td>{p.branch}</td>
                    <td>{p.department}</td>
                    <td>{formatDate(p.startDate)}</td>
                    <td>{formatDate(p.endDate)}</td>

                    <td
                      className={`font-semibold ${
                        p.status === "Completed"
                          ? "text-green-600"
                          : p.status === "Cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.status}
                    </td>

                    <td>
                      {p.attachments?.length > 0 ? (
                        <span className="font-semibold text-green-600">
                          {p.attachments.length} File(s)
                        </span>
                      ) : (
                        <span className="text-gray-400">No Files</span>
                      )}
                    </td>

                    <td>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() =>
                            navigate(`/projects/edit/${p._id}`)
                          }
                          className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition w-24"
                        >
                          Edit
                        </button>

                        {p.attachments?.length > 0 && (
                          <button
                            onClick={() => openFiles(p.attachments)}
                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition w-28"
                          >
                            View Files
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

        {/* ✅ PAGINATION */}
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

      {/* ✅ FILE PREVIEW MODAL */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded p-6 w-full max-w-md shadow">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Project Attachments
              </Dialog.Title>

              <div className="space-y-3">
                {files.length > 0 ? (
                  files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate w-52">
                        {f.originalName}
                      </span>

                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(f.url);
                            const blob = await response.blob();
                            const downloadUrl =
                              window.URL.createObjectURL(blob);

                            const a = document.createElement("a");
                            a.href = downloadUrl;
                            a.download = f.originalName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            window.URL.revokeObjectURL(downloadUrl);
                          } catch {
                            toast.error("File download failed");
                          }
                        }}
                        className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded text-sm"
                      >
                        Download
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center">
                    No files available
                  </p>
                )}
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
