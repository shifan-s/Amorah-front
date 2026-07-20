import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatINR } from '../../utils/currency.js';
import OrderStatusBadge from './OrderStatusBadge.jsx';

function OrderCard({ order }) {
  const orderNumber = order.orderNumber || order.id;
  const total = order.total || 0;
  const createdAt = order.createdAt || order.date;
  const status = order.orderStatusLabel || order.status || 'Pending Payment';
  const itemCount = order.itemCount || order.items?.length || 0;
  const refundStatus =
    order.refund?.status === 'required'
      ? 'Refund Required'
      : ['initiating', 'pending'].includes(order.refund?.status)
        ? 'Refund Processing'
        : order.refund?.status === 'processed'
          ? 'Refunded'
          : order.refund?.status === 'failed'
            ? 'Refund Needs Assistance'
            : '';

  return (
    <article className="border border-amorah-border bg-amorah-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {order.productThumbnail?.url ? (
            <img
              src={order.productThumbnail.url}
              alt={order.productThumbnail.alt || `Order ${orderNumber}`}
              className="h-20 w-16 bg-amorah-light object-cover"
              loading="lazy"
            />
          ) : null}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-brown">Order {orderNumber}</p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-amorah-black">{formatINR(total)}</h2>
            <p className="mt-1 text-sm text-amorah-brown">{new Date(createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={status} />
          {refundStatus ? <OrderStatusBadge status={refundStatus} /> : null}
        </div>
      </div>
      <p className="mt-4 text-sm text-amorah-brown">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} / Razorpay online payment
      </p>
      <Link
        to={`/account/orders/${orderNumber}`}
        className="amorah-focus mt-4 inline-flex text-sm font-semibold uppercase tracking-[0.14em] text-amorah-brown hover:text-amorah-black"
      >
        View Details
      </Link>
    </article>
  );
}

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderCard;
