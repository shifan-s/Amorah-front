import PropTypes from 'prop-types';

function ContactInformationForm({ value, errors, onChange }) {
  return (
    <section className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Step 1</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-amorah-black">Contact information</h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-amorah-black">Full name</span>
          <input
            className="mt-2"
            type="text"
            autoComplete="name"
            value={value.fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
            aria-invalid={errors.fullName ? 'true' : 'false'}
            aria-describedby={errors.fullName ? 'checkout-full-name-error' : undefined}
          />
          {errors.fullName ? (
            <span id="checkout-full-name-error" className="mt-1 block text-sm text-amorah-error">
              {errors.fullName}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-amorah-black">Email</span>
          <input
            className="mt-2"
            type="email"
            autoComplete="email"
            value={value.email}
            onChange={(event) => onChange('email', event.target.value)}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'checkout-email-error' : undefined}
          />
          {errors.email ? (
            <span id="checkout-email-error" className="mt-1 block text-sm text-amorah-error">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-amorah-black">Mobile number</span>
          <input
            className="mt-2"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={value.mobile}
            onChange={(event) => onChange('mobile', event.target.value)}
            aria-invalid={errors.mobile ? 'true' : 'false'}
            aria-describedby={errors.mobile ? 'checkout-mobile-error' : undefined}
          />
          {errors.mobile ? (
            <span id="checkout-mobile-error" className="mt-1 block text-sm text-amorah-error">
              {errors.mobile}
            </span>
          ) : null}
        </label>
      </div>
    </section>
  );
}

ContactInformationForm.propTypes = {
  value: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ContactInformationForm;
