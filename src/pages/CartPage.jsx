import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import { getCartTotals } from '../components/cart/cartTotals.js';
import {
  clearBackendCart,
  clearCart,
  removeBackendCartItem,
  removeFromCart,
  selectCartItems,
  selectCartMode,
  selectCartSummary,
  selectCartUpdatingItemId,
  updateBackendCartItem,
  updateCartItemQuantity,
} from '../store/slices/cartSlice.js';
import { selectIsAuthenticated } from '../store/slices/authSlice.js';
import { selectAllProducts } from '../store/slices/productSlice.js';
import { getCheckoutLoginState } from '../utils/authRedirect.js';

function getItemStock(item, products) {
  const product = products.find((candidate) => candidate.id === item.productId);
  const variant = product?.variants.find((candidate) => candidate.id === item.variantId);
  const size = variant?.sizes.find((candidate) => candidate.name === item.size || candidate.name === item.selectedSize);
  return size?.stock || item.availableStock || item.maxStock || 1;
}

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const mode = useSelector(selectCartMode);
  const summary = useSelector(selectCartSummary);
  const updatingItemId = useSelector(selectCartUpdatingItemId);
  const products = useSelector(selectAllProducts);
  const totals = mode === 'authenticated' ? summary : getCartTotals(items);
  const hasUnavailableItems = items.some((item) => item.available === false);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleClearCart = () => {
    if (!window.confirm('Clear every item from your Amorah bag?')) {
      return;
    }

    if (mode === 'authenticated') {
      dispatch(clearBackendCart());
    } else {
      dispatch(clearCart());
    }

    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: getCheckoutLoginState('/checkout') });
      return;
    }

    navigate('/checkout');
  };

  return (
    <>
      <Seo
        title="Cart | Amorah "
        description="Review your Amorah shopping bag, edit quantities and proceed to secure checkout."
        path="/cart"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Cart', path: '/cart' },
        ]}
      />
      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-terracotta">Shopping bag</p>
              <h1 className="mt-2 font-heading text-4xl font-semibold text-amorah-maroon min-[380px]:text-5xl sm:text-6xl">Your Amorah Bag</h1>
            </div>
            <Link
              to="/shop"
              className="amorah-focus text-sm font-semibold uppercase tracking-[0.16em] text-amorah-brown hover:text-amorah-black"
            >
              Continue Shopping
            </Link>
            {items.length > 0 ? (
              <Button variant="outline" onClick={handleClearCart}>
                Clear Cart
              </Button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <EmptyState
              className="mt-8"
              title="Your Amorah Bag is Waiting"
              description="Discover cotton comfort and elegant ethnic styles made for you."
              actionLabel="Continue Shopping"
              onAction={() => navigate('/shop')}
            />
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
              <section className="min-w-0 border border-amorah-border bg-amorah-white px-3 min-[380px]:px-4 sm:px-6">
                {mode === 'authenticated' ? (
                  <div className="border-b border-amorah-border py-4 text-sm text-amorah-brown">
                    Prices and availability are updated automatically.
                    {hasUnavailableItems ? (
                      <span className="ml-1 font-semibold text-amorah-error">
                        Remove unavailable items before checkout.
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {items.map((item) => {
                  const maxStock = getItemStock(item, products);
                  return (
                    <CartItem
                      key={item.id}
                      item={item}
                      maxStock={maxStock}
                      updating={updatingItemId === item.id}
                      onQuantityChange={(quantity) => {
                        if (quantity === 0) {
                          if (mode === 'authenticated') {
                            dispatch(removeBackendCartItem(item.id));
                          } else {
                            dispatch(removeFromCart(item.id));
                          }
                          return;
                        }

                        if (mode === 'authenticated') {
                          dispatch(updateBackendCartItem({ itemId: item.id, quantity }));
                        } else {
                          dispatch(updateCartItemQuantity({ itemId: item.id, quantity, maxStock }));
                        }
                      }}
                      onRemove={() => {
                        if (mode === 'authenticated') {
                          dispatch(removeBackendCartItem(item.id));
                        } else {
                          dispatch(removeFromCart(item.id));
                        }
                        toast.success('Removed from cart');
                      }}
                    />
                  );
                })}
              </section>

              <aside className="space-y-4 lg:sticky lg:top-36">
                <section className="border border-amorah-border bg-amorah-light p-4">
                  <h2 className="font-heading text-2xl font-semibold text-amorah-maroon">Checkout note</h2>
                  <p className="mt-2 text-sm leading-6 text-amorah-brown">
                    Final prices, stock and delivery totals are recalculated by Amorah before Razorpay payment.
                  </p>
                </section>
                <CartSummary totals={totals} onCheckout={handleCheckout} />
              </aside>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}

export default CartPage;
