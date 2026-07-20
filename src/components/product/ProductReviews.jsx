import PropTypes from 'prop-types';
import RatingStars from './RatingStars.jsx';

function ProductReviews({ product }) {
  return (
    <section className="py-12">
      <div className="border border-amorah-border bg-amorah-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Reviews</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-amorah-black">What customers are saying</h2>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} className="mt-3" />
          </div>
          <p className="max-w-md text-sm leading-6 text-amorah-brown">
            Reviews are currently represented by aggregate catalogue ratings. Detailed customer reviews will arrive with the backend.
          </p>
        </div>
      </div>
    </section>
  );
}

ProductReviews.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductReviews;
