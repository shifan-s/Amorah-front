import PropTypes from 'prop-types';
import FeaturedProducts from './FeaturedProducts.jsx';

function NewArrivals({ products, loading = false }) {
  return (
    <FeaturedProducts
      eyebrow="New Arrivals"
      title="New Arrivals"
      description="Fresh pieces from the latest Amorah catalogue, loaded from the backend."
      products={products}
      linkTo="/shop?sort=newest"
      loading={loading}
    />
  );
}

NewArrivals.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
};

export default NewArrivals;
