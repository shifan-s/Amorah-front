import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAdminAuth from '../hooks/useAdminAuth.js';

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, signIn, status } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid admin email.';
    if (!form.password) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (saving || !validate()) return;

    setSaving(true);
    try {
      await signIn(form);
      toast.success('Admin login successful');
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      if (error.status === 403) {
        toast.error('You do not have administrator access.');
        navigate('/', { replace: true });
        return;
      }
      toast.error(error.message || 'Unable to login as admin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF6EE] px-4 py-10 font-body text-[#302925]">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <div className="w-full border border-[#DED2C5] bg-[#FFFDF8] p-6 sm:p-8">
          <Link to="/" className="text-xs font-semibold uppercase tracking-[0.22em] text-[#672F3B]">
            Amorah
          </Link>
          <h1 className="mt-4 font-heading text-4xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm leading-6 text-[#6F6259]">Restricted access for Amorah administrators.</p>
          {status === 'forbidden' ? (
            <p className="mt-4 border border-[#B9684B]/30 bg-[#B9684B]/10 p-3 text-sm text-[#672F3B]">
              Customer accounts cannot access the admin panel.
            </p>
          ) : null}
          <form className="mt-7 space-y-5" onSubmit={submit}>
            <div>
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                autoComplete="email"
              />
              {errors.email ? <p className="mt-2 text-sm text-amorah-error">{errors.email}</p> : null}
            </div>
            <div>
              <label htmlFor="admin-password">Password</label>
              <div className="flex gap-2">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="grid h-11 w-11 shrink-0 place-items-center border border-[#DED2C5] bg-white text-[#302925] outline-none focus-visible:ring-2 focus-visible:ring-[#672F3B]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                </button>
              </div>
              {errors.password ? <p className="mt-2 text-sm text-amorah-error">{errors.password}</p> : null}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="min-h-11 w-full bg-[#672F3B] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#302925] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#672F3B] focus-visible:ring-offset-2"
            >
              {saving ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default AdminLoginPage;
