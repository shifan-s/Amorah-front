import PropTypes from 'prop-types';
import { formatINR } from '../../../utils/currency.js';

function ProductPricingSection({ form, errors, updateField }) {
  const regular = Number(form.regularPrice);
  const sale = form.salePrice === '' ? null : Number(form.salePrice);
  const hasRegular = Number.isFinite(regular) && regular >= 0;
  const hasSale = Number.isFinite(sale) && sale >= 0 && hasRegular && sale < regular;
  const discount = hasSale && regular > 0 ? Math.round(((regular - sale) / regular) * 100) : 0;
  const sellingPrice = hasSale ? sale : hasRegular ? regular : null;

  return (
    <section className="grid gap-5 border border-[#DED2C5] bg-[#FFFDF8] p-5 md:grid-cols-[1fr_1fr_18rem]">
      <div className="md:col-span-3">
        <h2 className="text-xl font-semibold text-[#302925]">Pricing</h2>
        <p className="mt-1 text-sm text-[#6F6259]">Use whole rupee amounts. The backend will keep prices numeric.</p>
      </div>
      <div>
        <label htmlFor="regular-price">Original Price <span className="text-[#672F3B]" aria-hidden="true">*</span></label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F6259]">&#8377;</span>
          <input id="regular-price" className="pl-9" type="number" min="0" step="1" value={form.regularPrice} onChange={(event) => updateField('regularPrice', event.target.value)} />
        </div>
        <p className="mt-2 text-xs text-[#6F6259]">Required base price. If no discounted price is entered, customers pay this amount.</p>
        {errors.regularPrice ? <p className="mt-2 text-sm text-amorah-error">{errors.regularPrice}</p> : null}
      </div>
      <div>
        <label htmlFor="sale-price">Discounted Selling Price</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F6259]">&#8377;</span>
          <input id="sale-price" className="pl-9" type="number" min="0" step="1" value={form.salePrice} onChange={(event) => updateField('salePrice', event.target.value)} />
        </div>
        <p className="mt-2 text-xs text-[#6F6259]">The price customers will pay when this product is on discount.</p>
        {errors.salePrice ? <p className="mt-2 text-sm text-amorah-error">{errors.salePrice}</p> : null}
      </div>
      <div className="border border-[#DED2C5] bg-[#FAF6EE] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6F6259]">Selling Price</p>
        <p className="mt-2 text-xl font-semibold text-[#302925]">{sellingPrice !== null ? formatINR(sellingPrice) : '-'}</p>
        <p className="mt-2 text-sm text-[#6F6259]">The price customers will pay.</p>
        <p className="mt-3 text-sm text-[#302925]">Original Price: {hasRegular ? formatINR(regular) : '-'}</p>
        <p className="mt-1 text-sm font-semibold text-[#672F3B]">Discount: {discount ? `${discount}%` : '-'}</p>
      </div>
    </section>
  );
}

ProductPricingSection.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default ProductPricingSection;
