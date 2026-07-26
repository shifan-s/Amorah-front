import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import OrderStatusBadge from '../components/account/OrderStatusBadge.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import Modal from '../components/common/Modal.jsx';
import { cancelMyOrder, downloadOrderInvoice, getOrderByNumber, reportOrderIssue } from '../services/orderService.js';
import { formatINR } from '../utils/currency.js';

function AddressBlock({ title, address }) {
  if (!address) {
    return null;
  }

  return (
    <section className="border border-amorah-border bg-amorah-white p-5">
      <h2 className="font-heading text-2xl font-semibold text-amorah-black">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-amorah-brown">
        {address.fullName}
        <br />
        {address.addressLine1}
        {address.addressLine2 ? (
          <>
            <br />
            {address.addressLine2}
          </>
        ) : null}
        {address.landmark ? (
          <>
            <br />
            {address.landmark}
          </>
        ) : null}
        <br />
        {address.city}, {address.state} {address.postalCode}
        <br />
        {address.country}
      </p>
      <p className="mt-3 text-sm font-semibold text-amorah-black">+91 {address.mobile}</p>
    </section>
  );
}

function RefundStatusBlock({ refund }) {
  if (!refund || refund.status === 'none') {
    return null;
  }

  return (
    <section className="border border-amorah-border bg-amorah-white p-5">
      <h2 className="font-heading text-2xl font-semibold text-amorah-black">Refund status</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-amorah-brown">Status</dt>
          <dd className="font-semibold text-amorah-black">{refund.status}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-amorah-brown">Amount</dt>
          <dd className="font-semibold text-amorah-black">{formatINR(refund.amount)}</dd>
        </div>
        {refund.initiatedAt ? (
          <div className="flex justify-between gap-4">
            <dt className="text-amorah-brown">Initiated</dt>
            <dd className="font-semibold text-amorah-black">{new Date(refund.initiatedAt).toLocaleDateString('en-IN')}</dd>
          </div>
        ) : null}
        {refund.processedAt ? (
          <div className="flex justify-between gap-4">
            <dt className="text-amorah-brown">Processed</dt>
            <dd className="font-semibold text-amorah-black">{new Date(refund.processedAt).toLocaleDateString('en-IN')}</dd>
          </div>
        ) : null}
        {refund.acquirerReference ? (
          <div className="flex justify-between gap-4">
            <dt className="text-amorah-brown">Bank reference</dt>
            <dd className="font-semibold text-amorah-black">{refund.acquirerReference}</dd>
          </div>
        ) : null}
      </dl>
      {refund.safeMessage ? <p className="mt-4 text-sm leading-6 text-amorah-brown">{refund.safeMessage}</p> : null}
    </section>
  );
}

function OrderDetailsPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState('idle');
  const [invoiceError, setInvoiceError] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [issueOpen, setIssueOpen] = useState(false);
  const [issue, setIssue] = useState({ productId: '', issueType: '', explanation: '' });
  const [actionBusy, setActionBusy] = useState(false);

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
          setError(requestError.message || 'Order not found');
          setStatus('failed');
        }
      });

    return () => {
      ignore = true;
    };
  }, [orderNumber]);

  if (status === 'loading') {
    return <p className="text-sm text-amorah-brown">Loading order...</p>;
  }

  if (error || !order) {
    return (
      <>
        <Seo
          title="Order Not Found | Amorah N-ZAN Designs"
          description="The requested Amorah order could not be found."
          path={`/account/orders/${orderNumber || 'not-found'}`}
          breadcrumbs={[
            { name: 'Home', path: '/' },
            { name: 'Account', path: '/account' },
            { name: 'Orders', path: '/account/orders' },
          ]}
        />
        <EmptyState title="Order not found" description={error || 'We could not find that order.'} />
      </>
    );
  }

  const handleInvoiceDownload = async () => {
    setInvoiceStatus('downloading');
    setInvoiceError('');

    try {
      await downloadOrderInvoice(order.orderNumber);
      setInvoiceStatus('succeeded');
    } catch (downloadError) {
      setInvoiceError(downloadError.message || 'Invoice download failed.');
      setInvoiceStatus('failed');
    }
  };
  const cancellable = ['pending_payment', 'confirmed', 'processing', 'packed'].includes(order.orderStatus);
  const dispatched = ['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus);
  const handleCancel = async () => {
    setActionBusy(true);
    try {
      const response = await cancelMyOrder(order.orderNumber, cancelReason);
      toast.success(response.message);
      setCancelOpen(false);
      setOrder(await getOrderByNumber(order.orderNumber));
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setActionBusy(false);
    }
  };
  const handleIssue = async () => {
    setActionBusy(true);
    try {
      const response = await reportOrderIssue(order.orderNumber, issue);
      toast.success(response.message);
      setIssueOpen(false);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <>
      <Seo
        title={`${order.orderNumber} | Amorah N-ZAN Designs`}
        description={`View Amorah order ${order.orderNumber}, payment method, status and ordered items.`}
        path={`/account/orders/${order.orderNumber}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Account', path: '/account' },
          { name: 'Orders', path: '/account/orders' },
          { name: order.orderNumber, path: `/account/orders/${order.orderNumber}` },
        ]}
      />
      <section>
        <Link className="amorah-focus text-sm font-semibold text-amorah-brown hover:text-amorah-black" to="/account/orders">
          Back to orders
        </Link>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Order details</p>
            <h1 className="mt-2 font-heading text-4xl font-semibold text-amorah-black">{order.orderNumber}</h1>
            <p className="mt-2 text-sm text-amorah-brown">
              {new Date(order.createdAt).toLocaleDateString('en-IN')} / Razorpay online payment
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <OrderStatusBadge status={order.orderStatusLabel || order.orderStatus} />
            {order.invoice?.available ? (
              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleInvoiceDownload}
                  disabled={invoiceStatus === 'downloading'}
                  className="amorah-focus inline-flex min-h-11 w-full items-center justify-center border border-amorah-maroon px-5 text-sm font-semibold uppercase tracking-[0.14em] text-amorah-maroon transition hover:bg-amorah-maroon hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {invoiceStatus === 'downloading' ? 'Downloading...' : 'Download Invoice'}
                </button>
                {invoiceError ? <p className="mt-2 text-sm text-amorah-error">{invoiceError}</p> : null}
              </div>
            ) : null}
            {cancellable ? <button type="button" onClick={() => setCancelOpen(true)} className="amorah-focus min-h-11 border border-amorah-maroon px-5 text-sm font-semibold text-amorah-maroon">Cancel Order</button> : null}
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="border border-amorah-border bg-amorah-white p-5">
            <h2 className="font-heading text-2xl font-semibold">Items</h2>
            <div className="mt-4 divide-y divide-amorah-border">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.variantId}-${item.sizeId}`} className="grid grid-cols-[64px_1fr_auto] gap-4 py-4 text-sm">
                  {item.productImage?.url ? (
                    <img
                      src={item.productImage.url}
                      alt={item.productImage.alt || item.productName}
                      className="aspect-[3/4] w-full bg-amorah-light object-cover"
                    />
                  ) : (
                    <div className="aspect-[3/4] w-full bg-amorah-light" />
                  )}
                  <div>
                    <p className="font-semibold text-amorah-black">{item.productName}</p>
                    <p className="mt-1 text-amorah-brown">
                      Size {item.size} / {item.colourName} / Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-amorah-black">{formatINR(item.lineTotal)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3 border-t border-amorah-border pt-4 text-sm">
              <div className="flex justify-between gap-4 text-amorah-brown">
                <span>Subtotal</span>
                <span>{formatINR(order.totals.subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4 text-amorah-brown">
                <span>Shipping</span>
                <span>{order.totals.shippingCharge === 0 ? 'Free' : formatINR(order.totals.shippingCharge)}</span>
              </div>
              <div className="flex justify-between gap-4 text-amorah-brown">
                <span>Tax</span>
                <span>{formatINR(order.totals.tax)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-amorah-border pt-3 font-semibold text-amorah-black">
                <span>Total</span>
                <span>{formatINR(order.totals.total)}</span>
              </div>
            </div>
          </section>
          <div className="space-y-6">
            <RefundStatusBlock refund={order.refund} />
            <AddressBlock title="Shipping address" address={order.shippingAddress} />
            <AddressBlock title="Billing address" address={order.billingAddress} />
          </div>
        </div>
        <div className="mt-6 border border-amorah-border bg-amorah-light p-4 text-sm leading-6 text-amorah-brown">
          Orders cannot be cancelled after dispatch. Change-of-mind returns are not accepted. Damaged, defective or incorrect items may be reported for review.
          {dispatched ? <button type="button" onClick={() => { setIssue((current) => ({ ...current, productId: order.items[0]?.productId || '' })); setIssueOpen(true); }} className="ml-2 font-semibold text-amorah-maroon">Report an Issue</button> : null}
        </div>
        <Modal open={cancelOpen} onClose={() => !actionBusy && setCancelOpen(false)} title="Cancel order">
          <div className="space-y-4"><p>Are you sure you want to cancel order {order.orderNumber}?</p><p>This action cannot be reversed. A refund will be initiated for this successfully paid Razorpay order.</p><label className="block font-semibold">Cancellation reason<textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} maxLength={500} className="mt-1 w-full border border-amorah-border p-3" /></label><div className="flex justify-end gap-3"><button disabled={actionBusy} onClick={() => setCancelOpen(false)} className="min-h-11 border border-amorah-border px-4">Keep Order</button><button disabled={actionBusy || !cancelReason.trim()} onClick={handleCancel} className="min-h-11 bg-amorah-maroon px-4 font-semibold text-white disabled:opacity-50">{actionBusy ? 'Cancelling…' : 'Cancel Order'}</button></div></div>
        </Modal>
        <Modal open={issueOpen} onClose={() => !actionBusy && setIssueOpen(false)} title="Report an Issue">
          <div className="space-y-4"><label className="block font-semibold">Product<select value={issue.productId} onChange={(event) => setIssue((current) => ({ ...current, productId: event.target.value }))} className="mt-1 min-h-11 w-full border border-amorah-border px-3">{order.items.map((item) => <option key={`${item.productId}-${item.sku}`} value={item.productId}>{item.productName} · {item.size} · {item.colourName}</option>)}</select></label><label className="block font-semibold">Issue type<select value={issue.issueType} onChange={(event) => setIssue((current) => ({ ...current, issueType: event.target.value }))} className="mt-1 min-h-11 w-full border border-amorah-border px-3"><option value="">Select an issue</option>{[['wrong-product','Wrong product delivered'],['wrong-colour','Wrong colour delivered'],['wrong-size','Wrong size delivered'],['damaged','Product damaged during delivery'],['defective','Product defective'],['missing-item','Missing item'],['not-as-described','Materially different from description']].map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select></label><label className="block font-semibold">Explanation<textarea value={issue.explanation} onChange={(event) => setIssue((current) => ({ ...current, explanation: event.target.value }))} maxLength={1500} className="mt-1 w-full border border-amorah-border p-3" /></label><p className="text-xs">Evidence images can be provided securely when Amorah support contacts you.</p><div className="flex justify-end gap-3"><button disabled={actionBusy} onClick={() => setIssueOpen(false)} className="min-h-11 border border-amorah-border px-4">Cancel</button><button disabled={actionBusy || !issue.issueType || issue.explanation.trim().length < 10} onClick={handleIssue} className="min-h-11 bg-amorah-maroon px-4 font-semibold text-white disabled:opacity-50">{actionBusy ? 'Submitting…' : 'Submit Issue'}</button></div></div>
        </Modal>
      </section>
    </>
  );
}

export default OrderDetailsPage;
