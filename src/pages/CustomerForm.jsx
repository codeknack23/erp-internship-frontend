import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContactTable from "../components/ContactTable";
import api from "../api/axiosClient";
// Import toast from react-toastify
import { toast } from 'react-toastify';

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    shortName: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    phone: '',
    gstin: ''
  });

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);   // spinner for save button
  const [fetching, setFetching] = useState(false); // spinner for load

  useEffect(() => { 
    if (id) load(); 
  }, [id]);

  const load = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/customers/${id}`);
      setForm({
        customerName: res.data.customerName || '',
        shortName: res.data.shortName || '',
        city: res.data.city || '',
        state: res.data.state || '',
        pincode: res.data.pincode || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        gstin: res.data.gstin || ''
      });
      setContacts(res.data.contacts && res.data.contacts.length ? res.data.contacts : contacts);
    } catch (e) {
      toast.error('Failed to load customer');
    } finally {
      setFetching(false);
    }
  };

  const save = async () => {
    if (!form.customerName) {
      toast.error('Customer name required');
      return;
    }
    if (!contacts || contacts.length === 0) {
      toast.error('At least one contact is required');
      return;
    }

    const payload = { ...form, contacts };
    setLoading(true);
    try {
      if (id) {
        await api.put(`/customers/${id}`, payload);
        toast.success('Customer updated successfully!');
      } else {
        await api.post('/customers', payload);
        toast.success('Customer created successfully!');
      }
      navigate('/customers');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  // Spinner component
  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
  );
  const Spinner2 = () => (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  );

  // Show centered spinner while fetching
  if (fetching) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{id ? 'Edit' : 'Add'} Customer</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <label className="block text-sm text-gray-600">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input 
            value={form.customerName} 
            onChange={e => setForm({ ...form, customerName: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" placeholder="Enter Name"
          />

          <label className="block text-sm text-gray-600 mt-3">
            Short Name <span className="text-red-500">*</span>
          </label>
          <input 
            value={form.shortName} 
            onChange={e => setForm({ ...form, shortName: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" placeholder="Enter Short Name"
          />

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm text-gray-600">City</label>
              <input 
                value={form.city} 
                onChange={e => setForm({ ...form, city: e.target.value })} 
                className="w-full border rounded px-3 py-2 mt-1" 
                placeholder="Enter City"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">State</label>
              <input 
                value={form.state} 
                onChange={e => setForm({ ...form, state: e.target.value })} 
                className="w-full border rounded px-3 py-2 mt-1" 
                placeholder="Enter State"
              />
            </div>
          </div>

          <label className="block text-sm text-gray-600 mt-3">Pincode</label>
          <input 
            value={form.pincode} 
            onChange={e => setForm({ ...form, pincode: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
            placeholder="Enter Pincode"
          />
        </div>

        <div className="card">
          <label className="block text-sm text-gray-600">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
            placeholder="Enter Email"
          />
          <label className="block text-sm text-gray-600 mt-3">Phone</label>
          <input 
            value={form.phone} 
            onChange={e => setForm({ ...form, phone: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
            placeholder="Enter Phone"
          />
          <label className="block text-sm text-gray-600 mt-3">GSTIN</label>
          <input 
            value={form.gstin} 
            onChange={e => setForm({ ...form, gstin: e.target.value })} 
            className="w-full border rounded px-3 py-2 mt-1" 
            placeholder="Enter GSTIN"
          />
        </div>
      </div>

      <ContactTable contacts={contacts} setContacts={setContacts} />

      <div className="mt-4 flex gap-2">
        <button
          onClick={save}
          disabled={loading}
          className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition w-24 flex items-center justify-center"
        >
          {loading ? <Spinner2 /> : id ? 'Update' : 'Create'}
        </button>
        <button 
          onClick={() => navigate('/customers')} 
          className="px-3 py-1 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
