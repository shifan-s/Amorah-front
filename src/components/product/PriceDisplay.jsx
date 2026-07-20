import PropTypes from 'prop-types';
import { formatINR } from '../../utils/currency.js';

function PriceDisplay({ regularPrice, salePrice, currentPrice, discountPercentage, size = 'md' }) {
  const displayPrice = currentPrice ?? salePrice ?? regularPrice;
  const isOnSale = salePrice !== null && salePrice !== undefined && salePrice < regularPrice;
  const priceSize = size === 'lg' ? 'text-3xl' : 'text-xl';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={`font-semibold text-amorah-black ${priceSize}`}>{formatINR(displayPrice)}</span>
      {isOnSale ? (
        <>
          <span className="text-base text-amorah-brown line-through">{formatINR(regularPrice)}</span>
          <span className="border border-amorah-error/20 bg-amorah-error/10 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amorah-error">
            {discountPercentage}% off
          </span>
        </>
      ) : null}
    </div>
  );
}

PriceDisplay.propTypes = {
  regularPrice: PropTypes.number.isRequired,
  salePrice: PropTypes.number,
  currentPrice: PropTypes.number,
  discountPercentage: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['md', 'lg']),
};

export default PriceDisplay;
