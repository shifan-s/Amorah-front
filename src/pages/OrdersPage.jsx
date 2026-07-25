import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../components/account/OrderCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import { getMyOrders } from '../services/orderService.js';

function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    setError('');

    getMyOrders()
      .then((data) => {
        if (!ignore) {
          setOrders(data.orders);
          setStatus('succeeded');
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(requestError.message || 'Unable to load orders');
          setStatus('failed');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Seo
        title="Orders | Amorah N-ZAN Designs"
        description="Review your Amorah order history and current order statuses."
        path="/account/orders"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Account', path: '/account' },
          { name: 'Orders', path: '/account/orders' },
        ]}
      />
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Order history</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-amorah-black">Orders</h1>
        {status === 'loading' ? <p className="mt-6 text-sm text-amorah-brown">Loading orders...</p> : null}
        {error ? <p className="mt-6 text-sm font-semibold text-amorah-error">{error}</p> : null}
        {status === 'succeeded' && orders.length === 0 ? (
          <EmptyState
            className="mt-6"
            title="No orders yet"
            description="Your confirmed Amorah orders will appear here after secure Razorpay payment is connected."
            actionLabel="Continue Shopping"
            onAction={() => navigate('/shop')}
          />
        ) : null}
        {orders.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.orderNumber} order={order} />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}

export default OrdersPage;
