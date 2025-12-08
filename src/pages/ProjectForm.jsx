import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import ContactTable from "../components/ContactTable";

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectName: "",
    company: "",
    branch: "",
    department: "",
    customerId: "",
    vendorId: "",
    projectPlace: "",
    startDate: "",
    endDate: "",
    estimatedBudget: "",
    status: "Not Started",
    attachments: [],
  });

  const [contacts, setContacts] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    loadMeta();
    if (id) loadProject();
  }, [id]);

  // ✅ LOAD META
  const loadMeta = async () => {
    try {
      const c = await api.get("/meta/companies");
      const cust = await api.get("/customers");
      const vend = await api.get("/vendors");

      setCompanies(c.data || []);
      setCustomers(cust.data.items || []);
      setVendors(vend.data.items || []);
    } catch {
      toast.error("Failed to load dropdowns");
    }
  };

  // ✅ LOAD PROJECT (EDIT MODE)
  const loadProject = async () => {
    try {
      setFetching(true);
      const r = await api.get(`/projects/${id}`);
      setForm(r.data);
      setContacts(r.data.contacts || []);

      if (r.data.company) {
        const b = await api.get(`/meta/branches/${r.data.company}`);
        setBranches(b.data || []);
      }
      if (r.data.branch) {
        const d = await api.get(`/meta/departments/${r.data.branch}`);
        setDepartments(d.data || []);
      }
    } catch {
      toast.error("Failed to load project");
    } finally {
      setFetching(false);
    }
  };

  // ✅ HANDLE DROPDOWNS
  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "company") {
      const r = await api.get(`/meta/branches/${value}`);
      setBranches(r.data || []);
      setDepartments([]);
      setForm({ ...form, company: value, branch: "", department: "" });
    } else if (name === "branch") {
      const r = await api.get(`/meta/departments/${value}`);
      setDepartments(r.data || []);
      setForm({ ...form, branch: value, department: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ FILE SELECT
  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  // ✅ REMOVE OLD FILE
  const removeOldAttachment = (index) => {
    const updated = [...form.attachments];
    updated.splice(index, 1);
    setForm({ ...form, attachments: updated });
  };

  // ✅ UPLOAD TO CLOUDINARY
  const uploadAttachments = async () => {
    if (newFiles.length === 0) return [];

    const data = new FormData();
    newFiles.forEach((file) => data.append("files", file));

    const res = await api.post("/uploads/projects", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.files || [];
  };

  // ✅ SAVE PROJECT
  const save = async () => {
    if (!form.projectName) return toast.error("Project name required");
    if (contacts.length === 0)
      return toast.error("At least 1 contact required");

    try {
      setLoading(true);

      const uploadedFiles = await uploadAttachments();

      const payload = {
        ...form,
        customerId: form.customerId || null,
        vendorId: form.vendorId || null,
        contacts,
        attachments: [...(form.attachments || []), ...uploadedFiles],
      };

      if (id) {
        await api.put(`/projects/${id}`, payload);
        toast.success("Project updated");
      } else {
        await api.post("/projects", payload);
        toast.success("Project created");
      }

      navigate("/projects");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SPINNERS (same style as CustomerForm)
  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
  );
  const Spinner2 = () => (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  );

  if (fetching) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        {id ? "Edit" : "Add"} Project
      </h1>

      {/* ✅ FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <label className="block text-sm text-gray-600">Project Name *</label>
          <input
            value={form.projectName}
            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-1"
          />

          <label className="block text-sm text-gray-600 mt-3">Company</label>
          <select
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full border px-3 py-2 mt-1 rounded"
          >
            <option value="">Select</option>
            {companies.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-600 mt-3">Branch</label>
          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            className="w-full border px-3 py-2 mt-1 rounded"
          >
            <option value="">Select</option>
            {branches.map((b) => (
              <option key={b._id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-600 mt-3">Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border px-3 py-2 mt-1 rounded"
          >
            <option value="">Select</option>
            {departments.map((d) => (
              <option key={d._id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <label className="block text-sm text-gray-600">Customer</label>
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            className="w-full border px-3 py-2 mt-1 rounded"
          >
            <option value="">Select</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.customerName}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-600 mt-3">Vendor</label>
          <select
            name="vendorId"
            value={form.vendorId}
            onChange={handleChange}
            className="w-full border px-3 py-2 mt-1 rounded"
          >
            <option value="">Select</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.vendorName}
              </option>
            ))}
          </select>

          <label className="block text-sm text-gray-600 mt-3">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 mt-1 rounded"
          >
            <option>Not Started</option>
            <option>Ongoing</option>
            <option>On Hold</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* ✅ ATTACHMENTS */}
      <div className="card mt-4">
        <label className="block text-sm font-medium mb-2">
          Project Attachments
        </label>

        <label className="px-4 py-2 bg-gray-900 text-white rounded cursor-pointer inline-block">
          Choose Files
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* ✅ SELECTED FILE NAMES */}
        {newFiles.length > 0 && (
          <div className="mt-2 text-sm text-gray-700">
            <strong>Selected Files:</strong>
            <ul className="list-disc ml-5">
              {newFiles.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          </div>
        )}

        {form.attachments.map((f, i) => (
  <div key={i} className="flex justify-between mt-2 text-sm">
    <button
      onClick={async () => {
        try {
          const response = await fetch(f.url);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = f.originalName;   // ✅ forces download
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          window.URL.revokeObjectURL(url);
        } catch {
          toast.error("Download failed");
        }
      }}
      className="text-blue-600 hover:underline"
    >
      {f.originalName}
    </button>

    <button
      onClick={() => removeOldAttachment(i)}
      className="text-red-500"
    >
      Remove
    </button>
  </div>
))}

      </div>

      {/* ✅ CONTACTS */}
      <ContactTable contacts={contacts} setContacts={setContacts} />

      {/* ✅ BUTTONS WITH SPINNER */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={save}
          disabled={loading}
          className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition w-24 flex items-center justify-center"
        >
          {loading ? <Spinner2 /> : id ? "Update" : "Create"}
        </button>

        <button
          onClick={() => navigate("/projects")}
          className="px-3 py-1 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
