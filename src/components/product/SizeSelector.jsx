import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProductSizes, isSizeAvailable } from './productOptionUtils.js';

function SizeSelector({ product, selectedSize, selectedColour = '', onChange }) {
  return (
    <fieldset>
      <div className="flex items-center justify-between gap-4">
        <legend className="text-sm font-semibold text-amorah-black">Size</legend>
        <Link
          to="/size-guide"
          className="amorah-focus text-xs font-semibold uppercase tracking-[0.14em] text-amorah-brown hover:text-amorah-black"
        >
          Size Guide
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {getProductSizes(product).map((size) => {
          const available = isSizeAvailable(product, size, selectedColour);
          const selected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              className={`amorah-focus min-h-11 border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                selected
                  ? 'border-amorah-black bg-amorah-black text-amorah-white'
                  : 'border-amorah-border bg-amorah-white text-amorah-brown hover:text-amorah-black'
              }`}
              aria-pressed={selected}
              disabled={!available}
              onClick={() => onChange(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

SizeSelector.propTypes = {
  product: PropTypes.object.isRequired,
  selectedSize: PropTypes.string,
  selectedColour: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SizeSelector;
