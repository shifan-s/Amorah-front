import PropTypes from 'prop-types';
import { formatINR } from '../../utils/currency.js';

function PriceRangeFilter({ min, max, maxPrice, onChange }) {
  return (
    <fieldset>
      <legend className="font-heading text-lg font-semibold text-amorah-black">Price</legend>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="filter-min-price">Min</label>
          <input
            id="filter-min-price"
            type="number"
            min="0"
            max={maxPrice}
            value={min}
            onChange={(event) => onChange({ min: Number(event.target.value), max })}
          />
        </div>
        <div>
          <label htmlFor="filter-max-price">Max</label>
          <input
            id="filter-max-price"
            type="number"
            min="0"
            max={maxPrice}
            value={max}
            onChange={(event) => onChange({ min, max: Number(event.target.value) })}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-amorah-brown">
        Showing {formatINR(min)} to {formatINR(max)}
      </p>
    </fieldset>
  );
}

PriceRangeFilter.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PriceRangeFilter;
