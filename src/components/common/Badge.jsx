import PropTypes from 'prop-types';

const variants = {
  neutral: 'border-amorah-border bg-amorah-white text-amorah-brown',
  rose: 'border-amorah-rose bg-amorah-beige text-amorah-black',
  success: 'border-amorah-success/20 bg-amorah-success/10 text-amorah-success',
  error: 'border-amorah-error/20 bg-amorah-error/10 text-amorah-error',
};

function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  variant: PropTypes.oneOf(Object.keys(variants)),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Badge;
