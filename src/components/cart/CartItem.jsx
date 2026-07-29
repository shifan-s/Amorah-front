import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton.jsx';
import QuantitySelector from '../product/QuantitySelector.jsx';
import { handleProductImageError } from '../product/productOptionUtils.js';
import { formatINR } from '../../utils/currency.js';

function CartItem({ item, maxStock, onQuantityChange, onRemove, compact = false, updating = false }) {
  const unitPrice = item.unitPrice ?? item.currentPrice ?? item.salePrice ?? item.regularPrice;
  const available = item.available !== false;

  return (
    <article className={`grid gap-4 border-b border-amorah-border py-4 ${compact ? 'grid-cols-[84px_1fr]' : 'grid-cols-[96px_1fr] sm:grid-cols-[120px_1fr]'}`}>
      <Link to={`/product/${item.slug}`} className="amorah-focus block bg-amorah-light">
        <img src={item.image} alt={item.imageAlt || item.name} className="aspect-[3/4] h-full w-full object-cover" loading="lazy" onError={handleProductImageError} />
      </Link>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/product/${item.slug}`} className="amorah-focus font-heading text-xl font-semibold text-amorah-black hover:text-amorah-brown">
              {item.name}
            </Link>
            <div className="mt-1 space-y-0.5 text-sm text-amorah-brown">
              {item.colourName || item.selectedColour ? <p>Colour: {item.colourName || item.selectedColour}</p> : null}
              {item.size || item.selectedSize ? <p>Size: {item.size || item.selectedSize}</p> : null}
            </div>
            {item.sku ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-amorah-brown">SKU {item.sku}</p> : null}
            {!available ? (
              <p className="mt-2 text-sm font-semibold text-amorah-error">
                {item.unavailableReason || 'This item is no longer available.'}
              </p>
            ) : null}
          </div>
          <IconButton label={`Remove ${item.name}`} variant="ghost" size="sm" onClick={onRemove}>
            <FiTrash2 aria-hidden="true" />
          </IconButton>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-amorah-black">{formatINR(unitPrice)}</p>
            {item.regularPrice > unitPrice ? (
              <p className="text-sm text-amorah-brown line-through">{formatINR(item.regularPrice)}</p>
            ) : null}
            <p className="text-xs text-amorah-brown">Line total {formatINR((available ? unitPrice : 0) * item.quantity)}</p>
          </div>
          <QuantitySelector
            quantity={item.quantity}
            max={maxStock}
            onChange={onQuantityChange}
            disabled={updating || !available}
            removeAtZero
          />
        </div>

      </div>
    </article>
  );
}

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  maxStock: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  compact: PropTypes.bool,
  updating: PropTypes.bool,
};

export default CartItem;
