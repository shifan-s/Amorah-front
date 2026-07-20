import PropTypes from 'prop-types';

function AddressForm({
  title,
  step,
  value,
  errors,
  onChange,
  disabled = false,
  sameAsShipping = false,
  onSameAsShippingChange,
}) {
  const fieldPrefix = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">{step}</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-amorah-black">{title}</h2>
        </div>
        {onSameAsShippingChange ? (
          <label className="inline-flex items-center gap-3 text-sm font-semibold text-amorah-brown focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-amorah-black">
            <input
              className="h-4 w-4 accent-amorah-black"
              type="checkbox"
              checked={sameAsShipping}
              onChange={(event) => onSameAsShippingChange(event.target.checked)}
            />
            Same as shipping
          </label>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-amorah-black">Address</span>
          <input
            className="mt-2"
            type="text"
            autoComplete="street-address"
            value={value.address}
            disabled={disabled}
            onChange={(event) => onChange('address', event.target.value)}
            aria-invalid={errors.address ? 'true' : 'false'}
            aria-describedby={errors.address ? `${fieldPrefix}-address-error` : undefined}
          />
          {errors.address ? (
            <span id={`${fieldPrefix}-address-error`} className="mt-1 block text-sm text-amorah-error">
              {errors.address}
            </span>
          ) : null}
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-amorah-black">Apartment, suite or landmark</span>
          <input
            className="mt-2"
            type="text"
            value={value.apartment}
            disabled={disabled}
            onChange={(event) => onChange('apartment', event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-amorah-black">City</span>
          <input
            className="mt-2"
            type="text"
            autoComplete="address-level2"
            value={value.city}
            disabled={disabled}
            onChange={(event) => onChange('city', event.target.value)}
            aria-invalid={errors.city ? 'true' : 'false'}
            aria-describedby={errors.city ? `${fieldPrefix}-city-error` : undefined}
          />
          {errors.city ? (
            <span id={`${fieldPrefix}-city-error`} className="mt-1 block text-sm text-amorah-error">
              {errors.city}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-amorah-black">State</span>
          <input
            className="mt-2"
            type="text"
            autoComplete="address-level1"
            value={value.state}
            disabled={disabled}
            onChange={(event) => onChange('state', event.target.value)}
            aria-invalid={errors.state ? 'true' : 'false'}
            aria-describedby={errors.state ? `${fieldPrefix}-state-error` : undefined}
          />
          {errors.state ? (
            <span id={`${fieldPrefix}-state-error`} className="mt-1 block text-sm text-amorah-error">
              {errors.state}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-amorah-black">PIN code</span>
          <input
            className="mt-2"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            value={value.pinCode}
            disabled={disabled}
            onChange={(event) => onChange('pinCode', event.target.value)}
            aria-invalid={errors.pinCode ? 'true' : 'false'}
            aria-describedby={errors.pinCode ? `${fieldPrefix}-pin-error` : undefined}
          />
          {errors.pinCode ? (
            <span id={`${fieldPrefix}-pin-error`} className="mt-1 block text-sm text-amorah-error">
              {errors.pinCode}
            </span>
          ) : null}
        </label>
      </div>
    </section>
  );
}

AddressForm.propTypes = {
  title: PropTypes.string.isRequired,
  step: PropTypes.string.isRequired,
  value: PropTypes.shape({
    address: PropTypes.string.isRequired,
    apartment: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    pinCode: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  sameAsShipping: PropTypes.bool,
  onSameAsShippingChange: PropTypes.func,
};

export default AddressForm;
