import PropTypes from 'prop-types';
import { fabricOptions, occasionOptions, productTypeOptions, styleOptions } from '../../utils/productFormDefaults.js';
import { slugify } from '../../utils/productPayload.js';

function OptionList({ id, values }) {
  return (
    <datalist id={id}>
      {values.map((value) => (
        <option key={value} value={value} />
      ))}
    </datalist>
  );
}

OptionList.propTypes = {
  id: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ProductDetailsSection({ form, errors = {}, updateField, includeDiscoveryFields = false, includeMarketingFlags = false }) {
  const slugPreview = form.slug ? slugify(form.slug) : slugify(form.name);

  return (
    <section className="grid gap-5 border border-[#DED2C5] bg-[#FFFDF8] p-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold text-[#302925]">Additional Information</h2>
        <p className="mt-1 text-sm text-[#6F6259]">Use these optional details to improve product discovery and display.</p>
      </div>
      {includeDiscoveryFields ? (
        <>
          <div>
            <label htmlFor="product-slug">Product Page Link</label>
            <input id="product-slug" value={form.slug} onChange={(event) => updateField('slug', slugify(event.target.value))} placeholder={slugPreview} />
            <p className="mt-2 text-xs text-[#6F6259]">This controls the readable part of the product page URL.</p>
            {errors.slug ? <p className="mt-2 text-sm text-amorah-error">{errors.slug}</p> : null}
          </div>
          <div>
            <label htmlFor="sku-prefix">SKU Prefix</label>
            <input id="sku-prefix" value={form.skuPrefix} onChange={(event) => updateField('skuPrefix', event.target.value.toUpperCase())} />
            <p className="mt-2 text-xs text-[#6F6259]">Optional internal code used before product option SKUs.</p>
          </div>
          <div>
            <label htmlFor="product-type">Product Type</label>
            <input id="product-type" list="product-type-options" value={form.productType} onChange={(event) => updateField('productType', event.target.value)} />
            <OptionList id="product-type-options" values={productTypeOptions} />
          </div>
          <div>
            <label htmlFor="product-style">Style</label>
            <input id="product-style" list="product-style-options" value={form.style} onChange={(event) => updateField('style', event.target.value)} />
            <OptionList id="product-style-options" values={styleOptions} />
          </div>
          <div>
            <label htmlFor="product-fabric">Fabric</label>
            <input id="product-fabric" list="product-fabric-options" value={form.fabric} onChange={(event) => updateField('fabric', event.target.value)} />
            <OptionList id="product-fabric-options" values={fabricOptions} />
          </div>
          <div>
            <label htmlFor="product-occasion">Occasion</label>
            <input id="product-occasion" list="product-occasion-options" value={form.occasion} onChange={(event) => updateField('occasion', event.target.value)} />
            <OptionList id="product-occasion-options" values={occasionOptions} />
          </div>
        </>
      ) : null}
      <div>
        <label htmlFor="fabric-details">Fabric Details</label>
        <textarea id="fabric-details" rows="3" value={form.fabricDetails} onChange={(event) => updateField('fabricDetails', event.target.value)} />
      </div>
      <div>
        <label htmlFor="fit">Fit</label>
        <textarea id="fit" rows="3" value={form.fit} onChange={(event) => updateField('fit', event.target.value)} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="care">Care Instructions</label>
        <textarea id="care" rows="3" value={form.careInstructions} onChange={(event) => updateField('careInstructions', event.target.value)} />
      </div>
      <div>
        <label htmlFor="meta-title">Search Title</label>
        <input id="meta-title" value={form.metaTitle} onChange={(event) => updateField('metaTitle', event.target.value)} />
        <p className="mt-2 text-xs text-[#6F6259]">Optional title used by search engines.</p>
      </div>
      <div>
        <label htmlFor="meta-description">Search Description</label>
        <input id="meta-description" value={form.metaDescription} onChange={(event) => updateField('metaDescription', event.target.value)} />
        <p className="mt-2 text-xs text-[#6F6259]">Optional short summary used by search engines.</p>
      </div>
      {includeMarketingFlags ? (
        <div className="grid gap-3 border border-[#DED2C5] bg-[#FAF6EE] p-4 md:col-span-2 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <h3 className="text-base font-semibold text-[#302925]">Storefront Highlights</h3>
            <p className="mt-1 text-sm text-[#6F6259]">Choose where this product should be highlighted.</p>
          </div>
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
        </div>
      ) : null}
    </section>
  );
}

ProductDetailsSection.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object,
  updateField: PropTypes.func.isRequired,
  includeDiscoveryFields: PropTypes.bool,
  includeMarketingFlags: PropTypes.bool,
};

export default ProductDetailsSection;
