import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import amorahLogo from '../../assets/images/amorah-logo-transparent.png';

const sizes = {
  sm: 'w-28 sm:w-32',
  md: 'w-36 sm:w-44 lg:w-52',
  lg: 'w-44 sm:w-56 lg:w-64',
};

function BrandLogo({ size = 'md', className = '' }) {
  return (
    <Link
      to="/"
      className={`amorah-focus inline-flex items-center justify-center ${className}`}
      aria-label="Amorah by N-ZAN Designs home"
    >
      <img
        src={amorahLogo}
        alt="Amorah by N-ZAN Designs"
        className={`${sizes[size]} h-auto max-h-16 object-contain`}
      />
    </Link>
  );
}

BrandLogo.propTypes = {
  size: PropTypes.oneOf(Object.keys(sizes)),
  className: PropTypes.string,
};

export default BrandLogo;
