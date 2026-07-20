import PropTypes from 'prop-types';
import { formatINR } from '../../utils/currency.js';
import { FREE_SHIPPING_THRESHOLD } from './cartTotals.js';

function FreeShippingProgress({ amount }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - amount);
  const progress = Math.min(100, (amount / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="border border-amorah-border bg-amorah-white p-4">
      <p className="text-sm font-semibold text-amorah-black">
        {remaining === 0 ? 'You have unlocked free shipping.' : `${formatINR(remaining)} away from free shipping.`}
      </p>
      <div className="mt-3 h-2 bg-amorah-light" aria-hidden="true">
        <div className="h-full bg-amorah-rose" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-xs text-amorah-brown">Free shipping on orders above {formatINR(FREE_SHIPPING_THRESHOLD)}.</p>
    </div>
  );
}

FreeShippingProgress.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default FreeShippingProgress;
