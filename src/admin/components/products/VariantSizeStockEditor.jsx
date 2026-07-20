import PropTypes from 'prop-types';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { clothingSizes, defaultSizes, hijabSizes } from '../../utils/productFormDefaults.js';

function VariantSizeStockEditor({ variantIndex, sizes, errors, onChange, onAdd, onRemove, onReplacePreset }) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-semibold text-[#302925]">Sizes and Stock</h4>
          <p className="mt-1 text-sm text-[#6F6259]">Enter the number of items currently available for each size.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onReplacePreset(clothingSizes)} className="inline-flex min-h-10 items-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold">
            Use S-XXL
          </button>
          <button type="button" onClick={() => onReplacePreset(hijabSizes)} className="inline-flex min-h-10 items-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold">
            Use Free Size
          </button>
          <button type="button" onClick={() => onAdd('')} className="inline-flex min-h-10 items-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold">
            <FiPlus aria-hidden="true" />
            Add Size
          </button>
        </div>
      </div>
      <div className="mt-3 grid gap-3">
        {sizes.map((size, sizeIndex) => (
          <div key={size.key} className="grid gap-3 border border-[#DED2C5] bg-[#FAF6EE] p-3 sm:grid-cols-[1fr_8rem_auto_auto] sm:items-start">
            <div>
              <label htmlFor={`size-name-${variantIndex}-${sizeIndex}`}>Size</label>
              <input
                id={`size-name-${variantIndex}-${sizeIndex}`}
                list={`size-options-${variantIndex}`}
                value={size.name}
                onChange={(event) => onChange(sizeIndex, 'name', event.target.value)}
              />
              {errors[`variants.${variantIndex}.sizes.${sizeIndex}.name`] ? (
                <p className="mt-2 text-sm text-amorah-error">{errors[`variants.${variantIndex}.sizes.${sizeIndex}.name`]}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor={`size-stock-${variantIndex}-${sizeIndex}`}>Stock Quantity</label>
              <input
                id={`size-stock-${variantIndex}-${sizeIndex}`}
                type="number"
                min="0"
                step="1"
                value={size.stock}
                onChange={(event) => onChange(sizeIndex, 'stock', event.target.value)}
              />
              {errors[`variants.${variantIndex}.sizes.${sizeIndex}.stock`] ? (
                <p className="mt-2 text-sm text-amorah-error">{errors[`variants.${variantIndex}.sizes.${sizeIndex}.stock`]}</p>
              ) : null}
            </div>
            <label className="mb-0 flex min-h-11 items-center gap-2 sm:mt-7">
              <input type="checkbox" checked={size.active} onChange={(event) => onChange(sizeIndex, 'active', event.target.checked)} />
              Available
            </label>
            <button type="button" onClick={() => onRemove(sizeIndex)} className="grid h-11 w-11 place-items-center border border-[#DED2C5] text-[#672F3B] sm:mt-7" aria-label={`Remove ${size.name || 'size'}`}>
              <FiTrash2 aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <datalist id={`size-options-${variantIndex}`}>
        {defaultSizes.map((size) => (
          <option key={size} value={size} />
        ))}
      </datalist>
      {errors[`variants.${variantIndex}.sizes`] ? <p className="mt-2 text-sm text-amorah-error">{errors[`variants.${variantIndex}.sizes`]}</p> : null}
    </div>
  );
}

VariantSizeStockEditor.propTypes = {
  variantIndex: PropTypes.number.isRequired,
  sizes: PropTypes.arrayOf(PropTypes.object).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onReplacePreset: PropTypes.func.isRequired,
};

export default VariantSizeStockEditor;
