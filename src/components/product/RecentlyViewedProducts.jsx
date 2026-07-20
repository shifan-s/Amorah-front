import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectRecentlyViewedProductIds } from '../../store/slices/recentlyViewedSlice.js';
import RelatedProducts from './RelatedProducts.jsx';

function RecentlyViewedProducts({ products, currentProductId }) {
  const productIds = useSelector(selectRecentlyViewedProductIds);
  const recentlyViewedProducts = productIds
    .filter((productId) => productId !== currentProductId)
    .map((productId) => products.find((product) => product.id === productId))
    .filter(Boolean)
    .slice(0, 4);

  return <RelatedProducts title="Recently viewed" products={recentlyViewedProducts} />;
}

RecentlyViewedProducts.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentProductId: PropTypes.string.isRequired,
};

export default RecentlyViewedProducts;
