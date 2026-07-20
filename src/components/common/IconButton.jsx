import PropTypes from 'prop-types';

const variants = {
  primary: 'border-amorah-maroon bg-amorah-maroon text-amorah-white hover:bg-amorah-black',
  secondary: 'border-amorah-border bg-amorah-white text-amorah-black hover:border-amorah-maroon hover:text-amorah-maroon',
  ghost: 'border-transparent bg-transparent text-amorah-black hover:bg-amorah-light hover:text-amorah-maroon',
};

const sizes = {
  sm: 'h-9 w-9 text-base',
  md: 'h-11 w-11 text-lg',
  lg: 'h-12 w-12 text-xl',
};

function IconButton({
  type = 'button',
  variant = 'secondary',
  size = 'md',
  label,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`amorah-focus inline-flex shrink-0 items-center justify-center border transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

IconButton.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(Object.keys(variants)),
  size: PropTypes.oneOf(Object.keys(sizes)),
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default IconButton;
