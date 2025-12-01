import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import CustomerList from "./pages/CustomerList";
import CustomerForm from "./pages/CustomerForm";
import VendorList from "./pages/VendorList";
import VendorForm from "./pages/VendorForm";

// Import react-toastify for global notifications
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/edit/:id" element={<CustomerForm />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendors/new" element={<VendorForm />} />
            <Route path="/vendors/edit/:id" element={<VendorForm />} />
          </Routes>
        </main>
      </div>

      {/* Global ToastContainer for notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
}
