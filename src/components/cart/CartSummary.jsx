import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../common/Button.jsx';
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

function CartSummary({ totals, checkoutLabel = 'Checkout', showViewCart = false, onCheckout }) {
  const shipping = totals.shipping ?? totals.shippingCharge ?? 0;
  return (
    <section className="border border-amorah-border bg-amorah-white p-5">
      <h2 className="font-heading text-3xl font-semibold text-amorah-maroon">Order summary</h2>
      <div className="mt-5 space-y-3">
        <SummaryRow label="Subtotal" value={formatINR(totals.subtotal)} />
        <SummaryRow label="Shipping" value={shipping === 0 ? 'Free' : formatINR(shipping)} />
        {totals.tax > 0 ? <SummaryRow label="Tax" value={formatINR(totals.tax)} /> : null}
        <div className="border-t border-amorah-border pt-3">
          <SummaryRow label="Total" value={formatINR(totals.total)} strong />
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {showViewCart ? (
          <Link
            to="/cart"
            className="amorah-focus inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-maroon transition hover:bg-amorah-maroon hover:text-amorah-white"
          >
            View Cart
          </Link>
        ) : null}
        <Button onClick={onCheckout} className="w-full">
          {checkoutLabel}
        </Button>
      </div>
    </section>
  );
}

CartSummary.propTypes = {
  totals: PropTypes.shape({
    subtotal: PropTypes.number.isRequired,
    shipping: PropTypes.number,
    shippingCharge: PropTypes.number,
    tax: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  checkoutLabel: PropTypes.string,
  showViewCart: PropTypes.bool,
  onCheckout: PropTypes.func.isRequired,
};

export default CartSummary;
