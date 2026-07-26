import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import IconButton from '../components/common/IconButton.jsx';
import Seo from '../components/common/Seo.jsx';
import { loginCustomer } from '../services/authService.js';
import { setAuthUser } from '../store/slices/authSlice.js';
import { mergeGuestCart } from '../store/slices/cartSlice.js';
import { getSafeReturnUrl } from '../utils/authRedirect.js';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const loginMessage = location.state?.message || '';

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email.';
    if (!form.password) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const user = await loginCustomer(form);
      dispatch(setAuthUser({ ...user, rememberMe }));

      try {
        const result = await dispatch(mergeGuestCart()).unwrap();
        result.warnings?.forEach((warning) => toast(warning.message));
      } catch {
        toast.error('Logged in, but guest cart merge failed. Your local cart is preserved.');
      }

      toast.success('Logged in');
      const queryReturnUrl = new URLSearchParams(location.search).get('redirect');
      const returnUrl = getSafeReturnUrl(location.state?.from || queryReturnUrl, '/');
      navigate(returnUrl, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Unable to login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Login | Amorah "
        description="Login to your Amorah account to view orders, profile details, saved addresses and wishlist pieces."
        path="/login"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Login', path: '/login' },
        ]}
      />
      <main className="bg-amorah-ivory py-12">
        <Container size="sm">
          <section className="border border-amorah-border bg-amorah-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Welcome back</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-amorah-black">Login</h1>
            {loginMessage ? (
              <p className="mt-5 border border-amorah-rose bg-amorah-light px-4 py-3 text-sm font-semibold text-amorah-maroon">
                {loginMessage}
              </p>
            ) : null}
            <form className="mt-8 space-y-5" onSubmit={submit}>
              <div>
                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
                {errors.email ? <p className="mt-2 text-sm text-amorah-error">{errors.email}</p> : null}
              </div>
              <div>
                <label htmlFor="login-password">Password</label>
                <div className="flex gap-2">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => updateField('password', event.target.value)}
                  />
                  <IconButton label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                  </IconButton>
                </div>
                {errors.password ? <p className="mt-2 text-sm text-amorah-error">{errors.password}</p> : null}
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="mb-0 flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                  Remember me
                </label>
                <Link className="amorah-focus text-sm font-semibold text-amorah-brown hover:text-amorah-black" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-amorah-brown">
              New to Amorah?{' '}
              <Link
                className="amorah-focus font-semibold text-amorah-black"
                to="/signup"
                state={location.state}
              >
                Create an account
              </Link>
            </p>
          </section>
        </Container>
      </main>
    </>
  );
}

export default LoginPage;
