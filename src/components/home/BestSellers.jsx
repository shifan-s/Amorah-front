import PropTypes from 'prop-types';
import FeaturedProducts from './FeaturedProducts.jsx';

function BestSellers({ products, loading = false }) {
  return (
    <FeaturedProducts
      eyebrow="Loved Most"
      title="Loved Most"
      description="Pieces our customers return to for comfort, confidence and effortless style."
      products={products}
      linkTo="/shop?bestSeller=true"
      loading={loading}
    />
  );
}

BestSellers.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
};

export default BestSellers;
