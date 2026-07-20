import PropTypes from 'prop-types';

const statusStyles = {
  'Pending Payment': 'border-amorah-error/20 bg-amorah-error/10 text-amorah-error',
  'Payment Failed': 'border-amorah-error/20 bg-amorah-error/10 text-amorah-error',
  'Payment Review': 'border-amorah-rose bg-amorah-beige text-amorah-black',
  Paid: 'border-amorah-success/20 bg-amorah-success/10 text-amorah-success',
  Confirmed: 'border-amorah-rose bg-amorah-beige text-amorah-black',
  Processing: 'border-amorah-border bg-amorah-light text-amorah-brown',
  Packed: 'border-amorah-border bg-amorah-light text-amorah-brown',
  Shipped: 'border-amorah-rose bg-amorah-beige text-amorah-black',
  'Out for Delivery': 'border-amorah-success/20 bg-amorah-success/10 text-amorah-success',
  Delivered: 'border-amorah-success/20 bg-amorah-success/10 text-amorah-success',
  Cancelled: 'border-amorah-error/20 bg-amorah-error/10 text-amorah-error',
  Returned: 'border-amorah-border bg-amorah-light text-amorah-brown',
  Refunded: 'border-amorah-border bg-amorah-light text-amorah-brown',
  'Refund Required': 'border-amorah-rose bg-amorah-beige text-amorah-black',
  'Refund Processing': 'border-amorah-rose bg-amorah-beige text-amorah-black',
  'Refund Needs Assistance': 'border-amorah-error/20 bg-amorah-error/10 text-amorah-error',
};

function OrderStatusBadge({ status }) {
  return (
    <span className={`inline-flex border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusStyles[status] || statusStyles.Processing}`}>
      {status}
    </span>
  );
}

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default OrderStatusBadge;
