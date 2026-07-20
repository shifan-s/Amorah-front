import PropTypes from 'prop-types';

const sortOptions = [
  ['recommended', 'Recommended'],
  ['newest', 'Newest'],
  ['best-selling', 'Best Selling'],
  ['price-low-high', 'Price: Low to High'],
  ['price-high-low', 'Price: High to Low'],
  ['highest-discount', 'Highest Discount'],
];

function ProductFilters({ filters, categories, onChange }) {
  const mainCategories = categories.filter((category) => category.level === 0);
  const subcategories = categories.filter((category) => category.level === 1 && (!filters.mainCategory || category.parent?.id === filters.mainCategory));

  return (
    <div className="grid gap-4 border border-[#DED2C5] bg-[#FFFDF8] p-4 md:grid-cols-2 xl:grid-cols-6">
      <div className="xl:col-span-2">
        <label htmlFor="product-search">Search</label>
        <input id="product-search" value={filters.search} onChange={(event) => onChange('search', event.target.value)} />
      </div>
      <div>
        <label htmlFor="product-main-filter">Main Category</label>
        <select id="product-main-filter" value={filters.mainCategory} onChange={(event) => onChange('mainCategory', event.target.value)}>
          <option value="">All</option>
          {mainCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="product-sub-filter">Subcategory</label>
        <select id="product-sub-filter" value={filters.subcategory} onChange={(event) => onChange('subcategory', event.target.value)} disabled={!filters.mainCategory}>
          <option value="">All</option>
          {subcategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="product-status-filter">Status</label>
        <select id="product-status-filter" value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <label htmlFor="product-stock-filter">Stock</label>
        <select id="product-stock-filter" value={filters.stockStatus} onChange={(event) => onChange('stockStatus', event.target.value)}>
          <option value="">All</option>
          <option value="in-stock">In stock</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
      </div>
      <div>
        <label htmlFor="product-type-filter">Product Type</label>
        <input id="product-type-filter" value={filters.productType} onChange={(event) => onChange('productType', event.target.value)} />
      </div>
      <div>
        <label htmlFor="style-filter">Style</label>
        <input id="style-filter" value={filters.style} onChange={(event) => onChange('style', event.target.value)} />
      </div>
      <div>
        <label htmlFor="fabric-filter">Fabric</label>
        <input id="fabric-filter" value={filters.fabric} onChange={(event) => onChange('fabric', event.target.value)} />
      </div>
      <div>
        <label htmlFor="featured-filter">Featured</label>
        <select id="featured-filter" value={filters.featured} onChange={(event) => onChange('featured', event.target.value)}>
          <option value="">All</option>
          <option value="true">Featured</option>
          <option value="false">Not featured</option>
        </select>
      </div>
      <div>
        <label htmlFor="new-filter">New Arrival</label>
        <select id="new-filter" value={filters.newArrival} onChange={(event) => onChange('newArrival', event.target.value)}>
          <option value="">All</option>
          <option value="true">New</option>
          <option value="false">Not new</option>
        </select>
      </div>
      <div>
        <label htmlFor="best-filter">Best Seller</label>
        <select id="best-filter" value={filters.bestSeller} onChange={(event) => onChange('bestSeller', event.target.value)}>
          <option value="">All</option>
          <option value="true">Best seller</option>
          <option value="false">Not best seller</option>
        </select>
      </div>
      <div>
        <label htmlFor="sort-filter">Sort</label>
        <select id="sort-filter" value={filters.sort} onChange={(event) => onChange('sort', event.target.value)}>
          {sortOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

ProductFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ProductFilters;
