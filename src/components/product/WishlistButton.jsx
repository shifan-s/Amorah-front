import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import Button from '../common/Button.jsx';
import { selectIsProductWishlisted, toggleWishlist } from '../../store/slices/wishlistSlice.js';

function WishlistButton({ productId, productName, product, className = '' }) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsProductWishlisted(productId));

  return (
    <Button
      variant={isWishlisted ? 'primary' : 'outline'}
      className={className}
      onClick={() => {
        dispatch(toggleWishlist(product || productId));
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
      }}
    >
      <FiHeart aria-hidden="true" />
      {isWishlisted ? 'Wishlisted' : `Wishlist ${productName}`}
    </Button>
  );
}

WishlistButton.propTypes = {
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  product: PropTypes.object,
  className: PropTypes.string,
};

export default WishlistButton;
