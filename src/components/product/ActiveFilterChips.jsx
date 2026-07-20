import PropTypes from 'prop-types';
import { IoClose } from 'react-icons/io5';
import { formatINR } from '../../utils/currency.js';
import { titleFromSlug } from '../../utils/productFilters.js';

function ActiveFilterChips({ filters, query, onRemove, onClear }) {
  const chips = [];

  if (query) {
    chips.push({ key: 'q', label: `Search: ${query}` });
  }

  if (filters.mainCategory) chips.push({ key: 'mainCategory', label: `Category: ${titleFromSlug(filters.mainCategory)}` });
  if (filters.subcategory) chips.push({ key: 'subcategory', label: `Subcategory: ${titleFromSlug(filters.subcategory)}` });
  if (filters.productType) chips.push({ key: 'productType', label: `Type: ${titleFromSlug(filters.productType)}` });
  if (filters.style) chips.push({ key: 'style', label: `Style: ${titleFromSlug(filters.style)}` });
  if (filters.fabric) chips.push({ key: 'fabric', label: `Fabric: ${titleFromSlug(filters.fabric)}` });
  if (filters.occasion) chips.push({ key: 'occasion', label: `Occasion: ${titleFromSlug(filters.occasion)}` });

  filters.sizes.forEach((size) => chips.push({ key: `size:${size}`, label: `Size ${size}` }));
  filters.colours.forEach((colour) => chips.push({ key: `colour:${colour}`, label: titleFromSlug(colour) }));

  if (filters.min > 0 || filters.max < 10000) {
    chips.push({ key: 'price', label: `${formatINR(filters.min)} - ${formatINR(filters.max)}` });
  }

  if (filters.availability) chips.push({ key: 'availability', label: 'In stock' });
  if (filters.newArrival) chips.push({ key: 'newArrival', label: 'New arrivals' });
  if (filters.bestSeller) chips.push({ key: 'bestSeller', label: 'Best sellers' });
  if (filters.sale) chips.push({ key: 'sale', label: 'Sale' });

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="amorah-focus inline-flex items-center gap-2 border border-amorah-border bg-amorah-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-amorah-brown hover:text-amorah-black"
          onClick={() => onRemove(chip.key)}
        >
          {chip.label}
          <IoClose aria-hidden="true" />
        </button>
      ))}
      <button
        type="button"
        className="amorah-focus px-2 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-amorah-brown hover:text-amorah-black"
        onClick={onClear}
      >
        Clear all
      </button>
    </div>
  );
}

ActiveFilterChips.propTypes = {
  filters: PropTypes.object.isRequired,
  query: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default ActiveFilterChips;
