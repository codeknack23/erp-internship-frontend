import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";

export default function ContactModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
    isPrimary: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      setForm({ name: "", designation: "", phone: "", email: "", isPrimary: false });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return false;
    }
    if (form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        toast.error("Please enter a valid email");
        return false;
      }
    }
    return true;
  };

  const save = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 500)); // simulate async
      onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow">
              <Dialog.Title className="text-lg font-medium">
                {initial ? "Edit Contact" : "New Contact"}
              </Dialog.Title>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm text-gray-600">Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Designation</label>
                  <input
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    placeholder="Enter designation"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Phone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    placeholder="Enter phone"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isPrimary"
                      checked={form.isPrimary}
                      onChange={handleChange}
                    />
                    <span className="text-sm">Primary contact</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1 rounded border"
                >
                  Cancel
                </button>

                <button
                  onClick={save}
                  disabled={saving}
                  className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition flex items-center gap-2"
                >
                  {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
