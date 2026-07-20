import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { handleProductImageError } from '../product/productOptionUtils.js';
import { formatINR } from '../../utils/currency.js';

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? 'text-lg font-semibold text-amorah-black' : 'text-sm text-amorah-brown'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

SummaryRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  strong: PropTypes.bool,
};

function CheckoutOrderSummary({ items, totals, className = '' }) {
  const shipping = totals.shipping ?? totals.shippingCharge ?? 0;

  return (
    <aside className={`border border-amorah-border bg-amorah-white p-5 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold text-amorah-black">Order summary</h2>
        <Link
          to="/cart"
          className="amorah-focus text-xs font-semibold uppercase tracking-[0.16em] text-amorah-brown hover:text-amorah-black"
        >
          Edit cart
        </Link>
      </div>

      <div className="mt-5 max-h-[420px] space-y-4 overflow-auto pr-1">
        {items.map((item) => (
          <article key={item.id} className="grid grid-cols-[72px_1fr] gap-3">
            <img
              src={item.image}
              alt={item.imageAlt || item.name}
              className="aspect-[3/4] w-full bg-amorah-light object-cover"
              loading="lazy"
              onError={handleProductImageError}
            />
            <div className="min-w-0">
              <p className="font-semibold text-amorah-black">{item.name}</p>
              <div className="mt-1 space-y-0.5 text-sm text-amorah-brown">
                {item.colourName || item.selectedColour ? <p>Colour: {item.colourName || item.selectedColour}</p> : null}
                {item.size || item.selectedSize ? <p>Size: {item.size || item.selectedSize}</p> : null}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-amorah-brown">Qty {item.quantity}</span>
                <span className="font-semibold text-amorah-black">
                  {formatINR((item.unitPrice ?? item.currentPrice ?? item.salePrice ?? item.regularPrice) * item.quantity)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-amorah-border pt-5">
        <SummaryRow label="Subtotal" value={formatINR(totals.subtotal)} />
        <SummaryRow label="Shipping" value={shipping === 0 ? 'Free' : formatINR(shipping)} />
        {totals.tax > 0 ? <SummaryRow label="Tax" value={formatINR(totals.tax)} /> : null}
        <div className="border-t border-amorah-border pt-3">
          <SummaryRow label="Total" value={formatINR(totals.total)} strong />
        </div>
      </div>
    </aside>
  );
}

CheckoutOrderSummary.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  totals: PropTypes.shape({
    subtotal: PropTypes.number.isRequired,
    shipping: PropTypes.number,
    shippingCharge: PropTypes.number,
    tax: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

export default CheckoutOrderSummary;
