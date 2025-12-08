import { NavLink } from "react-router-dom";
import {
  UsersIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CubeIcon,
} from "@heroicons/react/24/solid";

export default function Sidebar() {
  const Item = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 
        ${
          isActive
            ? "bg-gray-800 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {/* Left active bar */}
      {({ isActive }) =>
        isActive && (
          <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-md"></span>
        )
      }

      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">

      {/* ✅ LOGO / BRAND */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-wide text-white">
          ERP Panel
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          By Ronak Bhojayya
        </p>
      </div>

      {/* ✅ NAVIGATION */}
      <nav className="space-y-2 flex-1">
        <Item to="/dashboard" icon={HomeIcon} label="Dashboard" />
        <Item to="/customers" icon={UsersIcon} label="Customer Master" />
        <Item to="/vendors" icon={BuildingOfficeIcon} label="Vendor Master" />
        <Item to="/projects" icon={CubeIcon} label="Project Master" />
      </nav>

      {/* ✅ FOOTER */}
      <div className="text-xs text-gray-500 mt-auto pt-6 border-t border-gray-800">
        © {new Date().getFullYear()} ERP System
      </div>
    </aside>
  );
}
