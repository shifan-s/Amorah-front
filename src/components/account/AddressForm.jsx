import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button.jsx';

const initialForm = {
  fullName: '',
  mobile: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  city: '',
  state: '',
  postalCode: '',
  addressType: 'Home',
  isDefault: false,
};

function AddressForm({ address, onCancel, onSubmit, status }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address) {
      setForm({
        fullName: address.fullName || '',
        mobile: address.mobile || '',
        addressLine1: address.addressLine1 || '',
        addressLine2: address.addressLine2 || '',
        landmark: address.landmark || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        addressType: address.addressType || 'Home',
        isDefault: Boolean(address.isDefault),
      });
      return;
    }

    setForm(initialForm);
  }, [address]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const nextErrors = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = 'Full name is required.';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) nextErrors.mobile = 'Enter a valid Indian mobile number.';
    if (!form.addressLine1.trim()) nextErrors.addressLine1 = 'Address line 1 is required.';
    if (!form.city.trim()) nextErrors.city = 'City is required.';
    if (!form.state.trim()) nextErrors.state = 'State is required.';
    if (!/^\d{6}$/.test(form.postalCode)) nextErrors.postalCode = 'Postal code must be six digits.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, country: 'India' });
  };

  return (
    <form className="grid gap-4 border border-amorah-border bg-amorah-white p-5 sm:grid-cols-2" onSubmit={submit}>
      {[
        ['fullName', 'Full name'],
        ['mobile', 'Indian mobile number'],
        ['addressLine1', 'Address line 1'],
        ['addressLine2', 'Address line 2'],
        ['landmark', 'Landmark'],
        ['city', 'City'],
        ['state', 'State'],
        ['postalCode', 'Postal code'],
      ].map(([field, label]) => (
        <div key={field} className={field === 'addressLine1' ? 'sm:col-span-2' : ''}>
          <label htmlFor={`address-${field}`}>{label}</label>
          <input
            id={`address-${field}`}
            value={form[field]}
            inputMode={field === 'mobile' || field === 'postalCode' ? 'numeric' : undefined}
            onChange={(event) =>
              updateField(
                field,
                field === 'mobile'
                  ? event.target.value.replace(/\D/g, '').slice(0, 10)
                  : field === 'postalCode'
                    ? event.target.value.replace(/\D/g, '').slice(0, 6)
                    : event.target.value,
              )
            }
          />
          {errors[field] ? <p className="mt-2 text-sm text-amorah-error">{errors[field]}</p> : null}
        </div>
      ))}
      <div>
        <label htmlFor="address-type">Address type</label>
        <select id="address-type" value={form.addressType} onChange={(event) => updateField('addressType', event.target.value)}>
          <option>Home</option>
          <option>Work</option>
          <option>Other</option>
        </select>
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold text-amorah-black">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(event) => updateField('isDefault', event.target.checked)}
        />
        Use as default address
      </label>
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <Button type="submit" disabled={status === 'saving'}>{status === 'saving' ? 'Saving...' : address ? 'Update Address' : 'Save Address'}</Button>
        {address ? (
          <button type="button" className="amorah-focus text-sm font-semibold text-amorah-brown" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

AddressForm.propTypes = {
  address: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  status: PropTypes.string,
};

AddressForm.defaultProps = {
  address: null,
  onCancel: () => {},
  status: 'idle',
};

export default AddressForm;

