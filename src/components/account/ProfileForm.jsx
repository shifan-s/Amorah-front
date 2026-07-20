import { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import Button from '../common/Button.jsx';
import { setAuthUser } from '../../store/slices/authSlice.js';
import { updateCustomerProfile } from '../../services/authService.js';

function ProfileForm({ user }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    mobile: user.mobile || '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) nextErrors.mobile = 'Enter a valid Indian mobile number.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus('saving');

    try {
      const updatedUser = await updateCustomerProfile({
        fullName: form.fullName,
        mobile: form.mobile,
      });
      dispatch(setAuthUser(updatedUser));
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Unable to update profile');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <form className="grid gap-5 border border-amorah-border bg-amorah-white p-5 sm:grid-cols-2" onSubmit={submit}>
      <div>
        <label htmlFor="profile-name">Full name</label>
        <input id="profile-name" value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
        {errors.fullName ? <p className="mt-2 text-sm text-amorah-error">{errors.fullName}</p> : null}
      </div>
      <div>
        <label htmlFor="profile-email">Email</label>
        <input id="profile-email" type="email" value={form.email} readOnly className="bg-amorah-light text-amorah-brown" />
        <p className="mt-2 text-xs text-amorah-brown">Email changes require Amorah support.</p>
      </div>
      <div>
        <label htmlFor="profile-mobile">Indian mobile number</label>
        <input id="profile-mobile" inputMode="numeric" value={form.mobile} onChange={(event) => updateField('mobile', event.target.value.replace(/\D/g, '').slice(0, 10))} />
        {errors.mobile ? <p className="mt-2 text-sm text-amorah-error">{errors.mobile}</p> : null}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={status === 'saving'}>{status === 'saving' ? 'Saving...' : 'Save Profile'}</Button>
      </div>
    </form>
  );
}

ProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileForm;
