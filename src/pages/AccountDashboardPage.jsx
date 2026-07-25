import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccountSummaryCard from '../components/account/AccountSummaryCard.jsx';
import AddressCard from '../components/account/AddressCard.jsx';
import OrderCard from '../components/account/OrderCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import { getMyOrders } from '../services/orderService.js';
import { selectCurrentUser } from '../store/slices/authSlice.js';
import { selectWishlistCount } from '../store/slices/wishlistSlice.js';

function AccountDashboardPage() {
  const user = useSelector(selectCurrentUser);
  const wishlistCount = useSelector(selectWishlistCount);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersStatus, setOrdersStatus] = useState('loading');
  const defaultAddress = (user?.addresses || []).find((address) => address.isDefault) || user?.addresses?.[0];
  const completion = user?.fullName && user?.email && user?.mobile ? 100 : 70;

  useEffect(() => {
    let ignore = false;
    setOrdersStatus('loading');

    getMyOrders({ limit: 2 })
      .then((data) => {
        if (!ignore) {
          setRecentOrders(data.orders);
          setOrdersStatus('succeeded');
        }
      })
      .catch(() => {
        if (!ignore) {
          setOrdersStatus('failed');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Seo
        title="Account Dashboard | Amorah"
        description="View your Amorah account overview, recent orders, wishlist count and default address."
        path="/account"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Account', path: '/account' },
        ]}
      />
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-terracotta">My account</p>
        <h1 className="mt-2 font-heading text-5xl font-semibold text-amorah-maroon">Hello, {user?.fullName || 'Amorah Customer'}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <AccountSummaryCard label="Recent orders" value={recentOrders.length} helper="Confirmed Amorah history" />
          <AccountSummaryCard label="Wishlist" value={wishlistCount} helper="Saved Amorah pieces" />
          <AccountSummaryCard label="Profile completion" value={`${completion}%`} helper="Keep your details current" />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold">Recent orders</h2>
              <Link className="amorah-focus text-sm font-semibold text-amorah-brown hover:text-amorah-black" to="/account/orders">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {ordersStatus === 'loading' ? <p className="text-sm text-amorah-brown">Loading recent orders...</p> : null}
              {recentOrders.map((order) => (
                <OrderCard key={order.orderNumber} order={order} />
              ))}
              {ordersStatus === 'succeeded' && recentOrders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="Your recent orders will appear here after secure Razorpay payment is connected."
                />
              ) : null}
              {ordersStatus === 'failed' ? (
                <p className="text-sm font-semibold text-amorah-error">Unable to load recent orders.</p>
              ) : null}
            </div>
          </section>
          <section>
            <h2 className="mb-4 font-heading text-2xl font-semibold">Default address</h2>
            {defaultAddress ? (
              <AddressCard address={defaultAddress} />
            ) : (
              <EmptyState title="No saved address" description="Add a saved address before checkout." />
            )}
          </section>
        </div>
      </section>
    </>
  );
}

export default AccountDashboardPage;
