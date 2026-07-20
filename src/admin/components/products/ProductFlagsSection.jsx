import PropTypes from 'prop-types';

function ProductFlagsSection({ form, updateField, productStock = 0, showMarketingFlags = true }) {
  return (
    <section className="grid gap-5 border border-[#DED2C5] bg-[#FFFDF8] p-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="text-xl font-semibold text-[#302925]">{showMarketingFlags ? 'Visibility and Status' : 'Stock and Availability'}</h2>
        <p className="mt-1 text-sm text-[#6F6259]">
          {showMarketingFlags ? 'Publishing still goes through backend validation.' : 'Stock is entered for each product colour and size below.'}
        </p>
      </div>
      {showMarketingFlags ? (
        <>
          <label className="mb-0 flex items-center gap-3">
            <input type="checkbox" checked={form.featured} onChange={(event) => updateField('featured', event.target.checked)} />
            Featured
          </label>
          <label className="mb-0 flex items-center gap-3">
            <input type="checkbox" checked={form.newArrival} onChange={(event) => updateField('newArrival', event.target.checked)} />
            New Arrival
          </label>
          <label className="mb-0 flex items-center gap-3">
            <input type="checkbox" checked={form.bestSeller} onChange={(event) => updateField('bestSeller', event.target.checked)} />
            Best Seller
          </label>
        </>
      ) : (
        <div>
          <label htmlFor="product-total-stock">Stock Quantity</label>
          <input id="product-total-stock" value={productStock} readOnly />
          <p className="mt-2 text-xs text-[#6F6259]">Enter the number of items currently available in the Product Colours section.</p>
        </div>
      )}
      <div>
        <label htmlFor="product-status">Product Status <span className="text-[#672F3B]" aria-hidden="true">*</span></label>
        <select id="product-status" value={form.status} onChange={(event) => updateField('status', event.target.value)}>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <p className="mt-2 text-xs text-[#6F6259]">Active products appear publicly. Draft products stay hidden from customers.</p>
      </div>
    </section>
  );
}

ProductFlagsSection.propTypes = {
  form: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired,
  productStock: PropTypes.number,
  showMarketingFlags: PropTypes.bool,
};

export default ProductFlagsSection;
