import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary.jsx';
import { getCartTotals } from '../components/cart/cartTotals.js';
import { getSavedAddresses } from '../services/addressService.js';
import { createCheckoutPreview } from '../services/checkoutService.js';
import {
  createRazorpayOrder,
  getRazorpayPaymentStatus,
  verifyRazorpayPayment,
} from '../services/paymentService.js';
import { clearAuthUser, selectAuth } from '../store/slices/authSlice.js';
import {
  fetchBackendCart,
  selectCartItems,
  selectCartMode,
  selectCartSummary,
  switchToGuestCart,
} from '../store/slices/cartSlice.js';
import {
  selectCheckout,
  setBillingAddress,
  setCheckoutError,
  setCheckoutNotes,
  setCheckoutStatus,
  setLastOrder,
  setShippingAddress,
} from '../store/slices/checkoutSlice.js';
import {
  CHECKOUT_LOGIN_MESSAGE,
  getCheckoutLoginState,
  getLocationPath,
  isUnauthorizedError,
} from '../utils/authRedirect.js';
import { loadRazorpayCheckout } from '../utils/loadRazorpayCheckout.js';
import { loadCartState } from '../utils/storage.js';

function formatAddress(address) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');
}

function safeErrors(error) {
  if (!error?.errors?.length) {
    return [];
  }

  return error.errors.map((item) => {
    if (typeof item === 'string') {
      return item;
    }

    return item.message || item.msg || 'This checkout detail needs attention.';
  });
}

function createPaymentAttemptKey() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  const random = window.crypto?.getRandomValues ? window.crypto.getRandomValues(new Uint32Array(4)) : [];
  const suffix = Array.from(random).map((value) => value.toString(36)).join('');

  return `amorah_${Date.now().toString(36)}_${suffix || Math.random().toString(36).slice(2)}`;
}

function AddressOption({ address, checked, name, onChange }) {
  return (
    <label
      className={`amorah-focus block cursor-pointer border p-4 transition ${
        checked ? 'border-amorah-maroon bg-amorah-light' : 'border-amorah-border bg-amorah-white hover:border-amorah-rose'
      }`}
    >
      <span className="flex items-start gap-3">
        <input
          type="radio"
          name={name}
          value={address.id}
          checked={checked}
          onChange={() => onChange(address.id)}
          className="mt-1 h-4 w-4 accent-amorah-maroon"
        />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-amorah-black">{address.fullName}</span>
            {address.isDefault ? (
              <span className="border border-amorah-rose bg-amorah-beige px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-amorah-brown">
                Default
              </span>
            ) : null}
          </span>
          <span className="mt-2 block text-sm leading-6 text-amorah-brown">{formatAddress(address)}</span>
          <span className="mt-2 block text-sm font-semibold text-amorah-black">+91 {address.mobile}</span>
        </span>
      </span>
    </label>
  );
}

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector(selectAuth);
  const cartItems = useSelector(selectCartItems);
  const cartMode = useSelector(selectCartMode);
  const cartSummary = useSelector(selectCartSummary);
  const cartInitialized = useSelector((state) => state.cart.initialized);
  const checkout = useSelector(selectCheckout);
  const fallbackTotals = useMemo(
    () => (cartMode === 'authenticated' ? cartSummary : getCartTotals(cartItems)),
    [cartItems, cartMode, cartSummary],
  );
  const cartSignature = useMemo(
    () => cartItems.map((item) => `${item.productId}:${item.variantId}:${item.sizeId}:${item.quantity}`).join('|'),
    [cartItems],
  );

  const [addresses, setAddresses] = useState([]);
  const [addressStatus, setAddressStatus] = useState('idle');
  const [addressError, setAddressError] = useState('');
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddressId, setBillingAddressId] = useState('');
  const [customerNotes, setCustomerNotes] = useState(checkout.notes || '');
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [paymentState, setPaymentState] = useState('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentOrderNumber, setPaymentOrderNumber] = useState('');
  const idempotencyKeyRef = useRef(null);
  const checkoutOpenRef = useRef(false);
  const authRedirectedRef = useRef(false);

  const previewTotals = preview?.summary || fallbackTotals;
  const previewItems = preview?.items || cartItems;
  const canRequestPreview =
    auth.isAuthenticated &&
    cartItems.length > 0 &&
    shippingAddressId &&
    (billingSameAsShipping || billingAddressId);
  const previewLoading = checkout.status === 'loading';
  const errorMessages = safeErrors(previewError);
  const paymentBusy = ['creating', 'opening', 'waiting', 'verifying'].includes(paymentState);

  const handleUnauthorizedCheckout = useCallback(
    (error) => {
      if (!isUnauthorizedError(error)) {
        return false;
      }

      if (!authRedirectedRef.current) {
        authRedirectedRef.current = true;
        dispatch(clearAuthUser());
        dispatch(switchToGuestCart(loadCartState()));
        toast.error(CHECKOUT_LOGIN_MESSAGE);
        navigate('/login', {
          replace: true,
          state: getCheckoutLoginState(getLocationPath(location)),
        });
      }

      return true;
    },
    [dispatch, location, navigate],
  );

  const priceUpdates = useMemo(() => {
    if (!preview) {
      return [];
    }

    return preview.items
      .map((item) => {
        const cartItem = cartItems.find(
          (current) =>
            current.productId === item.productId &&
            current.variantId === item.variantId &&
            current.sizeId === item.sizeId,
        );

        if (!cartItem || Number(cartItem.unitPrice) === Number(item.unitPrice)) {
          return null;
        }

        return `${item.productName} is now priced at the backend-approved amount.`;
      })
      .filter(Boolean);
  }, [cartItems, preview]);

  useEffect(() => {
    if (auth.status !== 'loading' && !auth.isAuthenticated) {
      navigate('/login', { replace: true, state: getCheckoutLoginState(getLocationPath(location)) });
    }
  }, [auth.isAuthenticated, auth.status, location, navigate]);

  useEffect(() => {
    if (cartInitialized && cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartInitialized, cartItems.length, navigate]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return undefined;
    }

    let ignore = false;
    setAddressStatus('loading');
    setAddressError('');

    getSavedAddresses()
      .then((items) => {
        if (ignore) {
          return;
        }

        setAddresses(items);
        setAddressStatus('succeeded');

        const defaultAddress = items.find((item) => item.isDefault) || items[0];
        if (defaultAddress) {
          setShippingAddressId((current) => current || defaultAddress.id);
          setBillingAddressId((current) => current || defaultAddress.id);
        }
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        if (handleUnauthorizedCheckout(error)) {
          return;
        }

        setAddressError(error.message || 'Unable to load saved addresses');
        setAddressStatus('failed');
      });

    return () => {
      ignore = true;
    };
  }, [auth.isAuthenticated, handleUnauthorizedCheckout]);

  useEffect(() => {
    if (!canRequestPreview) {
      setPreview(null);
      return undefined;
    }

    let ignore = false;
    const timeout = window.setTimeout(() => {
      dispatch(setCheckoutStatus('loading'));
      dispatch(setCheckoutError(null));
      setPreviewError(null);

      createCheckoutPreview({
        shippingAddressId,
        billingSameAsShipping,
        billingAddressId,
        customerNotes,
      })
        .then((nextPreview) => {
          if (ignore) {
            return;
          }

          setPreview(nextPreview);
          dispatch(setShippingAddress(nextPreview.shippingAddress));
          dispatch(setBillingAddress(nextPreview.billingAddress));
          dispatch(setCheckoutNotes(nextPreview.customerNotes));
          dispatch(setCheckoutStatus('succeeded'));
        })
        .catch((error) => {
          if (ignore) {
            return;
          }

          if (handleUnauthorizedCheckout(error)) {
            return;
          }

          setPreview(null);
          setPreviewError(error);
          dispatch(setCheckoutError(error.message || 'Unable to create checkout preview'));
          dispatch(setCheckoutStatus('failed'));
        });
    }, 350);

    return () => {
      ignore = true;
      window.clearTimeout(timeout);
    };
  }, [
    billingAddressId,
    billingSameAsShipping,
    canRequestPreview,
    cartSignature,
    customerNotes,
    dispatch,
    handleUnauthorizedCheckout,
    shippingAddressId,
  ]);

  async function reconcilePaymentStatus(orderNumber) {
    const status = await getRazorpayPaymentStatus(orderNumber);

    if (status.paymentStatus === 'paid' && status.orderStatus === 'confirmed') {
      dispatch(fetchBackendCart());
      navigate(`/order-success/${orderNumber}`, { replace: true });
      return status;
    }

    setPaymentState(status.paymentStatus === 'failed' ? 'failed' : 'processing');
    setPaymentMessage(status.message || 'Your payment is being processed.');
    return status;
  }

  async function handleVerifiedOrder(order) {
    dispatch(setLastOrder(order));

    if (order.paymentStatus === 'paid' && order.orderStatus === 'confirmed') {
      idempotencyKeyRef.current = null;
      dispatch(fetchBackendCart());
      setPaymentState('confirmed');
      navigate(`/order-success/${order.orderNumber}`, { replace: true });
      return;
    }

    setPaymentState(order.paymentStatus === 'failed' ? 'failed' : 'processing');
    setPaymentMessage(order.message || 'Your payment is being processed.');
  }

  async function handlePayment(event) {
    event.preventDefault();

    if (paymentBusy || checkoutOpenRef.current) {
      return;
    }

    if (!preview) {
      toast.error('Please wait for the secure checkout preview to load.');
      return;
    }

    if (!shippingAddressId || (!billingSameAsShipping && !billingAddressId)) {
      toast.error('Please select your checkout address.');
      return;
    }

    if (!idempotencyKeyRef.current || paymentState === 'failed') {
      idempotencyKeyRef.current = createPaymentAttemptKey();
    }

    let paymentConfig;

    try {
      setPaymentState('creating');
      setPaymentMessage('Creating secure Razorpay order...');
      paymentConfig = await createRazorpayOrder({
        shippingAddressId,
        billingSameAsShipping,
        billingAddressId,
        customerNotes,
        idempotencyKey: idempotencyKeyRef.current,
      });
      setPaymentOrderNumber(paymentConfig.orderNumber);

      setPaymentState('opening');
      setPaymentMessage('Opening Razorpay Checkout...');
      const Razorpay = await loadRazorpayCheckout();
      checkoutOpenRef.current = true;
      let handlerCompleted = false;

      const razorpay = new Razorpay({
        key: paymentConfig.keyId,
        amount: paymentConfig.amount,
        currency: paymentConfig.currency,
        name: paymentConfig.companyName,
        description: paymentConfig.description,
        image: paymentConfig.logoUrl || undefined,
        order_id: paymentConfig.razorpayOrderId,
        prefill: paymentConfig.prefill,
        theme: {
          color: '#672F3B',
        },
        modal: {
          ondismiss: () => {
            checkoutOpenRef.current = false;
            if (!handlerCompleted) {
              setPaymentState('dismissed');
              setPaymentMessage('Payment was not completed. Your cart is still available.');
              toast('Payment was not completed. Your cart is still available.');
            }
          },
        },
        handler: async (response) => {
          handlerCompleted = true;
          checkoutOpenRef.current = false;
          setPaymentState('verifying');
          setPaymentMessage('Verifying your payment securely...');

          try {
            const order = await verifyRazorpayPayment({
              orderNumber: paymentConfig.orderNumber,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await handleVerifiedOrder(order);
          } catch (error) {
            if (handleUnauthorizedCheckout(error)) {
              return;
            }

            try {
              await reconcilePaymentStatus(paymentConfig.orderNumber);
            } catch (statusError) {
              if (handleUnauthorizedCheckout(statusError)) {
                return;
              }

              setPaymentState(error.status === 408 ? 'processing' : 'failed');
              setPaymentMessage(
                error.status === 408
                  ? 'Your payment is being processed. Please check status again shortly.'
                  : error.message || 'Unable to verify payment.',
              );
            }
          }
        },
      });

      setPaymentState('waiting');
      setPaymentMessage('Complete payment in the Razorpay window.');
      razorpay.open();
    } catch (error) {
      checkoutOpenRef.current = false;

      if (handleUnauthorizedCheckout(error)) {
        return;
      }

      if (paymentConfig?.orderNumber) {
        try {
          await reconcilePaymentStatus(paymentConfig.orderNumber);
          return;
        } catch (statusError) {
          if (handleUnauthorizedCheckout(statusError)) {
            return;
          }

          // Use the original error below.
        }
      }

      setPaymentState('failed');
      setPaymentMessage(error.message || 'Unable to start secure payment.');
      toast.error(error.message || 'Unable to start secure payment.');
    }
  }

  return (
    <>
      <Seo
        title="Checkout | Amorah by N-ZAN Designs"
        description="Complete your Amorah checkout with saved addresses and a backend-validated Razorpay preview."
        path="/checkout"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Cart', path: '/cart' },
          { name: 'Checkout', path: '/checkout' },
        ]}
      />

      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(360px,0.4fr)] lg:items-start">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">
                  Secure checkout
                </p>
                <h1 className="mt-2 font-heading text-5xl font-semibold text-amorah-maroon sm:text-6xl">
                  Complete Your Order
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-amorah-brown">
                  Your cart, prices, stock and delivery totals are revalidated by Amorah before payment begins.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handlePayment} noValidate>
                <section className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Step 1</p>
                      <h2 className="mt-2 font-heading text-2xl font-semibold text-amorah-black">Shipping address</h2>
                    </div>
                    <Link
                      to="/account/addresses"
                      className="amorah-focus text-xs font-semibold uppercase tracking-[0.16em] text-amorah-brown hover:text-amorah-black"
                    >
                      Manage addresses
                    </Link>
                  </div>

                  {addressStatus === 'loading' ? (
                    <p className="mt-5 text-sm text-amorah-brown">Loading saved addresses...</p>
                  ) : null}
                  {addressError ? <p className="mt-5 text-sm font-semibold text-amorah-error">{addressError}</p> : null}
                  {addressStatus === 'succeeded' && addresses.length === 0 ? (
                    <EmptyState
                      className="mt-5"
                      title="Add a saved address"
                      description="Checkout uses saved customer addresses so the backend can verify ownership before payment."
                      actionLabel="Go to Addresses"
                      onAction={() => navigate('/account/addresses')}
                    />
                  ) : null}
                  {addresses.length > 0 ? (
                    <div className="mt-5 grid gap-3">
                      {addresses.map((address) => (
                        <AddressOption
                          key={address.id}
                          address={address}
                          checked={shippingAddressId === address.id}
                          name="shippingAddress"
                          onChange={setShippingAddressId}
                        />
                      ))}
                    </div>
                  ) : null}
                </section>

                <section className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Step 2</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-amorah-black">Billing address</h2>
                  <label className="mt-5 flex items-start gap-3 text-sm font-semibold text-amorah-black">
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                      className="mt-1 h-4 w-4 accent-amorah-maroon"
                    />
                    Use the same address for billing
                  </label>
                  {!billingSameAsShipping && addresses.length > 0 ? (
                    <div className="mt-5 grid gap-3">
                      {addresses.map((address) => (
                        <AddressOption
                          key={address.id}
                          address={address}
                          checked={billingAddressId === address.id}
                          name="billingAddress"
                          onChange={setBillingAddressId}
                        />
                      ))}
                    </div>
                  ) : null}
                </section>

                <section className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Step 3</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-amorah-black">Order notes</h2>
                  <label className="mt-5 block">
                    <span className="text-sm font-semibold text-amorah-black">Notes for delivery</span>
                    <textarea
                      className="mt-2 min-h-28 resize-y"
                      value={customerNotes}
                      maxLength={500}
                      onChange={(event) => setCustomerNotes(event.target.value)}
                      placeholder="Add delivery instructions or gifting notes."
                    />
                  </label>
                  <p className="mt-2 text-xs text-amorah-brown">{customerNotes.length}/500 characters</p>
                </section>

                <section className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Step 4</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-amorah-maroon">
                    Secure Online Payment with Razorpay
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2" aria-label="Accepted through Razorpay">
                    {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets'].map((label) => (
                      <span
                        key={label}
                        className="border border-amorah-border bg-amorah-light px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amorah-brown"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-amorah-brown">
                    Amorah confirms your order only after backend signature verification and captured payment confirmation.
                  </p>
                </section>

                {previewLoading ? (
                  <p className="border border-amorah-border bg-amorah-white p-4 text-sm font-semibold text-amorah-brown">
                    Refreshing secure checkout preview...
                  </p>
                ) : null}
                {previewError ? (
                  <section className="border border-amorah-error/30 bg-amorah-error/10 p-4 text-sm text-amorah-error">
                    <p className="font-semibold">{previewError.message}</p>
                    {errorMessages.length > 0 ? (
                      <ul className="mt-3 list-disc space-y-1 pl-5">
                        {errorMessages.map((message) => (
                          <li key={message}>{message}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ) : null}
                {priceUpdates.length > 0 ? (
                  <section className="border border-amorah-rose bg-amorah-beige p-4 text-sm text-amorah-brown">
                    {priceUpdates.map((message) => (
                      <p key={message}>{message}</p>
                    ))}
                  </section>
                ) : null}
                {paymentMessage ? (
                  <section className="border border-amorah-border bg-amorah-white p-4 text-sm text-amorah-brown">
                    <p className="font-semibold text-amorah-black">{paymentMessage}</p>
                    {paymentOrderNumber && ['processing', 'failed'].includes(paymentState) ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() =>
                          reconcilePaymentStatus(paymentOrderNumber).catch((error) => {
                            if (handleUnauthorizedCheckout(error)) {
                              return;
                            }

                            setPaymentState(error.status === 408 ? 'processing' : 'failed');
                            setPaymentMessage(
                              error.status === 408
                                ? 'Your payment is being processed. Please check status again shortly.'
                                : error.message || 'Unable to check payment status.',
                            );
                          })
                        }
                      >
                        Check Status
                      </Button>
                    ) : null}
                  </section>
                ) : null}

                <div className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
                  <Button
                    type="submit"
                    className="w-full"
                    loading={paymentBusy}
                    disabled={!preview || previewLoading || Boolean(previewError) || addressStatus !== 'succeeded'}
                  >
                    Pay Securely with Razorpay
                  </Button>
                  <p className="mt-3 text-center text-xs leading-5 text-amorah-brown">
                    Stock and cart changes happen only after Amorah verifies a captured Razorpay payment.
                  </p>
                </div>
              </form>
            </div>

            <CheckoutOrderSummary
              items={previewItems}
              totals={previewTotals}
              className="lg:sticky lg:top-32"
            />
          </div>
        </Container>
      </main>
    </>
  );
}

export default CheckoutPage;
