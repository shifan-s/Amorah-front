import PropTypes from 'prop-types';
import { FiArchive, FiCheck, FiSave, FiX } from 'react-icons/fi';
import ProductStatusBadge from './ProductStatusBadge.jsx';

function ProductFormActions({ mode, status, productStock, saving, uploadPending, archived, onSaveDraft, onPublish, onSaveChanges, onArchive, onCancel }) {
  if (mode === 'edit') {
    return (
      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6F6259]">Ready to save?</p>
            <p className="mt-2 text-sm text-[#6F6259]">
              Current status: <span className="font-semibold text-[#302925]">{status}</span>. Total stock: <span className="font-semibold text-[#302925]">{productStock}</span>.
            </p>
            {uploadPending ? <p className="mt-2 text-sm text-[#A76B32]">Finish image uploads before saving.</p> : null}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onCancel} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#DED2C5] px-5 text-sm font-semibold text-[#302925] disabled:opacity-50">
              <FiX aria-hidden="true" />
              Cancel
            </button>
            <button type="button" onClick={onSaveChanges} disabled={saving || uploadPending || archived} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#672F3B] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              <FiCheck aria-hidden="true" />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <aside className="grid gap-3 border border-[#DED2C5] bg-[#FFFDF8] p-5 lg:sticky lg:top-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6F6259]">Status</p>
        <div className="mt-2">
          <ProductStatusBadge status={status} />
        </div>
        <p className="mt-3 text-sm text-[#6F6259]">Total stock: <span className="font-semibold text-[#302925]">{productStock}</span></p>
      </div>
      <button type="button" onClick={onSaveDraft} disabled={saving || uploadPending || archived} className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#DED2C5] px-4 text-sm font-semibold text-[#302925] disabled:opacity-50">
        <FiSave aria-hidden="true" />
        {mode === 'edit' ? 'Update Draft' : 'Save Draft'}
      </button>
      <button type="button" onClick={onPublish} disabled={saving || uploadPending || archived} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#672F3B] px-4 text-sm font-semibold text-white disabled:opacity-50">
        <FiCheck aria-hidden="true" />
        {mode === 'edit' ? 'Update and Publish' : 'Save and Publish'}
      </button>
      {mode === 'edit' ? (
        <button type="button" onClick={onArchive} disabled={saving || archived} className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#DED2C5] px-4 text-sm font-semibold text-[#672F3B] disabled:opacity-50">
          <FiArchive aria-hidden="true" />
          Archive Product
        </button>
      ) : null}
      <button type="button" onClick={onCancel} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-semibold text-[#302925]">
        <FiX aria-hidden="true" />
        Cancel
      </button>
      {uploadPending ? <p className="text-sm text-[#A76B32]">Finish image uploads before saving.</p> : null}
    </aside>
  );
}

ProductFormActions.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  status: PropTypes.string.isRequired,
  productStock: PropTypes.number.isRequired,
  saving: PropTypes.bool,
  uploadPending: PropTypes.bool,
  archived: PropTypes.bool,
  onSaveDraft: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func,
  onArchive: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default ProductFormActions;
