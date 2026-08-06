import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import ColourSelector from '../components/product/ColourSelector.jsx';
import ImageGallery from '../components/product/ImageGallery.jsx';
import PriceDisplay from '../components/product/PriceDisplay.jsx';
import ProductInformation from '../components/product/ProductInformation.jsx';
import QuantitySelector from '../components/product/QuantitySelector.jsx';
import RecentlyViewedProducts from '../components/product/RecentlyViewedProducts.jsx';
import RelatedProducts from '../components/product/RelatedProducts.jsx';
import SizeSelector from '../components/product/SizeSelector.jsx';
import WishlistButton from '../components/product/WishlistButton.jsx';
import { selectIsAuthenticated } from '../store/slices/authSlice.js';
import { addBackendCartItem, addToCart } from '../store/slices/cartSlice.js';
import { addRecentlyViewedProduct } from '../store/slices/recentlyViewedSlice.js';
import { openDrawer } from '../store/slices/uiSlice.js';
import { getCheckoutLoginState } from '../utils/authRedirect.js';
import { formatINR } from '../utils/currency.js';
import {
  fetchPublicProductBySlug,
  fetchRelatedProducts,
  selectAllProducts,
  selectProductBySlug,
  selectProductDetailStatus,
  selectProductStatus,
  selectRelatedProductsBySlug,
} from '../store/slices/productSlice.js';
import {
  getColourVariant,
  getColourVariants,
  getColourVariantStock,
  getFirstAvailableColourVariant,
  getProductImages,
  getProductSizes,
  getPrimaryVariantImage,
  getVariant,
  isSizeAvailable,
} from '../components/product/productOptionUtils.js';

function ProductDetailsPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const product = useSelector(selectProductBySlug(slug));
  const products = useSelector(selectAllProducts);
  const productStatus = useSelector(selectProductStatus);
  const detailStatus = useSelector(selectProductDetailStatus);
  const backendRelatedProducts = useSelector(selectRelatedProductsBySlug(slug));
  const [selectedColour, setSelectedColour] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [validationMessage, setValidationMessage] = useState('');
  const [cartSubmitting, setCartSubmitting] = useState(false);

  const colourVariants = useMemo(() => (product ? getColourVariants(product) : []), [product]);
  const hasColourVariants = colourVariants.length > 0;
  const productSizes = useMemo(() => (product ? getProductSizes(product) : []), [product]);
  const hasSizes = productSizes.length > 0;
  const selectedColourVariant = useMemo(
    () => (product ? getColourVariant(product, selectedColour) || getFirstAvailableColourVariant(product) : null),
    [product, selectedColour],
  );
  const selectedVariant = useMemo(
    () => (product ? getVariant(product, selectedSize, selectedColour) : null),
    [product, selectedSize, selectedColour],
  );

  const availableStock = selectedVariant?.stock || 0;
  const effectiveUnitPrice = selectedColourVariant?.price ?? product?.currentPrice ?? product?.salePrice ?? product?.regularPrice ?? 0;
  const effectiveCompareAtPrice = selectedColourVariant?.compareAtPrice ?? (product?.salePrice != null ? product?.regularPrice : null);
  const quantityTotal = effectiveUnitPrice * quantity;
  const selectedColourStock = getColourVariantStock(selectedColourVariant);
  const galleryImages = hasColourVariants
    ? selectedColourVariant?.images?.length
      ? selectedColourVariant.images
      : [getPrimaryVariantImage(product, selectedColour)]
    : getProductImages(product);
  const seoImage = galleryImages[0]?.url || product?.images?.[0]?.url;
  const isOutOfStock = hasColourVariants
    ? !product?.inStock || colourVariants.every((variant) => getColourVariantStock(variant) <= 0)
    : product?.inStock === false;

  useEffect(() => {
    if (slug && !product && productStatus !== 'loading' && detailStatus !== 'loading') {
      dispatch(fetchPublicProductBySlug(slug));
    }
  }, [detailStatus, dispatch, product, productStatus, slug]);

  useEffect(() => {
    if (product) {
      dispatch(addRecentlyViewedProduct(product.id));
      dispatch(fetchRelatedProducts(product.slug));
    }
  }, [dispatch, product]);

  useEffect(() => {
    setSelectedColour('');
    setSelectedSize('');
    setActiveImageIndex(0);
    setQuantity(1);
    setValidationMessage('');
  }, [slug]);

  useEffect(() => {
    if (!product || colourVariants.length === 0) {
      return;
    }

    const requestedColour = location.state?.selectedColour;
    const requestedVariant = colourVariants.find(
      (variant) => variant.colourName === requestedColour && getColourVariantStock(variant) > 0,
    );
    const initialVariant = requestedVariant || getFirstAvailableColourVariant(product);

    setSelectedColour(initialVariant?.colourName || '');
    setSelectedSize('');
    setActiveImageIndex(0);
    setQuantity(1);
    setValidationMessage('');
  }, [product, colourVariants, location.state?.selectedColour]);

  useEffect(() => {
    const maxStock = selectedSize ? availableStock : selectedColourStock;

    if (maxStock > 0 && quantity > maxStock) {
      setQuantity(1);
    }
  }, [availableStock, quantity, selectedColourStock, selectedSize]);

  if (!product && (productStatus === 'loading' || detailStatus === 'loading')) {
    return (
      <main className="bg-amorah-ivory py-12">
        <Container>
          <div className="aspect-[4/5] max-h-[42rem] animate-pulse bg-amorah-white sm:aspect-auto sm:h-[42rem]" />
        </Container>
      </main>
    );
  }

  if (!product) {
    return (
      <>
        <Seo
          title="Product Not Found | Amorah N-ZAN Designs"
          description="The requested Amorah product could not be found. Browse the latest dresses, kurtis and co-ord sets."
          path={`/product/${slug || 'not-found'}`}
          breadcrumbs={[
            { name: 'Home', path: '/' },
            { name: 'Product Not Found', path: `/product/${slug || 'not-found'}` },
          ]}
        />
        <main className="bg-amorah-ivory py-12">
          <Container>
            <EmptyState
              title="This piece could not be found"
              description="The product may have moved, sold out or the link may be incorrect."
              actionLabel="Return to Shop"
              onAction={() => navigate('/shop')}
            />
          </Container>
        </main>
      </>
    );
  }

  const validateSelection = () => {
    if (hasColourVariants && !selectedColour) {
      setValidationMessage('Please select a colour.');
      return false;
    }

    if (hasSizes && !selectedSize) {
      setValidationMessage('Please select a size.');
      return false;
    }

    if (hasColourVariants && !selectedVariant) {
      setValidationMessage('This colour and size combination is unavailable. Please choose another option.');
      return false;
    }

    if (hasColourVariants && selectedColourStock <= 0) {
      setValidationMessage('This colour is currently out of stock.');
      return false;
    }

    if (hasColourVariants && selectedVariant.stock <= 0) {
      setValidationMessage('This colour and size combination is out of stock.');
      return false;
    }

    if (hasColourVariants && (!Number.isInteger(quantity) || quantity < 1 || quantity > selectedVariant.stock)) {
      setValidationMessage(`Only ${selectedVariant.stock} items are available in this colour and size.`);
      return false;
    }

    return true;
  };

  const handleAddToCart = async ({ openCart = true } = {}) => {
    if (isOutOfStock) {
      setValidationMessage('This piece is currently out of stock.');
      return false;
    }

    if (!validateSelection()) {
      return false;
    }

    try {
      setCartSubmitting(true);

      if (isAuthenticated) {
        if (!selectedVariant?.id || !selectedVariant?.sizeId) {
          setValidationMessage('Please select an available colour and size before adding this piece to cart.');
          return false;
        }

        await dispatch(
          addBackendCartItem({
            productId: product.id,
            variantId: selectedVariant.id,
            sizeId: selectedVariant.sizeId,
            quantity,
          }),
        ).unwrap();
      } else {
        dispatch(
          addToCart({
            product,
            selectedColour,
            selectedSize,
            variantId: selectedVariant?.id,
            quantity,
          }),
        );
      }

      if (openCart) {
        dispatch(openDrawer('cart'));
      }

      toast.success('Added to cart');
      return true;
    } catch (error) {
      toast.error(error.message || 'Unable to add to cart');
      return false;
    } finally {
      setCartSubmitting(false);
    }
  };

  const handleColourChange = (colour) => {
    const keepsSelectedSize = !selectedSize || isSizeAvailable(product, selectedSize, colour);
    const nextColourVariant = getColourVariant(product, colour);

    setSelectedColour(colour);
    setActiveImageIndex(0);

    if (!keepsSelectedSize) {
      setSelectedSize('');
      setValidationMessage(`Please select another size for ${colour}.`);
    } else {
      setValidationMessage('');
    }

    const nextStock = keepsSelectedSize && selectedSize
      ? getVariant(product, selectedSize, colour)?.stock || 0
      : getColourVariantStock(nextColourVariant);

    if (nextStock > 0 && quantity > nextStock) {
      setQuantity(1);
    }
  };

  const handleBuyNow = async () => {
    if (await handleAddToCart({ openCart: false })) {
      if (!isAuthenticated) {
        navigate('/login', { state: getCheckoutLoginState('/checkout') });
        return;
      }

      navigate('/checkout');
    }
  };

  const stockMessage = (() => {
    if (isOutOfStock) {
      return 'Out of stock';
    }

    if (!hasColourVariants) {
      return '';
    }

    if (!selectedSize && hasSizes) {
      if (selectedColourStock <= 0) {
        return 'Out of stock';
      }

      if (selectedColourStock <= 4) {
        return `Only ${selectedColourStock} left in ${selectedColourVariant?.colourName || 'this colour'}. Select a size to continue.`;
      }

      return 'Select a size to continue.';
    }

    if (availableStock <= 0) {
      return 'Out of stock';
    }

    return availableStock <= 4 ? `Only ${availableStock} left` : '';
  })();

  const purchaseDisabled =
    isOutOfStock ||
    cartSubmitting ||
    (hasColourVariants && !selectedColour) ||
    (hasSizes && !selectedSize) ||
    (hasColourVariants && availableStock <= 0);

  return (
    <>
      <Seo
        title={`${product.name} | Amorah N-ZAN Designs`}
        description={product.shortDescription}
        path={`/product/${product.slug}`}
        image={seoImage}
        type="product"
        product={product}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
          ...(product.mainCategory ? [{ name: product.mainCategory.name, path: `/shop/${product.mainCategory.slug}` }] : []),
          ...(product.subcategory && product.mainCategory
            ? [{ name: product.subcategory.name, path: `/shop/${product.mainCategory.slug}?subcategory=${product.subcategory.slug}` }]
            : []),
          { name: product.name, path: `/product/${product.slug}` },
        ]}
      />
      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container>
          <section className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[58fr_42fr] lg:items-start">
            <div className="space-y-5">
              <ImageGallery
                images={galleryImages}
                activeImageIndex={activeImageIndex}
                onImageChange={setActiveImageIndex}
                productName={product.name}
                selectedColourName={selectedColourVariant?.colourName || selectedColour || 'selected colour'}
              />

              {hasColourVariants ? (
                <div className="border border-amorah-border bg-amorah-white p-4">
                  <p className="text-sm font-semibold text-amorah-black">
                    Colour: <span className="text-amorah-maroon">{selectedColourVariant?.colourName || 'Select a colour'}</span>
                  </p>
                  <div className="mt-3">
                    <ColourSelector
                      product={product}
                      selectedColour={selectedColour}
                      selectedSize={selectedSize}
                      onChange={handleColourChange}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="bg-amorah-white p-5 sm:p-7 lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-terracotta">
                {product.productType} / {product.style} / {product.occasion}
              </p>
              <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-amorah-maroon sm:text-5xl">{product.name}</h1>
              <div className="mt-5">
                <PriceDisplay
                  regularPrice={effectiveCompareAtPrice ?? effectiveUnitPrice}
                  salePrice={effectiveCompareAtPrice ? effectiveUnitPrice : null}
                  currentPrice={product.currentPrice}
                  discountPercentage={product.discountPercentage}
                  size="lg"
                />
              </div>
              {product.shortDescription ? (
                <p className="mt-5 text-base leading-8 text-amorah-brown">{product.shortDescription}</p>
              ) : null}

              <div className="mt-7 space-y-6">
                <div className="space-y-1 text-sm text-amorah-brown">
                  {hasColourVariants ? (
                    <p>
                      Selected Colour:{' '}
                      <span className="font-semibold text-amorah-black">{selectedColourVariant?.colourName || 'Select a colour'}</span>
                    </p>
                  ) : null}
                  {selectedSize ? (
                    <p>
                      Selected Size: <span className="font-semibold text-amorah-black">{selectedSize}</span>
                    </p>
                  ) : null}
                </div>
                {hasSizes ? (
                  <SizeSelector
                    product={product}
                    selectedSize={selectedSize}
                    selectedColour={selectedColour}
                    onChange={(size) => {
                      setSelectedSize(size);
                      const nextStock = getVariant(product, size, selectedColour)?.stock || 0;
                      setQuantity((currentQuantity) =>
                        nextStock > 0 && currentQuantity <= nextStock ? currentQuantity : 1,
                      );
                      setValidationMessage('');
                    }}
                  />
                ) : null}

                {stockMessage ? (
                  <div className="text-sm text-amorah-brown">
                    <p className={stockMessage === 'Out of stock' ? 'font-semibold text-amorah-error' : ''}>{stockMessage}</p>
                  </div>
                ) : null}

                <div className="grid gap-4 border border-amorah-border bg-amorah-white p-4 sm:grid-cols-[auto_1fr] sm:items-end">
                  <QuantitySelector
                    quantity={quantity}
                    max={hasColourVariants ? availableStock || 1 : product.totalStock || 99}
                    onChange={setQuantity}
                    disabled={(hasSizes && !selectedSize) || (hasColourVariants && availableStock <= 0)}
                  />
                  <div className="text-sm text-amorah-brown sm:text-right">
                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <span>Item subtotal</span>
                      <strong className="text-base text-amorah-maroon">{formatINR(quantityTotal)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {validationMessage ? (
                <p className="mt-5 border border-amorah-error/20 bg-amorah-error/10 px-4 py-3 text-sm font-semibold text-amorah-error">
                  {validationMessage}
                </p>
              ) : null}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Button onClick={handleAddToCart} disabled={purchaseDisabled}>
                  <FiShoppingBag aria-hidden="true" />
                  {isOutOfStock ? 'Out of Stock' : cartSubmitting ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button variant="secondary" onClick={handleBuyNow} disabled={purchaseDisabled}>
                  Buy Now
                </Button>
                <WishlistButton productId={product.id} productName={product.name} product={product} className="sm:col-span-2" />
              </div>

              <div className="mt-7 border border-amorah-border bg-amorah-light p-4 text-sm leading-6 text-amorah-brown">
                Secure online payment through Razorpay. Review{' '}
                <Link className="amorah-focus font-semibold text-amorah-maroon hover:text-amorah-black" to="/shipping-policy">
                  shipping
                </Link>{' '}
                and{' '}
                <Link className="amorah-focus font-semibold text-amorah-maroon hover:text-amorah-black" to="/return-policy">
                  return
                </Link>{' '}
                details before checkout.
              </div>
            </div>
          </section>

          <ProductInformation product={product} />
          <RelatedProducts
            title="You May Also Love"
            products={backendRelatedProducts.filter((item) => item.id !== product.id).slice(0, 8)}
          />
          <RecentlyViewedProducts products={products} currentProductId={product.id} />

          <div className="pb-8">
            <Link
              to="/shop"
              className="amorah-focus text-sm font-semibold uppercase tracking-[0.16em] text-amorah-brown hover:text-amorah-black"
            >
              Continue Shopping
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}

export default ProductDetailsPage;
