import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { getProductColours, getProductSizes } from '../components/product/productOptionUtils.js';
import { getProductBySlug } from '../services/productService.js';
import { addToCart } from '../store/slices/cartSlice.js';
import { selectAllProducts, upsertProducts } from '../store/slices/productSlice.js';
import { clearWishlist, removeFromWishlist, selectWishlistItems, selectWishlistProductIds } from '../store/slices/wishlistSlice.js';

function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productIds = useSelector(selectWishlistProductIds);
  const wishlistItems = useSelector(selectWishlistItems);
  const products = useSelector(selectAllProducts);
  const wishlistProducts = productIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter(Boolean);

  useEffect(() => {
    const missingItems = wishlistItems.filter(
      (item) => item.slug && !products.some((product) => product.id === item.productId || product.slug === item.slug),
    );

    if (!missingItems.length) {
      return undefined;
    }

    let ignore = false;

    Promise.allSettled(missingItems.map((item) => getProductBySlug(item.slug))).then((results) => {
      if (!ignore) {
        dispatch(upsertProducts(results.filter((result) => result.status === 'fulfilled').map((result) => result.value)));
      }
    });

    return () => {
      ignore = true;
    };
  }, [dispatch, products, wishlistItems]);

  const moveToCart = (product) => {
    const requiresSelection = getProductSizes(product).length > 1 || getProductColours(product).length > 1;

    if (requiresSelection) {
      navigate(`/product/${product.slug}`);
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
    toast.success('Moved to cart');
  };

  return (
    <>
      <Seo
        title="Wishlist | Amorah by N-ZAN Designs"
        description="Review saved Amorah dresses, kurtis, co-ord sets and favourite fashion pieces in your wishlist."
        path="/wishlist"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Wishlist', path: '/wishlist' },
        ]}
      />
      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-terracotta">Saved pieces</p>
              <h1 className="mt-2 font-heading text-5xl font-semibold text-amorah-maroon sm:text-6xl">Your Saved Pieces</h1>
              <p className="mt-2 text-sm text-amorah-brown">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'piece' : 'pieces'} saved
              </p>
            </div>
            {wishlistProducts.length > 0 ? (
              <Button
                variant="outline"
                onClick={() => {
                  dispatch(clearWishlist());
                  toast.success('Wishlist cleared');
                }}
              >
                Clear Wishlist
              </Button>
            ) : null}
          </div>

          {wishlistProducts.length === 0 ? (
            <EmptyState
              className="mt-8"
              title="A Place for Pieces You Love"
              description="Save cotton comfort, ethnic details and graceful everyday pieces here."
              actionLabel="Explore the Collection"
              onAction={() => navigate('/shop')}
            />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishlistProducts.map((product) => {
                const requiresSelection = getProductSizes(product).length > 1 || getProductColours(product).length > 1;

                return (
                  <div key={product.id} className="space-y-3">
                    <ProductCard product={product} />
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          dispatch(removeFromWishlist(product.id));
                          toast.success('Removed from wishlist');
                        }}
                      >
                        Remove
                      </Button>
                      {requiresSelection ? (
                        <Link
                          to={`/product/${product.slug}`}
                          className="amorah-focus inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-maroon bg-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-white transition hover:bg-amorah-black"
                        >
                          Select Options
                        </Link>
                      ) : (
                        <Button onClick={() => moveToCart(product)}>Move to Cart</Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </main>
    </>
  );
}

export default WishlistPage;
