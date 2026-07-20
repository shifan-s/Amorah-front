import PropTypes from 'prop-types';

function ConfirmDialog({ open, title, message, confirmLabel, loading, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302925]/45 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md border border-[#DED2C5] bg-[#FFFDF8] p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[#302925]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#6F6259]">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="min-h-11 border border-[#DED2C5] px-4 text-sm font-semibold text-[#302925] outline-none hover:bg-[#F3ECE3] focus-visible:ring-2 focus-visible:ring-[#672F3B]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="min-h-11 bg-[#672F3B] px-4 text-sm font-semibold text-white outline-none hover:bg-[#302925] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#672F3B] focus-visible:ring-offset-2"
          >
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;
