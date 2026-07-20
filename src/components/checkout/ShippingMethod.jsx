import PropTypes from 'prop-types';
import { formatINR } from '../../utils/currency.js';

function ShippingMethod({ value, shippingFee, onChange }) {
  return (
    <section className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Step 4</p>
      <h2 className="mt-2 font-heading text-2xl font-semibold text-amorah-black">Shipping method</h2>

      <div className="mt-5 grid gap-3">
        <label className="flex cursor-pointer items-start justify-between gap-4 border border-amorah-border p-4 transition hover:border-amorah-black focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-amorah-black">
          <span className="flex gap-3">
            <input
              className="mt-1 h-4 w-4 accent-amorah-black"
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={value === 'standard'}
              onChange={(event) => onChange(event.target.value)}
            />
            <span>
              <span className="block font-semibold text-amorah-black">Standard delivery</span>
              <span className="mt-1 block text-sm leading-6 text-amorah-brown">
                Delivery in 4 to 6 business days across India.
              </span>
            </span>
          </span>
          <span className="font-semibold text-amorah-black">{shippingFee === 0 ? 'Free' : formatINR(shippingFee)}</span>
        </label>
      </div>
    </section>
  );
}

ShippingMethod.propTypes = {
  value: PropTypes.string.isRequired,
  shippingFee: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ShippingMethod;
