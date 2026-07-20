import PropTypes from 'prop-types';
import { slugify } from '../../utils/productFilters.js';

const colourMap = {
  Beige: '#E9DED2',
  Black: '#111111',
  Brown: '#4B3B35',
  Ivory: '#FAF8F4',
  'Light Grey': '#F3F3F3',
  'Muted Rose': '#C99A9A',
  White: '#FFFFFF',
};

function ColourFilter({ colours, selectedColours, onToggle }) {
  return (
    <fieldset>
      <legend className="font-heading text-lg font-semibold text-amorah-black">Colour</legend>
      <div className="mt-4 space-y-2">
        {colours.map((colour) => {
          const colourSlug = slugify(colour);
          const checked = selectedColours.includes(colourSlug);

          return (
            <button
              key={colour}
              type="button"
              className="amorah-focus flex w-full items-center justify-between gap-3 py-1 text-left text-sm text-amorah-brown hover:text-amorah-black"
              aria-pressed={checked}
              onClick={() => onToggle(colourSlug)}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`h-4 w-4 border ${checked ? 'border-amorah-black' : 'border-amorah-border'}`}
                  style={{ backgroundColor: colourMap[colour] || '#E5E5E5' }}
                  aria-hidden="true"
                />
                {colour}
              </span>
              {checked ? <span className="text-xs font-semibold uppercase tracking-[0.14em]">On</span> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

ColourFilter.propTypes = {
  colours: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedColours: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ColourFilter;
