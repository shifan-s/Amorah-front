import PropTypes from 'prop-types';
import { FiCheck } from 'react-icons/fi';
import { getColourVariants, isColourAvailable, productColourMap } from './productOptionUtils.js';

function ColourSelector({ product, selectedColour, selectedSize = '', onChange }) {
  const colourVariants = getColourVariants(product);

  return (
    <fieldset>
      <legend className="sr-only">Choose a colour</legend>
      <div className="flex flex-wrap gap-3">
        {colourVariants.map((colourVariant) => {
          const available = isColourAvailable(product, colourVariant.colourName, selectedSize);
          const selected = selectedColour === colourVariant.colourName;
          const swatchColour = colourVariant.colourHex || productColourMap[colourVariant.colourName] || '#E5E5E5';

          return (
            <button
              key={colourVariant.id}
              type="button"
              className={`amorah-focus relative grid h-9 w-9 place-items-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-45 ${
                selected
                  ? 'border-amorah-maroon ring-2 ring-amorah-maroon ring-offset-2 ring-offset-amorah-white'
                  : 'border-amorah-border hover:border-amorah-maroon'
              }`}
              aria-label={`Select ${colourVariant.colourName}${available ? '' : ', unavailable'}`}
              aria-pressed={selected}
              disabled={!available}
              title={colourVariant.colourName}
              onClick={() => onChange(colourVariant.colourName)}
            >
              <span
                className="relative h-7 w-7 rounded-full border border-amorah-border"
                style={{ backgroundColor: swatchColour }}
                aria-hidden="true"
              >
                {!available ? (
                  <span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-amorah-error" />
                ) : null}
              </span>
              {selected ? <FiCheck aria-hidden="true" className="absolute text-sm text-amorah-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]" /> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

ColourSelector.propTypes = {
  product: PropTypes.object.isRequired,
  selectedColour: PropTypes.string,
  selectedSize: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ColourSelector;
