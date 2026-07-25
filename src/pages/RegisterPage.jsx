import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';
import { registerCustomer } from '../services/authService.js';
import { setAuthUser } from '../store/slices/authSlice.js';
import { mergeGuestCart } from '../store/slices/cartSlice.js';
import { getSafeReturnUrl } from '../utils/authRedirect.js';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email.';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) nextErrors.mobile = 'Enter a valid Indian mobile number.';
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords must match.';
    if (!form.terms) nextErrors.terms = 'Accept the terms to continue.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const user = await registerCustomer({
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });
      dispatch(setAuthUser(user));

      try {
        const result = await dispatch(mergeGuestCart()).unwrap();
        result.warnings?.forEach((warning) => toast(warning.message));
      } catch {
        toast.error('Account created, but guest cart merge failed. Your local cart is preserved.');
      }

      toast.success('Account created');
      const queryReturnUrl = new URLSearchParams(location.search).get('redirect');
      navigate(getSafeReturnUrl(location.state?.from || queryReturnUrl, '/'), { replace: true });
    } catch (error) {
      toast.error(error.message || 'Unable to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Register | Amorah N-ZAN Designs"
        description="Create an Amorah customer account for profile, order, address and wishlist experiences."
        path="/register"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Register', path: '/register' },
        ]}
      />
      <main className="bg-amorah-ivory py-12">
        <Container size="sm">
          <section className="border border-amorah-border bg-amorah-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Join Amorah</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-amorah-black">Create Account</h1>
            <form className="mt-8 grid gap-5" onSubmit={submit}>
              {[
                ['fullName', 'Full name', 'text'],
                ['email', 'Email', 'email'],
                ['mobile', 'Indian mobile number', 'tel'],
                ['password', 'Password', 'password'],
                ['confirmPassword', 'Confirm password', 'password'],
              ].map(([field, label, type]) => (
                <div key={field}>
                  <label htmlFor={`register-${field}`}>{label}</label>
                  <input
                    id={`register-${field}`}
                    type={type}
                    value={form[field]}
                    inputMode={field === 'mobile' ? 'numeric' : undefined}
                    onChange={(event) =>
                      updateField(field, field === 'mobile' ? event.target.value.replace(/\D/g, '').slice(0, 10) : event.target.value)
                    }
                  />
                  {errors[field] ? <p className="mt-2 text-sm text-amorah-error">{errors[field]}</p> : null}
                </div>
              ))}
              <div>
                <label className="mb-0 flex items-start gap-2">
                  <input type="checkbox" className="mt-1 h-4 w-4" checked={form.terms} onChange={(event) => updateField('terms', event.target.checked)} />
                  <span>
                    I accept the{' '}
                    <Link className="amorah-focus font-semibold text-amorah-black" to="/terms-and-conditions">
                      terms and conditions
                    </Link>
                  </span>
                </label>
                {errors.terms ? <p className="mt-2 text-sm text-amorah-error">{errors.terms}</p> : null}
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Register'}
              </Button>
            </form>
          </section>
        </Container>
      </main>
    </>
  );
}

export default RegisterPage;
