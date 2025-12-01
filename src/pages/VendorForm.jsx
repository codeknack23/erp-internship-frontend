import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContactTable from "../components/ContactTable";
import api from "../api/axiosClient";

export default function VendorForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vendorName: '',
    shortName: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    phone: '',
    gstin: '',
    msme: false
  });
  const [contacts, setContacts] = useState([{ name: '', phone: '', isPrimary: true }]);
  const [loading, setLoading] = useState(false);   // spinner for save button
  const [fetching, setFetching] = useState(false); // spinner for load

  useEffect(() => { 
    if (id) load(); 
  }, [id]);

  const load = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/vendors/${id}`);
      setForm({
        vendorName: res.data.vendorName || '',
        shortName: res.data.shortName || '',
        city: res.data.city || '',
        state: res.data.state || '',
        pincode: res.data.pincode || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        gstin: res.data.gstin || '',
        msme: res.data.msme || false
      });
      setContacts(res.data.contacts && res.data.contacts.length ? res.data.contacts : contacts);
    } catch (e) {
      alert('Failed to load vendor');
    } finally {
      setFetching(false);
    }
  };

  const save = async () => {
    if (!form.vendorName) return alert('Vendor name required');
    if (!contacts || contacts.length === 0) return alert('At least one contact required');

    const payload = { ...form, contacts };
    setLoading(true);
    try {
      if (id) await api.put(`/vendors/${id}`, payload);
      else await api.post('/vendors', payload);
      navigate('/vendors');
    } catch (e) {
      alert(e.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  // Spinner component
  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  );

  // Show centered spinner while fetching
  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{ id ? 'Edit Vendor' : 'Add Vendor' }</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <label className="block text-sm text-gray-600">Vendor Name</label>
          <input 
            value={form.vendorName} 
            onChange={e => setForm({ ...form, vendorName: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
          />

          <label className="block text-sm text-gray-600 mt-3">Short Name</label>
          <input 
            value={form.shortName} 
            onChange={e => setForm({ ...form, shortName: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
          />

          <label className="block text-sm text-gray-600 mt-3">City</label>
          <input 
            value={form.city} 
            onChange={e => setForm({ ...form, city: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
          />
        </div>

        <div className="card">
          <label className="block text-sm text-gray-600">Email</label>
          <input 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
          />

          <label className="block text-sm text-gray-600 mt-3">Phone</label>
          <input 
            value={form.phone} 
            onChange={e => setForm({ ...form, phone: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
          />

          <label className="block text-sm text-gray-600 mt-3">GSTIN</label>
          <input 
            value={form.gstin} 
            onChange={e => setForm({ ...form, gstin: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
          />

          <label className="inline-flex items-center gap-2 mt-3">
            <input 
              type="checkbox" 
              checked={form.msme} 
              onChange={e => setForm({ ...form, msme: e.target.checked })} 
            />
            <span className="text-sm">MSME</span>
          </label>
        </div>
      </div>

      <ContactTable contacts={contacts} setContacts={setContacts} />

      <div className="mt-4 flex gap-2">
        <button
          onClick={save}
          disabled={loading}
          className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition w-24 flex items-center justify-center"
        >
          {loading ? <Spinner /> : id ? 'Update' : 'Create'}
        </button>
        <button 
          onClick={() => navigate('/vendors')} 
          className="px-3 py-1 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
