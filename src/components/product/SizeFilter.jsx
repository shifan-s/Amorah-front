import PropTypes from 'prop-types';

function SizeFilter({ sizes, selectedSizes, onToggle }) {
  return (
    <fieldset>
      <legend className="font-heading text-lg font-semibold text-amorah-black">Size</legend>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {sizes.map((size) => {
          const checked = selectedSizes.includes(size);

          return (
            <button
              key={size}
              type="button"
              className={`amorah-focus min-h-10 border px-3 text-sm font-semibold transition ${
                checked
                  ? 'border-amorah-black bg-amorah-black text-amorah-white'
                  : 'border-amorah-border bg-amorah-white text-amorah-brown hover:text-amorah-black'
              }`}
              aria-pressed={checked}
              onClick={() => onToggle(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

SizeFilter.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSizes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default SizeFilter;
