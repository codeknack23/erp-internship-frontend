import { useState } from "react";
import ContactModal from "./ContactModal";
import { toast } from "react-toastify";

export default function ContactTable({ contacts, setContacts }) {
  const [open, setOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(-1);

  const openAdd = () => {
    setEditingIdx(-1);
    setOpen(true);
  };

  const openEdit = (idx) => {
    setEditingIdx(idx);
    setOpen(true);
  };

  const onSave = (contact) => {
    if (!contact.name && !contact.phone && !contact.email) return;

    let updated = [...contacts];

    // Ensure only one primary
    if (contact.isPrimary) {
      updated = updated.map((c) => ({ ...c, isPrimary: false }));
    }

    if (editingIdx >= 0) {
      updated[editingIdx] = contact;
      toast.success("Contact updated successfully");
    } else {
      updated.push(contact);
      toast.success("Contact added successfully");
    }

    if (!updated.some((c) => c.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    const filtered = updated.filter(
      (c) =>
        c.name ||
        c.phone ||
        c.email ||
        c.designation
    );

    setContacts(filtered);
  };

  const remove = (idx) => {
    if (contacts.length <= 1)
      return toast.error("At least one contact required");

    if (window.confirm("Are you sure you want to delete this contact?")) {
      const updated = contacts.filter((_, i) => i !== idx);

      if (!updated.some((c) => c.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }

      setContacts(updated);
      toast.success("Contact deleted successfully");
    }
  };

  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Contacts</h3>
        <button
          className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition"
          onClick={openAdd}
        >
          Add Contact
        </button>
      </div>

      <div className="overflow-x-auto">
        {contacts.length === 0 ? (
          <div className="py-6 text-center text-gray-500 text-sm italic">
            No contacts yet. Click <span className="font-medium text-gray-700">Add Contact</span> to create one.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-sm text-gray-500">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Designation</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Email</th>
                <th className="py-2">Level</th> {/* ✅ NEW */}
                <th className="py-2">Primary</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={i} className="table-row">
                  <td className="py-2">{c.name || "-"}</td>
                  <td className="py-2">{c.designation || "-"}</td>
                  <td>{c.phone || "-"}</td>
                  <td>{c.email || "-"}</td>
                  <td className="capitalize">{c.level || "project"}</td>
                  <td>
                    {c.isPrimary ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-2">
                    <button
                      className="px-2 py-1 mr-2 border rounded bg-gray-900 text-white hover:bg-gray-800 transition"
                      onClick={() => openEdit(i)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => remove(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={onSave}
        initial={editingIdx >= 0 ? contacts[editingIdx] : null}
      />
    </div>
  );
}
