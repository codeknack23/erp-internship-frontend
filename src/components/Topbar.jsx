import { BellIcon } from "@heroicons/react/24/outline";

export default function Topbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* ✅ LEFT BRAND */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
            E
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight">
              ERP Dashboard
            </div>
            <div className="text-xs text-gray-500">
              Internship Task
            </div>
          </div>
        </div>

        {/* ✅ RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* ✅ DATE */}
          <div className="hidden md:block text-sm text-gray-500">
            {today}
          </div>

          {/* ✅ NOTIFICATION */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <BellIcon className="w-5 h-5 text-gray-600" />

            {/* ✅ NOTIFICATION DOT */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* ✅ USER BADGE */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
              R
            </div>
            <span className="text-sm font-medium">Ronak</span>
          </div>

        </div>
      </div>
    </header>
  );
}
