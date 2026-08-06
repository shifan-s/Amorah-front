import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import IconButton from '../common/IconButton.jsx';
import { selectIsAuthenticated } from '../../store/slices/authSlice.js';
import { addBackendCartItem, addToCart } from '../../store/slices/cartSlice.js';
import { openDrawer } from '../../store/slices/uiSlice.js';
import { selectIsProductWishlisted, toggleWishlist } from '../../store/slices/wishlistSlice.js';
import { formatINR } from '../../utils/currency.js';
import {
  getColourVariant,
  getColourVariants,
  getColourVariantStock,
  getFirstAvailableColourVariant,
  getProductColours,
  getProductSizes,
  getProductStock,
  getPrimaryVariantImage,
  handleProductImageError,
  productColourMap,
} from './productOptionUtils.js';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsProductWishlisted(product.id));
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initialColourVariant = useMemo(() => getFirstAvailableColourVariant(product), [product]);
  const [previewColour, setPreviewColour] = useState(initialColourVariant?.colourName || getProductColours(product)[0]);
  const colourVariants = useMemo(() => getColourVariants(product), [product]);
  const hasColourVariants = colourVariants.length > 0;
  const previewColourVariant = getColourVariant(product, previewColour) || initialColourVariant;
  const previewImages = previewColourVariant?.images || [];
  const primaryPreviewImage = previewImages.find((image) => image.isPrimary);
  const cardImages = primaryPreviewImage
    ? [primaryPreviewImage, ...previewImages.filter((image) => image !== primaryPreviewImage)]
    : previewImages;
  const fallbackImage = getPrimaryVariantImage(product, previewColour);
  const displayPrice = previewColourVariant?.price ?? product.currentPrice ?? product.salePrice ?? product.regularPrice;
  const compareAtPrice = previewColourVariant?.compareAtPrice ?? (product.salePrice != null ? product.regularPrice : null);
  const isOnSale = compareAtPrice !== null && compareAtPrice > displayPrice;
  const requiresSelection = hasColourVariants && (getProductSizes(product).length > 1 || getProductColours(product).length > 1);
  const isOutOfStock = hasColourVariants ? getProductStock(product) <= 0 : product.inStock === false;
  const productPath = `/product/${product.slug}`;
  const linkState = previewColour ? { selectedColour: previewColour } : undefined;
  const badges = [
    isOutOfStock ? { label: 'Sold Out', variant: 'neutral' } : null,
    product.newArrival ? { label: 'New', variant: 'rose' } : null,
    isOnSale ? { label: 'Sale', variant: 'error' } : null,
    product.featured ? { label: 'Featured', variant: 'neutral' } : null,
  ].filter(Boolean).slice(0, 1);

  useEffect(() => {
    setPreviewColour(initialColourVariant?.colourName || getProductColours(product)[0]);
  }, [initialColourVariant, product]);

  const handleWishlistClick = (event) => {
    event.preventDefault();
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error('This piece is currently out of stock.');
      return;
    }

    const selectedSize = previewColourVariant?.sizes?.[0]?.name;
    const selectedSizeId = previewColourVariant?.sizes?.[0]?.id;

    if (!previewColourVariant) {
      toast.error('Please open this product to choose available options.');
      return;
    }

    if (isAuthenticated) {
      try {
        await dispatch(
          addBackendCartItem({
            productId: product.id,
            variantId: previewColourVariant.id,
            sizeId: selectedSizeId,
            quantity: 1,
          }),
        ).unwrap();
        dispatch(openDrawer('cart'));
        toast.success('Added to cart');
      } catch (error) {
        toast.error(error.message || 'Unable to add to cart');
      }
      return;
    }

    dispatch(addToCart({ product, selectedColour: previewColourVariant?.colourName, selectedSize, quantity: 1 }));
    dispatch(openDrawer('cart'));
    toast.success('Added to cart');
  };

  return (
    <article className="group flex h-full flex-col bg-amorah-ivory">
      <div className="relative overflow-hidden bg-amorah-light">
        <Link to={productPath} state={linkState} className="amorah-focus block" aria-label={`View ${product.name}`}>
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src={cardImages[0]?.url || fallbackImage.url}
              alt={cardImages[0]?.alt || fallbackImage.alt || product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              loading="lazy"
              onError={handleProductImageError}
            />
            {cardImages[1]?.url ? (
              <img
                src={cardImages[1].url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100 motion-reduce:transition-none"
                loading="lazy"
                onError={handleProductImageError}
              />
            ) : null}
          </div>
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge.label} variant={badge.variant}>{badge.label}</Badge>
          ))}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <IconButton
            label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            size="sm"
            variant={isWishlisted ? 'primary' : 'secondary'}
            onClick={handleWishlistClick}
          >
            <FiHeart aria-hidden="true" />
          </IconButton>
        </div>
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          {isOutOfStock ? (
            <Button variant="secondary" disabled className="w-full bg-amorah-white/95">
              Out of Stock
            </Button>
          ) : requiresSelection ? (
            <Link
              to={productPath}
              state={linkState}
              className="amorah-focus inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-amorah-white bg-amorah-white/95 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-amorah-maroon transition hover:bg-amorah-maroon hover:text-amorah-white"
            >
              Select Options
            </Link>
          ) : (
            <Button className="w-full" onClick={handleAddToCart}>
              <FiShoppingBag aria-hidden="true" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amorah-terracotta">
            {product.mainCategory?.name || product.productType || 'Amorah'}
          </p>
          <Link to={productPath} state={linkState} className="amorah-focus mt-2 block hover:text-amorah-maroon">
            <h3 className="text-sm font-semibold leading-snug text-amorah-black sm:text-base">{product.name}</h3>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isOnSale ? <span className="text-sm text-amorah-brown line-through">{formatINR(compareAtPrice)}</span> : null}
          <span className="text-sm font-semibold text-amorah-maroon sm:text-base">{formatINR(displayPrice)}</span>
          {isOnSale ? (
            <span className="text-xs font-semibold text-amorah-terracotta">{product.discountPercentage}% off</span>
          ) : null}
        </div>

        {hasColourVariants ? (
          <div className="flex items-center gap-2" aria-label={`Available colours: ${getProductColours(product).join(', ')}`}>
            {colourVariants.slice(0, 4).map((colourVariant) => (
              <button
                key={colourVariant.id}
                type="button"
                className={`amorah-focus h-5 w-5 border transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  previewColour === colourVariant.colourName ? 'border-amorah-maroon ring-1 ring-amorah-maroon' : 'border-amorah-border'
                }`}
                style={{ backgroundColor: colourVariant.colourHex || productColourMap[colourVariant.colourName] || '#E5E5E5' }}
                title={colourVariant.colourName}
                aria-label={`Preview ${product.name} in ${colourVariant.colourName}`}
                aria-pressed={previewColour === colourVariant.colourName}
                disabled={getColourVariantStock(colourVariant) <= 0}
                onClick={() => setPreviewColour(colourVariant.colourName)}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-2 lg:hidden">
          {isOutOfStock ? (
            <Button variant="outline" disabled className="w-full">
              Out of Stock
            </Button>
          ) : requiresSelection ? (
            <Link
              to={productPath}
              state={linkState}
              className="amorah-focus inline-flex min-h-12 w-full items-center justify-center rounded-sm border border-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-maroon transition hover:bg-amorah-maroon hover:text-amorah-white"
            >
              Select Options
            </Link>
          ) : (
            <Button className="w-full" onClick={handleAddToCart}>
              <FiShoppingBag aria-hidden="true" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    productType: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
    fabric: PropTypes.string.isRequired,
    occasion: PropTypes.string.isRequired,
    regularPrice: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    currentPrice: PropTypes.number,
    discountPercentage: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    reviewCount: PropTypes.number.isRequired,
    variants: PropTypes.arrayOf(PropTypes.object).isRequired,
    bestSeller: PropTypes.bool.isRequired,
    newArrival: PropTypes.bool.isRequired,
    featured: PropTypes.bool,
  }).isRequired,
};

export default ProductCard;
