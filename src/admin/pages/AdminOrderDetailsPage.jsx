import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal.jsx';
import { formatINR } from '../../utils/currency.js';
import { getAdminOrder, retryAdminOrderNotification, updateAdminOrder } from '../services/adminOrderService.js';

const actionMap = {
  new: [['cancel', 'Cancel Order']],
  confirmed: [['pack', 'Mark as Packed'], ['cancel', 'Cancel Order']],
  packed: [['dispatch', 'Dispatch Order']],
  dispatched: [['out-for-delivery', 'Mark Out for Delivery']],
  'out-for-delivery': [['deliver', 'Mark Delivered']],
};
const title = (value) => String(value || '').split(/[-_]/).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [dispatch, setDispatch] = useState({ courierName: '', trackingId: '', trackingUrl: '', estimatedDeliveryDate: '', note: '' });
  const load = useCallback(() => getAdminOrder(orderId).then(setOrder).catch((requestError) => setError(requestError.message)), [orderId]);
  useEffect(() => { load(); }, [load]);
  const perform = async () => {
    setBusy(true);
    try {
      const response = await updateAdminOrder(orderId, dialog, dialog === 'dispatch' ? dispatch : dialog === 'cancel' ? { reason: cancellationReason } : {});
      setOrder(response.data.order); toast.success(response.message); setDialog(null);
    } catch (requestError) { toast.error(requestError.message); } finally { setBusy(false); }
  };
  if (error) return <div className="p-8 text-center"><p>{error}</p><button onClick={load} className="mt-4 bg-[#672F3B] px-5 py-3 text-white">Refresh</button></div>;
  if (!order) return <div className="h-64 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" />;
  const address = order.shippingAddress;
  return <section className="space-y-6">
    <Link to="/admin/orders" className="text-sm font-semibold text-[#672F3B]">← Back to orders</Link>
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.22em] text-[#672F3B]">Order details</p><h1 className="font-heading text-4xl font-semibold">{order.orderNumber}</h1><p className="mt-2 text-sm text-[#6F6259]">{new Date(order.createdAt).toLocaleString('en-IN')}</p></div><div className="flex flex-wrap gap-2">{(actionMap[order.orderStatus] || []).map(([action, text]) => <button key={action} onClick={() => setDialog(action)} className="min-h-11 bg-[#672F3B] px-4 text-sm font-semibold text-white">{text}</button>)}</div></div>
    {order.paymentStatus === 'pending' ? (
      <div className="border border-[#DED2C5] bg-[#FFFDF8] px-5 py-4">
        <p className="font-semibold text-[#672F3B]">Awaiting Razorpay payment</p>
        <p className="mt-1 text-sm text-[#6F6259]">This order will be confirmed automatically after Razorpay payment is captured and verified. The customer will then receive the order-confirmation email.</p>
      </div>
    ) : null}
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]"><div className="space-y-6">
      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5"><h2 className="font-heading text-2xl font-semibold">Ordered products</h2><div className="mt-4 divide-y divide-[#DED2C5]">{order.items.map((item) => <div key={`${item.sku}-${item.size}`} className="grid grid-cols-[64px_1fr_auto] gap-4 py-4">{item.productImage?.url ? <img src={item.productImage.url} alt={item.productImage.alt || item.productName} className="aspect-[3/4] w-16 object-cover" /> : <div className="aspect-[3/4] bg-[#F3ECE3]" />}<div><strong>{item.productName}</strong><p className="text-sm text-[#6F6259]">SKU {item.sku} · {item.colour} · Size {item.size} · Qty {item.quantity}</p><p className="text-sm">{formatINR(item.unitPrice)} each</p></div><strong>{formatINR(item.itemTotal)}</strong></div>)}</div></section>
      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5"><h2 className="font-heading text-2xl font-semibold">Order timeline</h2><ol className="mt-5 border-l border-[#B9684B] pl-5">{order.timeline.map((event, index) => <li key={`${event.createdAt}-${index}`} className="relative pb-6 before:absolute before:-left-[1.55rem] before:top-1 before:h-3 before:w-3 before:rounded-full before:bg-[#672F3B]"><strong>{title(event.status)}</strong><p className="text-sm text-[#6F6259]">{event.message}{event.note ? ` · ${event.note}` : ''}</p><p className="text-xs text-[#6F6259]">{new Date(event.createdAt).toLocaleString('en-IN')} · {event.changedBy}</p></li>)}</ol></section>
    </div><aside className="space-y-6">
      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5"><h2 className="font-heading text-2xl font-semibold">Order summary</h2><dl className="mt-4 space-y-2 text-sm">{[['Internal order ID',order.id],['Status',title(order.orderStatus)],['Payment',title(order.paymentStatus)],['Method','Razorpay'],['Razorpay order ID',order.razorpayOrderId || '—'],['Razorpay payment ID',order.razorpayPaymentId || '—'],['Paid date',order.paidAt ? new Date(order.paidAt).toLocaleString('en-IN') : '—'],['Failure reason',order.paymentFailureReason || '—'],['Total',formatINR(order.totalAmount)]].map(([key,value]) => <div key={key} className="flex justify-between gap-4"><dt className="text-[#6F6259]">{key}</dt><dd className="break-all text-right font-semibold">{value}</dd></div>)}</dl></section>
      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5"><h2 className="font-heading text-2xl font-semibold">Customer</h2><p className="mt-3 font-semibold">{order.customer.name}</p><p className="text-sm text-[#6F6259]">{order.customer.email}<br />{order.customer.phone}<br />Account: {order.customer.id}</p></section>
      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5"><div className="flex justify-between gap-3"><h2 className="font-heading text-2xl font-semibold">Delivery address</h2><button onClick={() => navigator.clipboard.writeText([address.fullName,address.addressLine1,address.addressLine2,address.landmark,address.city,address.state,address.postalCode,address.country,address.mobile].filter(Boolean).join(', ')).then(() => toast.success('Address copied'))} className="text-sm font-semibold text-[#672F3B]">Copy</button></div><p className="mt-3 text-sm leading-6">{address.fullName}<br />{address.addressLine1}<br />{address.addressLine2}{address.addressLine2 && <br />}{address.landmark}<br />{address.city}, {address.state} {address.postalCode}<br />{address.country}<br />{address.mobile}</p></section>
      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5"><h2 className="font-heading text-2xl font-semibold">Price summary</h2><dl className="mt-3 space-y-2 text-sm">{[['Subtotal',order.subtotal],['Discount',order.discount],['Coupon discount',order.couponDiscount],['Shipping',order.shippingCharge],['Tax',order.tax],['Grand total',order.totalAmount],['Amount paid',order.amountPaid],['Amount remaining',order.totalAmount-order.amountPaid]].map(([key,value]) => <div key={key} className="flex justify-between"><dt>{key}</dt><dd>{formatINR(value)}</dd></div>)}</dl></section>
      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5"><h2 className="font-heading text-2xl font-semibold">Customer note</h2><p className="mt-3 text-sm">{order.customerNote || 'No customer note.'}</p></section>
      {['dispatched','out-for-delivery','delivered'].includes(order.orderStatus) ? <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5"><h2 className="font-heading text-2xl font-semibold">Shipping</h2><p className="mt-3 text-sm">{order.shipping.courierName}<br />Tracking: {order.shipping.trackingId}<br />Estimated: {order.shipping.estimatedDeliveryDate ? new Date(order.shipping.estimatedDeliveryDate).toLocaleDateString('en-IN') : '—'}</p><button onClick={async () => { try { const response = await retryAdminOrderNotification(orderId); toast.success(response.message); } catch (e) { toast.error(e.message); } }} className="mt-4 text-sm font-semibold text-[#672F3B]">Retry Notification</button></section> : null}
    </aside></div>
    <Modal open={Boolean(dialog)} onClose={() => !busy && setDialog(null)} title={dialog === 'dispatch' ? 'Dispatch order' : `Confirm ${title(dialog)}`}>
      <div className="space-y-4"><p>Are you sure you want to {dialog === 'cancel' ? 'cancel' : 'mark'} order {order.orderNumber} {dialog === 'cancel' ? '' : `as ${title(dialog)}`}?</p>{dialog === 'cancel' ? <><p className="text-sm">Customer: {order.customer.name}<br />Current status: {title(order.orderStatus)}<br />Refund amount: {order.paymentStatus === 'paid' ? formatINR(order.totalAmount) : 'Not required'}</p><p className="font-semibold text-[#8A4039]">This action cannot be reversed. A refund will be initiated for this paid Razorpay order.</p><label className="block text-sm font-semibold">Cancellation reason<select value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)} className="mt-1 min-h-11 w-full border border-[#DED2C5] px-3"><option value="">Select a reason</option>{['Customer requested cancellation','Product unavailable','Incorrect stock','Payment problem','Address not serviceable','Duplicate order','Other'].map((reason) => <option key={reason}>{reason}</option>)}</select></label></> : null}{dialog === 'dispatch' ? <>{[['courierName','Courier or delivery partner'],['trackingId','Tracking ID'],['trackingUrl','Tracking URL (optional)'],['estimatedDeliveryDate','Estimated delivery date']].map(([key,text]) => <label key={key} className="block text-sm font-semibold">{text}<input required={!text.includes('optional')} type={key === 'estimatedDeliveryDate' ? 'date' : 'text'} min={key === 'estimatedDeliveryDate' ? new Date().toISOString().slice(0,10) : undefined} value={dispatch[key]} onChange={(event) => setDispatch((current) => ({...current,[key]:event.target.value}))} className="mt-1 min-h-11 w-full border border-[#DED2C5] px-3" /></label>)}<label className="block text-sm font-semibold">Note for customer (optional)<textarea value={dispatch.note} onChange={(event) => setDispatch((current) => ({...current,note:event.target.value}))} className="mt-1 w-full border border-[#DED2C5] p-3" /></label></> : null}<div className="flex justify-end gap-3"><button disabled={busy} onClick={() => setDialog(null)} className="min-h-11 border px-4">{dialog === 'cancel' ? 'Keep Order' : 'Cancel'}</button><button disabled={busy || (dialog === 'cancel' && !cancellationReason) || (dialog === 'dispatch' && (!dispatch.courierName || !dispatch.trackingId || !dispatch.estimatedDeliveryDate))} onClick={perform} className="min-h-11 bg-[#672F3B] px-4 font-semibold text-white disabled:opacity-50">{busy ? 'Updating…' : dialog === 'dispatch' ? 'Confirm Dispatch' : dialog === 'cancel' ? 'Cancel Order' : 'Confirm'}</button></div></div>
    </Modal>
  </section>;
}
