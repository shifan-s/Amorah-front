import { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiPackage } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import { handleProductImageError } from '../components/product/productOptionUtils.js';
import { getOrderByNumber } from '../services/orderService.js';
import { formatINR } from '../utils/currency.js';

function AddressBlock({ address }) {
  if (!address) {
    return null;
  }

  return (
    <address className="not-italic text-sm leading-6 text-amorah-brown">
      <span className="block font-semibold text-amorah-black">{address.fullName}</span>
      <span className="block">{address.addressLine1}</span>
      {address.addressLine2 ? <span className="block">{address.addressLine2}</span> : null}
      {address.landmark ? <span className="block">{address.landmark}</span> : null}
      <span className="block">
        {address.city}, {address.state} {address.postalCode}
      </span>
      <span className="block">{address.country}</span>
      <span className="mt-2 block font-semibold text-amorah-black">+91 {address.mobile}</span>
    </address>
  );
}

function OrderSuccessPage() {
  const navigate = useNavigate();
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    setError('');

    getOrderByNumber(orderNumber)
      .then((data) => {
        if (!ignore) {
          setOrder(data);
          setStatus('succeeded');
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(requestError.message || 'Unable to load order');
          setStatus('failed');
        }
      });

    return () => {
      ignore = true;
    };
  }, [orderNumber]);

  const confirmed = order?.paymentStatus === 'paid' && order?.orderStatus === 'confirmed';
  const needsReview = order?.orderStatus === 'payment_review';
  const pendingOrFailed = order && !confirmed && !needsReview;

  return (
    <>
      <Seo
        title="Order Status | Amorah by N-ZAN Designs"
        description="View your Amorah order confirmation, payment status, delivery address and ordered products."
        path={`/order-success/${orderNumber || ''}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Order Status', path: `/order-success/${orderNumber || ''}` },
        ]}
      />

      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container>
          {status === 'loading' ? <p className="text-sm text-amorah-brown">Loading order...</p> : null}

          {error ? (
            <div className="mt-8">
              <EmptyState
                icon={<FiPackage aria-hidden="true" />}
                title="Order not found"
                description={error}
                actionLabel="View Orders"
                onAction={() => navigate('/account/orders')}
              />
            </div>
          ) : null}

          {order ? (
            <div className="mt-8 space-y-8">
              <section className="border border-amorah-border bg-amorah-white p-6 text-center sm:p-10">
                {confirmed ? (
                  <FiCheckCircle className="mx-auto text-5xl text-amorah-success" aria-hidden="true" />
                ) : (
                  <FiAlertCircle className="mx-auto text-5xl text-amorah-terracotta" aria-hidden="true" />
                )}
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">
                  Amorah secure payment
                </p>
                <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">
                  {confirmed ? 'Your order is confirmed' : 'Order needs attention'}
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-amorah-brown">
                  {confirmed
                    ? 'Your payment has been verified and your Amorah order is confirmed.'
                    : null}
                  {needsReview
                    ? 'Your payment was received, but the order needs review. Please contact Amorah support and provide your order number.'
                    : null}
                  {pendingOrFailed
                    ? 'This order is not confirmed yet. Please check the payment status from checkout or contact Amorah support.'
                    : null}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Badge variant={confirmed ? 'success' : 'rose'}>Order {order.orderNumber}</Badge>
                  <Badge>{order.paymentStatusLabel || order.paymentStatus}</Badge>
                </div>
              </section>

              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                <section className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
                  <h2 className="font-heading text-2xl font-semibold text-amorah-black">Ordered products</h2>
                  <div className="mt-5 divide-y divide-amorah-border">
                    {order.items.map((item) => (
                      <article key={`${item.productId}-${item.variantId}-${item.sizeId}`} className="grid grid-cols-[84px_1fr] gap-4 py-4 first:pt-0 last:pb-0">
                        {item.productImage?.url ? (
                          <img
                            src={item.productImage.url}
                            alt={item.productImage.alt || item.productName}
                            className="aspect-[3/4] w-full bg-amorah-light object-cover"
                            loading="lazy"
                            onError={handleProductImageError}
                          />
                        ) : (
                          <div className="aspect-[3/4] w-full bg-amorah-light" />
                        )}
                        <div>
                          <Link
                            to={`/product/${item.productSlug}`}
                            className="amorah-focus font-heading text-xl font-semibold text-amorah-black hover:text-amorah-brown"
                          >
                            {item.productName}
                          </Link>
                          <p className="mt-1 text-sm text-amorah-brown">
                            Size {item.size} / {item.colourName}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                            <span className="text-amorah-brown">Qty {item.quantity}</span>
                            <span className="font-semibold text-amorah-black">{formatINR(item.lineTotal)}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <aside className="space-y-4">
                  <section className="border border-amorah-border bg-amorah-white p-5">
                    <h2 className="font-heading text-2xl font-semibold text-amorah-black">Shipping address</h2>
                    <div className="mt-4">
                      <AddressBlock address={order.shippingAddress} />
                    </div>
                  </section>

                  <section className="border border-amorah-border bg-amorah-white p-5">
                    <h2 className="font-heading text-2xl font-semibold text-amorah-black">Order details</h2>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-amorah-brown">Payment status</dt>
                        <dd className="font-semibold text-amorah-black">{order.paymentStatusLabel || order.paymentStatus}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-amorah-brown">Order status</dt>
                        <dd className="font-semibold text-amorah-black">{order.orderStatusLabel || order.orderStatus}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-amorah-border pt-3 text-lg">
                        <dt className="font-semibold text-amorah-black">Total</dt>
                        <dd className="font-semibold text-amorah-black">{formatINR(order.totals.total)}</dd>
                      </div>
                    </dl>
                  </section>

                  <div className="grid gap-3">
                    <Button onClick={() => navigate(`/account/orders/${order.orderNumber}`)}>View Order</Button>
                    <Button variant="outline" onClick={() => navigate('/shop')}>
                      Continue Shopping
                    </Button>
                  </div>
                </aside>
              </div>
            </div>
          ) : null}
        </Container>
      </main>
    </>
  );
}

export default OrderSuccessPage;
