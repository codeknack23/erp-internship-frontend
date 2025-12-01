import { NavLink } from "react-router-dom";
import { UsersIcon, BuildingOfficeIcon, HomeIcon } from "@heroicons/react/24/solid";

export default function Sidebar() {
  const Item = ({ to, icon: Icon, label }) => (
    <NavLink to={to} className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-md ${isActive ? 'bg-accent text-white' : 'text-gray-200 hover:bg-gray-800'}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <div className="text-xl font-bold">ERP</div>
        <div className="text-sm text-gray-300 mt-1">By Ronak Bhojayya</div>
      </div>

      <nav className="space-y-2">
        <Item to="/dashboard" icon={HomeIcon} label="Dashboard" />
        <Item to="/customers" icon={UsersIcon} label="Customer Master" />
        <Item to="/vendors" icon={BuildingOfficeIcon} label="Vendor Master" />
      </nav>
    </aside>
  );
}
