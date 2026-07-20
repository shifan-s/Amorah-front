import { Link } from 'react-router-dom';
import useAdminAuth from '../hooks/useAdminAuth.js';

function AdminForbiddenPage() {
  const { signOut } = useAdminAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF6EE] px-4 py-10 font-body">
      <section className="w-full max-w-lg border border-[#DED2C5] bg-[#FFFDF8] p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#672F3B]">Access restricted</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-[#302925]">Admin access only</h1>
        <p className="mt-3 text-sm leading-6 text-[#6F6259]">
          Customer accounts cannot access the Amorah admin panel. Please login with an administrator account.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/admin/login"
            onClick={() => signOut()}
            className="inline-flex min-h-11 items-center justify-center bg-[#672F3B] px-5 text-sm font-semibold text-white outline-none hover:bg-[#302925] focus-visible:ring-2 focus-visible:ring-[#672F3B] focus-visible:ring-offset-2"
          >
            Admin Login
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center border border-[#DED2C5] px-5 text-sm font-semibold text-[#302925] outline-none hover:bg-[#F3ECE3] focus-visible:ring-2 focus-visible:ring-[#672F3B]"
          >
            View Store
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminForbiddenPage;
