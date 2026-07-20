import PropTypes from 'prop-types';
import Button from '../common/Button.jsx';
import ColourFilter from './ColourFilter.jsx';
import PriceRangeFilter from './PriceRangeFilter.jsx';
import SizeFilter from './SizeFilter.jsx';
import { slugify } from '../../utils/productFilters.js';

function OptionGroup({ title, values, selectedValue, onChange }) {
  return (
    <section>
      <h3 className="font-heading text-lg font-semibold text-amorah-black">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => {
          const optionValue = slugify(value);
          const selected = selectedValue === optionValue;

          return (
            <button
              key={value}
              type="button"
              className={`amorah-focus min-h-10 border px-3 text-sm font-semibold transition ${
                selected
                  ? 'border-amorah-maroon bg-amorah-maroon text-amorah-white'
                  : 'border-amorah-border bg-amorah-white text-amorah-brown hover:text-amorah-black'
              }`}
              aria-pressed={selected}
              onClick={() => onChange(selected ? '' : optionValue)}
            >
              {value}
            </button>
          );
        })}
      </div>
    </section>
  );
}

OptionGroup.propTypes = {
  title: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function CategoryOptionGroup({ title, categories, selectedValue, onChange }) {
  if (!categories.length) {
    return null;
  }

  return (
    <section>
      <h3 className="font-heading text-lg font-semibold text-amorah-black">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((category) => {
          const selected = selectedValue === category.slug;

          return (
            <button
              key={category.id || category.slug}
              type="button"
              className={`amorah-focus min-h-10 border px-3 text-sm font-semibold transition ${
                selected
                  ? 'border-amorah-maroon bg-amorah-maroon text-amorah-white'
                  : 'border-amorah-border bg-amorah-white text-amorah-brown hover:text-amorah-black'
              }`}
              aria-pressed={selected}
              onClick={() => onChange(selected ? '' : category.slug)}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

CategoryOptionGroup.propTypes = {
  title: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

function ProductFilters({
  filters,
  options,
  onOptionChange,
  onSizeToggle,
  onColourToggle,
  onPriceChange,
  onAvailabilityToggle,
  onClear,
}) {
  return (
    <aside className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold text-amorah-black">Filters</h2>
        <button
          type="button"
          className="amorah-focus text-xs font-semibold uppercase tracking-[0.14em] text-amorah-brown hover:text-amorah-black"
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      <CategoryOptionGroup
        title="Category"
        categories={options.mainCategories || []}
        selectedValue={filters.mainCategory}
        onChange={(value) => onOptionChange('mainCategory', value)}
      />
      <CategoryOptionGroup
        title="Subcategory"
        categories={(options.subcategories || []).filter(
          (category) => !filters.mainCategory || !category.parent || category.parent?.slug === filters.mainCategory,
        )}
        selectedValue={filters.subcategory}
        onChange={(value) => onOptionChange('subcategory', value)}
      />
      <OptionGroup title="Product Type" values={options.productTypes} selectedValue={filters.productType} onChange={(value) => onOptionChange('productType', value)} />
      <OptionGroup title="Style" values={options.styles} selectedValue={filters.style} onChange={(value) => onOptionChange('style', value)} />
      <OptionGroup title="Fabric" values={options.fabrics} selectedValue={filters.fabric} onChange={(value) => onOptionChange('fabric', value)} />
      <OptionGroup title="Occasion" values={options.occasions} selectedValue={filters.occasion} onChange={(value) => onOptionChange('occasion', value)} />

      <SizeFilter sizes={options.sizes} selectedSizes={filters.sizes} onToggle={onSizeToggle} />
      <ColourFilter colours={options.colours} selectedColours={filters.colours} onToggle={onColourToggle} />
      <PriceRangeFilter min={filters.min} max={filters.max} maxPrice={options.maxPrice} onChange={onPriceChange} />

      <label className="flex cursor-pointer items-center gap-3 text-sm text-amorah-brown">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={filters.availability}
          onChange={onAvailabilityToggle}
        />
        In stock only
      </label>

      <Button variant="outline" className="w-full" onClick={onClear}>
        Clear Filters
      </Button>
    </aside>
  );
}

ProductFilters.propTypes = {
  filters: PropTypes.shape({
    productType: PropTypes.string.isRequired,
    mainCategory: PropTypes.string,
    subcategory: PropTypes.string,
    style: PropTypes.string.isRequired,
    fabric: PropTypes.string.isRequired,
    occasion: PropTypes.string.isRequired,
    sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
    colours: PropTypes.arrayOf(PropTypes.string).isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    availability: PropTypes.bool.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    productTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    styles: PropTypes.arrayOf(PropTypes.string).isRequired,
    fabrics: PropTypes.arrayOf(PropTypes.string).isRequired,
    occasions: PropTypes.arrayOf(PropTypes.string).isRequired,
    sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
    colours: PropTypes.arrayOf(PropTypes.string).isRequired,
    maxPrice: PropTypes.number.isRequired,
    mainCategories: PropTypes.arrayOf(PropTypes.object),
    subcategories: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onOptionChange: PropTypes.func.isRequired,
  onSizeToggle: PropTypes.func.isRequired,
  onColourToggle: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onAvailabilityToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default ProductFilters;
