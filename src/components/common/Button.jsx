import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner.jsx';

const variants = {
  primary:
    'border-amorah-maroon bg-amorah-maroon text-amorah-white hover:border-amorah-black hover:bg-amorah-black',
  secondary:
    'border-amorah-maroon bg-amorah-white text-amorah-maroon hover:bg-amorah-maroon hover:text-amorah-white',
  outline:
    'border-amorah-maroon bg-transparent text-amorah-maroon hover:bg-amorah-maroon hover:text-amorah-white',
  text: 'border-transparent bg-transparent px-0 text-amorah-maroon underline-offset-4 hover:underline',
};

const sizes = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-12 px-6 text-sm',
  lg: 'min-h-14 px-8 text-base',
};

function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`amorah-focus inline-flex items-center justify-center gap-2 rounded-sm border font-semibold tracking-[0.08em] transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" label="Loading button action" /> : null}
      <span>{children}</span>
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(Object.keys(variants)),
  size: PropTypes.oneOf(Object.keys(sizes)),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
