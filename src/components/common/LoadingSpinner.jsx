import PropTypes from 'prop-types';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]',
};

function LoadingSpinner({ size = 'md', label = 'Loading', className = '' }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} role="status">
      <span className="sr-only">{label}</span>
      <span
        className={`${sizes[size]} inline-block animate-spin rounded-full border-current border-r-transparent motion-reduce:animate-none`}
        aria-hidden="true"
      />
    </span>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(Object.keys(sizes)),
  label: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingSpinner;
