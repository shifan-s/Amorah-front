import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { getProductBySlug } from '../services/productService.js';
import { selectAllProducts, upsertProducts } from '../store/slices/productSlice.js';
import { selectWishlistItems, selectWishlistProductIds } from '../store/slices/wishlistSlice.js';

function AccountWishlistPage() {
  const dispatch = useDispatch();
  const productIds = useSelector(selectWishlistProductIds);
  const wishlistItems = useSelector(selectWishlistItems);
  const products = useSelector(selectAllProducts);
  const wishlistProducts = productIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);

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

  return (
    <>
      <Seo
        title="Account Wishlist | Amorah by N-ZAN Designs"
        description="View saved Amorah pieces from your customer account wishlist."
        path="/account/wishlist"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Account', path: '/account' },
          { name: 'Wishlist', path: '/account/wishlist' },
        ]}
      />
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Saved pieces</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-amorah-black">Account Wishlist</h1>
        {wishlistProducts.length === 0 ? (
          <EmptyState className="mt-6" title="No saved pieces yet" description="Wishlist items from the storefront will appear here." />
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default AccountWishlistPage;
