import { useState } from "react";
import ContactModal from "./ContactModal";

export default function ContactTable({ contacts, setContacts }) {
  const [open, setOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(-1);

  const openAdd = () => { setEditingIdx(-1); setOpen(true); };
  const openEdit = (idx) => { setEditingIdx(idx); setOpen(true); };

  const onSave = (contact) => {
    let updated = [...contacts];
    // ensure only one primary
    if (contact.isPrimary) updated = updated.map(c => ({ ...c, isPrimary: false }));

    if (editingIdx >= 0) updated[editingIdx] = contact;
    else updated.push(contact);

    // If still no primary, mark first
    if (!updated.some(c => c.isPrimary) && updated.length > 0) updated[0].isPrimary = true;

    setContacts(updated);
  };

  const remove = (idx) => {
    if (contacts.length <= 1) return alert("At least one contact required");
    const updated = contacts.filter((_, i) => i !== idx);
    // ensure primary exists
    if (!updated.some(c => c.isPrimary) && updated.length > 0) updated[0].isPrimary = true;
    setContacts(updated);
  };

  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Contacts</h3>
        <div>
          <button className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition" onClick={openAdd}>Add Contact</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Email</th>
              <th className="py-2">Primary</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr key={i} className="table-row">
                <td className="py-2">{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.isPrimary ? <span className="text-green-600 font-semibold ">Yes</span> : 'No'}</td>
                <td className="py-2">
                  <button className="px-2 py-1 mr-2 border rounded bg-gray-900 text-white hover:bg-gray-800 transition" onClick={()=>openEdit(i)}>Edit</button>
                  <button className="px-2 py-1 border rounded" onClick={()=>remove(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContactModal open={open} onClose={()=>setOpen(false)} onSave={onSave} initial={editingIdx>=0 ? contacts[editingIdx] : null} />
    </div>
  );
}
