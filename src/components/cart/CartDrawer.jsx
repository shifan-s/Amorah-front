import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import IconButton from '../common/IconButton.jsx';
import { selectAllProducts } from '../../store/slices/productSlice.js';
import {
  removeBackendCartItem,
  removeFromCart,
  selectCartItems,
  selectCartMode,
  selectCartSummary,
  selectCartUpdatingItemId,
  updateBackendCartItem,
  updateCartItemQuantity,
} from '../../store/slices/cartSlice.js';
import { selectIsAuthenticated } from '../../store/slices/authSlice.js';
import { closeDrawer } from '../../store/slices/uiSlice.js';
import CartItem from './CartItem.jsx';
import CartSummary from './CartSummary.jsx';
import { getCartTotals } from './cartTotals.js';
import { trapFocus } from '../../utils/focusTrap.js';
import { getCheckoutLoginState } from '../../utils/authRedirect.js';

function getItemStock(item, products) {
  const product = products.find((candidate) => candidate.id === item.productId);
  const variant = product?.variants.find((candidate) => candidate.id === item.variantId);
  const size = variant?.sizes.find((candidate) => candidate.name === item.size || candidate.name === item.selectedSize);
  return size?.stock || item.availableStock || item.maxStock || 1;
}

function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const items = useSelector(selectCartItems);
  const mode = useSelector(selectCartMode);
  const summary = useSelector(selectCartSummary);
  const updatingItemId = useSelector(selectCartUpdatingItemId);
  const products = useSelector(selectAllProducts);
  const totals = useMemo(
    () => (mode === 'authenticated' ? summary : getCartTotals(items)),
    [items, mode, summary],
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      trapFocus(event, drawerRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-amorah-black/50 transition-opacity motion-reduce:transition-none ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close cart overlay"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        className={`amorah-focus fixed right-0 top-0 flex h-full w-full max-w-md flex-col bg-amorah-ivory transition-transform duration-200 motion-reduce:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={open ? -1 : undefined}
      >
        <div className="flex items-center justify-between gap-4 border-b border-amorah-border p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amorah-brown">Amorah cart</p>
            <h2 className="font-heading text-2xl font-semibold text-amorah-black">Your Bag</h2>
          </div>
          <IconButton label="Close cart" variant="ghost" size="sm" onClick={onClose}>
            <IoClose aria-hidden="true" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Add your favourite Amorah pieces and they will appear here."
              actionLabel="Continue Shopping"
              onAction={() => {
                onClose();
                navigate('/shop');
              }}
            />
          ) : (
            <>
              <div>
                {items.map((item) => {
                  const maxStock = getItemStock(item, products);
                  return (
                    <CartItem
                      key={item.id}
                      item={item}
                      maxStock={maxStock}
                      updating={updatingItemId === item.id}
                      compact
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
                          return;
                        }

                        dispatch(updateCartItemQuantity({ itemId: item.id, quantity, maxStock }));
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
              </div>
            </>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-amorah-border bg-amorah-ivory p-5">
            <CartSummary
              totals={totals}
              showViewCart
              onCheckout={() => {
                dispatch(closeDrawer('cart'));
                if (!isAuthenticated) {
                  navigate('/login', { state: getCheckoutLoginState('/checkout') });
                  return;
                }

                navigate('/checkout');
              }}
            />
          </div>
        ) : null}
      </aside>
    </div>
  );
}

CartDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CartDrawer;
