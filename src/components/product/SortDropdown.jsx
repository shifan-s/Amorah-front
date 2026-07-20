import PropTypes from 'prop-types';
import { sortOptions } from '../../utils/productFilters.js';

function SortDropdown({ value, onChange }) {
  return (
    <div className="min-w-52">
      <label htmlFor="sort-products" className="sr-only">
        Sort products
      </label>
      <select id="sort-products" value={value} onChange={(event) => onChange(event.target.value)}>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

SortDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SortDropdown;
