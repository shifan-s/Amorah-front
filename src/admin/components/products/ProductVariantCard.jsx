import PropTypes from 'prop-types';
import { FiArrowDown, FiArrowUp, FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi';
import VariantImageGrid from './VariantImageGrid.jsx';
import VariantImageUploader from './VariantImageUploader.jsx';
import VariantSizeStockEditor from './VariantSizeStockEditor.jsx';

function totalStock(variant) {
  return variant.sizes.reduce((total, size) => {
    if (size.active === false || variant.active === false) return total;
    return total + (Number.parseInt(size.stock, 10) || 0);
  }, 0);
}

function ProductVariantCard({
  form,
  variant,
  variantIndex,
  variantCount,
  errors,
  onUpdate,
  onToggle,
  onRemove,
  onMove,
  onImagesUploaded,
  onImageChange,
  onImageRemove,
  onImageReplace,
  onSizeChange,
  onSizeAdd,
  onSizeRemove,
  onSizePresetReplace,
  onUploadStateChange,
}) {
  const title = variant.colourName || `Colour ${variantIndex + 1}`;

  return (
    <article className="border border-[#DED2C5] bg-[#FFFDF8]">
      <div className="flex flex-col gap-3 border-b border-[#DED2C5] p-4 xl:flex-row xl:items-center xl:justify-between">
        <button type="button" onClick={() => onToggle(variantIndex)} className="flex flex-1 items-center gap-3 text-left" aria-expanded={variant.expanded}>
          <span className="h-8 w-8 shrink-0 border border-[#DED2C5]" style={{ backgroundColor: variant.colourHex || '#FFFDF8' }} aria-hidden="true" />
          <span>
            <span className="block font-semibold text-[#302925]">{title}</span>
            <span className="block text-xs text-[#6F6259]">
              {variant.sku || 'No SKU'} | {variant.images.length} images | {totalStock(variant)} stock | {variant.active ? 'Active' : 'Inactive'}
            </span>
          </span>
          {variant.expanded ? <FiChevronUp className="ml-auto" aria-hidden="true" /> : <FiChevronDown className="ml-auto" aria-hidden="true" />}
        </button>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onMove(variantIndex, -1)} disabled={variantIndex === 0} className="grid h-10 w-10 place-items-center border border-[#DED2C5] disabled:opacity-40" aria-label="Move colour up">
            <FiArrowUp aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onMove(variantIndex, 1)} disabled={variantIndex === variantCount - 1} className="grid h-10 w-10 place-items-center border border-[#DED2C5] disabled:opacity-40" aria-label="Move colour down">
            <FiArrowDown aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onRemove(variantIndex)} className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold text-[#672F3B]" aria-label={`Remove ${title}`}>
            <FiTrash2 aria-hidden="true" />
            Remove Colour
          </button>
        </div>
      </div>
      {variant.expanded ? (
        <div className="grid gap-5 p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label htmlFor={`variant-sku-${variantIndex}`}>SKU <span className="text-[#672F3B]" aria-hidden="true">*</span></label>
              <input id={`variant-sku-${variantIndex}`} value={variant.sku} onChange={(event) => onUpdate(variantIndex, 'sku', event.target.value.toUpperCase())} />
              {errors[`variants.${variantIndex}.sku`] ? <p className="mt-2 text-sm text-amorah-error">{errors[`variants.${variantIndex}.sku`]}</p> : null}
            </div>
            <div>
              <label htmlFor={`variant-colour-${variantIndex}`}>Colour Name <span className="text-[#672F3B]" aria-hidden="true">*</span></label>
              <input id={`variant-colour-${variantIndex}`} value={variant.colourName} onChange={(event) => onUpdate(variantIndex, 'colourName', event.target.value)} />
              <p className="mt-2 text-xs text-[#6F6259]">Use the colour name customers will choose, such as Maroon or White.</p>
              {errors[`variants.${variantIndex}.colourName`] ? <p className="mt-2 text-sm text-amorah-error">{errors[`variants.${variantIndex}.colourName`]}</p> : null}
            </div>
            <div>
              <label htmlFor={`variant-hex-${variantIndex}`}>Colour Swatch</label>
              <input id={`variant-hex-${variantIndex}`} value={variant.colourHex} onChange={(event) => onUpdate(variantIndex, 'colourHex', event.target.value)} placeholder="#6d1f32" />
              {errors[`variants.${variantIndex}.colourHex`] ? <p className="mt-2 text-sm text-amorah-error">{errors[`variants.${variantIndex}.colourHex`]}</p> : null}
            </div>
            <label className="mb-0 flex min-h-11 items-center gap-3 md:mt-7">
              <input type="checkbox" checked={variant.active} onChange={(event) => onUpdate(variantIndex, 'active', event.target.checked)} />
              Available
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`variant-price-${variantIndex}`}>Price (INR) <span className="text-[#672F3B]" aria-hidden="true">*</span></label>
              <input id={`variant-price-${variantIndex}`} type="number" min="0" step="1" value={variant.price} onChange={(event) => onUpdate(variantIndex, 'price', event.target.value)} />
              {errors[`variants.${variantIndex}.price`] ? <p className="mt-2 text-sm text-amorah-error">{errors[`variants.${variantIndex}.price`]}</p> : null}
            </div>
            <div>
              <label htmlFor={`variant-compare-price-${variantIndex}`}>Compare-at Price (INR)</label>
              <input id={`variant-compare-price-${variantIndex}`} type="number" min="0" step="1" value={variant.compareAtPrice} onChange={(event) => onUpdate(variantIndex, 'compareAtPrice', event.target.value)} />
              {errors[`variants.${variantIndex}.compareAtPrice`] ? <p className="mt-2 text-sm text-amorah-error">{errors[`variants.${variantIndex}.compareAtPrice`]}</p> : null}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#302925]">Images for This Colour</h4>
            <p className="mt-1 text-sm text-[#6F6259]">Upload exactly three images in this order: front, side, then back. The front pose is always the main image.</p>
          </div>
          <VariantImageUploader productName={form.name} variant={variant} onUploaded={(images) => onImagesUploaded(variantIndex, images)} onUploadStateChange={onUploadStateChange} />
          {errors[`variants.${variantIndex}.images`] ? <p className="text-sm text-amorah-error">{errors[`variants.${variantIndex}.images`]}</p> : null}
          <VariantImageGrid
            variantIndex={variantIndex}
            images={variant.images}
            errors={errors}
            onAltChange={(imageIndex, value) => onImageChange(variantIndex, imageIndex, 'alt', value)}
            onPrimary={(imageIndex) => onImageChange(variantIndex, imageIndex, 'isPrimary', true)}
            onMove={(imageIndex, direction) => onImageChange(variantIndex, imageIndex, 'move', direction)}
            onRemove={(imageIndex) => onImageRemove(variantIndex, imageIndex)}
            onReplace={(imageIndex, file) => onImageReplace(variantIndex, imageIndex, file)}
          />
          <VariantSizeStockEditor
            variantIndex={variantIndex}
            sizes={variant.sizes}
            errors={errors}
            onChange={(sizeIndex, field, value) => onSizeChange(variantIndex, sizeIndex, field, value)}
            onAdd={(name) => onSizeAdd(variantIndex, name)}
            onRemove={(sizeIndex) => onSizeRemove(variantIndex, sizeIndex)}
            onReplacePreset={(sizeNames) => onSizePresetReplace(variantIndex, sizeNames)}
          />
        </div>
      ) : null}
    </article>
  );
}

ProductVariantCard.propTypes = {
  form: PropTypes.object.isRequired,
  variant: PropTypes.object.isRequired,
  variantIndex: PropTypes.number.isRequired,
  variantCount: PropTypes.number.isRequired,
  errors: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onImagesUploaded: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onImageRemove: PropTypes.func.isRequired,
  onImageReplace: PropTypes.func.isRequired,
  onSizeChange: PropTypes.func.isRequired,
  onSizeAdd: PropTypes.func.isRequired,
  onSizeRemove: PropTypes.func.isRequired,
  onSizePresetReplace: PropTypes.func.isRequired,
  onUploadStateChange: PropTypes.func.isRequired,
};

export default ProductVariantCard;
