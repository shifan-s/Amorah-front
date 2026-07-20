import { FiStar } from 'react-icons/fi';
import PropTypes from 'prop-types';

function RatingStars({ rating, reviewCount, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm text-amorah-brown ${className}`}>
      <span className="flex gap-1 text-amorah-rose" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <FiStar
            key={index}
            className={index < Math.round(rating) ? 'fill-current' : ''}
            aria-hidden="true"
          />
        ))}
      </span>
      <span>{rating.toFixed(1)}</span>
      <span aria-hidden="true">/</span>
      <span>{reviewCount} reviews</span>
    </div>
  );
}

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
  reviewCount: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default RatingStars;
