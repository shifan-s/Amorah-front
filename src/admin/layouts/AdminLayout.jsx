import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminHeader from '../components/AdminHeader.jsx';
import AdminMobileMenu from '../components/AdminMobileMenu.jsx';
import AdminSidebar from '../components/AdminSidebar.jsx';
import useAdminAuth from '../hooks/useAdminAuth.js';

function AdminLayout() {
  const navigate = useNavigate();
  const { signOut, user } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    try {
      await signOut();
      toast.success('Logged out');
    } catch {
      toast.error('The server could not confirm logout. Your local session was cleared.');
    } finally {
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] font-body text-[#302925]">
      <div className="flex min-h-screen">
        <AdminSidebar onLogout={logout} />
        <div className="min-w-0 flex-1">
          <AdminHeader user={user} onMenu={() => setMenuOpen(true)} />
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <AdminMobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={logout} />
    </div>
  );
}

export default AdminLayout;
