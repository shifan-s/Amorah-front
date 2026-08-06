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

function RequiredMark() {
  return <span className="text-[#672F3B]" aria-hidden="true"> *</span>;
}

function ProductBasicInfoSection({ form, errors, updateField, addTag, removeTag, simplified = false }) {
  const fieldError = (field) => errors[field];
  const slugPreview = form.slug ? slugify(form.slug) : slugify(form.name);

  const tagKeyDown = (event) => {
    if (!['Enter', ','].includes(event.key)) {
      return;
    }

    event.preventDefault();
    addTag(form.tagInput);
  };

  return (
    <section className="grid gap-5 border border-[#DED2C5] bg-[#FFFDF8] p-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold text-[#302925]">Basic Information</h2>
        <p className="mt-1 text-sm text-[#6F6259]">Start with the details customers read first.</p>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="product-name">Product Name<RequiredMark /></label>
        <input id="product-name" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
        <p className="mt-2 text-xs text-[#6F6259]">Enter the name customers will see.</p>
        {fieldError('name') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('name')}</p> : null}
      </div>
      {!simplified ? (
        <>
          <div>
            <label htmlFor="product-slug">Product Page Link</label>
            <input id="product-slug" value={form.slug} onChange={(event) => updateField('slug', slugify(event.target.value))} placeholder={slugPreview} />
            <p className="mt-2 text-xs text-[#6F6259]">Preview: {slugPreview || 'product-name'}</p>
            {fieldError('slug') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('slug')}</p> : null}
          </div>
          <div>
            <label htmlFor="sku-prefix">SKU Prefix (Optional)</label>
            <input id="sku-prefix" value={form.skuPrefix} onChange={(event) => updateField('skuPrefix', event.target.value.toUpperCase())} />
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
      <div className="md:col-span-2">
        <label htmlFor="product-tags">Tags</label>
        <input
          id="product-tags"
          value={form.tagInput}
          onChange={(event) => updateField('tagInput', event.target.value)}
          onKeyDown={tagKeyDown}
          onBlur={() => addTag(form.tagInput)}
          placeholder="Press Enter to add"
        />
        <p className="mt-2 text-xs text-[#6F6259]">Add words that help customers find this product.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="min-h-8 border border-[#DED2C5] px-3 text-xs font-semibold text-[#302925] hover:bg-[#F3ECE3]"
              aria-label={`Remove ${tag} tag`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="short-description">Short Description<RequiredMark /></label>
        <textarea id="short-description" rows="3" value={form.shortDescription} onChange={(event) => updateField('shortDescription', event.target.value)} />
        <p className="mt-2 text-xs text-[#6F6259]">Write one or two lines for quick product highlights.</p>
        {fieldError('shortDescription') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('shortDescription')}</p> : null}
      </div>
      <div className="md:col-span-2">
        <label htmlFor="full-description">Full Product Description<RequiredMark /></label>
        <textarea id="full-description" rows="6" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
        <p className="mt-2 text-xs text-[#6F6259]">Share fabric, styling, fit and any details that help customers choose confidently.</p>
        {fieldError('description') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('description')}</p> : null}
      </div>
    </section>
  );
}

ProductBasicInfoSection.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  simplified: PropTypes.bool,
};

export default ProductBasicInfoSection;
