import { BellIcon } from "@heroicons/react/24/outline";

export default function Topbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">ERP — Internship Task </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100"><BellIcon className="w-5 h-5 text-gray-600" /></button>
          <div className="px-3 py-1 rounded-full bg-gray-100 text-sm">Ronak</div>
        </div>
      </div>
    </header>
  );
}
