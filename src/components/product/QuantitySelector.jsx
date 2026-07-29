import PropTypes from 'prop-types';
import IconButton from '../common/IconButton.jsx';

function QuantitySelector({ quantity, max, onChange, disabled = false, removeAtZero = false }) {
  const safeMax = Math.max(1, Math.floor(Number(max) || 1));
  const safeQuantity = Math.min(safeMax, Math.max(1, Math.floor(Number(quantity) || 1)));
  const updateQuantity = (value) => {
    const minimum = removeAtZero ? 0 : 1;
    onChange(Math.min(safeMax, Math.max(minimum, Math.floor(Number(value) || minimum))));
  };

  return (
    <div>
      <p className="text-sm font-semibold text-amorah-black">Quantity</p>
      <div className="mt-3 inline-flex items-center border border-amorah-border bg-amorah-white">
        <IconButton
          label="Decrease quantity"
          variant="ghost"
          disabled={disabled || (!removeAtZero && safeQuantity <= 1)}
          onClick={() => updateQuantity(safeQuantity - 1)}
        >
          -
        </IconButton>
        <input
          type="number"
          min="1"
          max={safeMax}
          step="1"
          value={safeQuantity}
          className="h-11 w-16 border-x border-amorah-border p-0 text-center"
          aria-label="Quantity"
          disabled={disabled}
          onChange={(event) => updateQuantity(event.target.value)}
        />
        <IconButton
          label="Increase quantity"
          variant="ghost"
          disabled={disabled || safeQuantity >= safeMax}
          onClick={() => updateQuantity(safeQuantity + 1)}
        >
          +
        </IconButton>
      </div>
    </div>
  );
}

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  removeAtZero: PropTypes.bool,
};

export default QuantitySelector;
