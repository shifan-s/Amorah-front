import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import { getAdminOrders, getAdminOrderStats } from '../services/adminOrderService.js';
import { formatINR } from '../../utils/currency.js';

const tabs = ['all', 'new', 'confirmed', 'packed', 'dispatched', 'out-for-delivery', 'delivered', 'cancelled'];
const label = (value) => value.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
const badge = (value) => `inline-flex px-2.5 py-1 text-xs font-semibold ${
  ['paid', 'delivered'].includes(value) ? 'bg-[#E8EEE2] text-[#526047]' :
  ['cancelled', 'failed'].includes(value) ? 'bg-[#F5E5E2] text-[#8A4039]' : 'bg-[#F3ECE3] text-[#672F3B]'
}`;

export default function AdminOrdersPage() {
  const [filters, setFilters] = useState({ search: '', orderStatus: 'all', paymentStatus: '', date: '', sort: 'newest', page: 1 });
  const [result, setResult] = useState({ orders: [], pagination: {} });
  const [counts, setCounts] = useState({});
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setState('loading'); setError('');
    try {
      const params = { ...filters, startDate: filters.date, endDate: filters.date };
      delete params.date;
      const [orders, stats] = await Promise.all([getAdminOrders(params), getAdminOrderStats()]);
      setResult(orders); setCounts(stats.counts || {}); setState('ready');
    } catch (requestError) { setError(requestError.message); setState('error'); }
  }, [filters]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);
  const set = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));

  return (
    <section className="space-y-6">
      <AdminPageHeader eyebrow="Fulfilment" title="Orders" description="View, process and track customer orders." />
      <div className="flex gap-2 overflow-x-auto border-b border-[#DED2C5] pb-3">
        {tabs.map((tab) => <button key={tab} type="button" onClick={() => set('orderStatus', tab)}
          className={`shrink-0 px-3 py-2 text-sm font-semibold ${filters.orderStatus === tab ? 'bg-[#672F3B] text-white' : 'bg-[#FFFDF8] text-[#302925]'}`}>
          {label(tab)} ({counts[tab] || 0})
        </button>)}
      </div>
      <div className="grid gap-3 border border-[#DED2C5] bg-[#FFFDF8] p-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="xl:col-span-2"><span className="sr-only">Search orders</span><input value={filters.search} onChange={(event) => set('search', event.target.value)}
          placeholder="Search order, customer, product or tracking ID" className="min-h-11 w-full border border-[#DED2C5] bg-white px-3 outline-none focus:ring-2 focus:ring-[#672F3B]" /></label>
        <select aria-label="Payment status" value={filters.paymentStatus} onChange={(event) => set('paymentStatus', event.target.value)} className="min-h-11 border border-[#DED2C5] bg-white px-3">
          <option value="">All payments</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
        </select>
        <input aria-label="Order date" type="date" value={filters.date} onChange={(event) => set('date', event.target.value)} className="min-h-11 border border-[#DED2C5] bg-white px-3" />
        <select aria-label="Sort orders" value={filters.sort} onChange={(event) => set('sort', event.target.value)} className="min-h-11 border border-[#DED2C5] bg-white px-3">
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
        </select>
        <button type="button" onClick={() => setFilters({ search: '', orderStatus: 'all', paymentStatus: '', date: '', sort: 'newest', page: 1 })} className="min-h-11 border border-[#672F3B] px-4 font-semibold text-[#672F3B]">Clear filters</button>
      </div>
      {state === 'loading' ? <div className="h-56 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" /> : null}
      {state === 'error' ? <div className="border border-[#DED2C5] bg-[#FFFDF8] p-8 text-center"><p>{error}</p><button onClick={load} className="mt-4 min-h-11 bg-[#672F3B] px-5 font-semibold text-white">Refresh</button></div> : null}
      {state === 'ready' && !result.orders.length ? <p className="border border-[#DED2C5] bg-[#FFFDF8] p-10 text-center text-[#6F6259]">{Object.values(filters).some((value) => value && !['all', 'newest', 1].includes(value)) ? 'No orders match the selected filters.' : 'No orders have been placed yet.'}</p> : null}
      {result.orders.length ? <div className="overflow-hidden border border-[#DED2C5] bg-[#FFFDF8]">
        <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-[#F3ECE3] text-xs uppercase tracking-wider"><tr>{['Order','Customer','Items','Amount','Payment','Order Status','Date','Action'].map((item) => <th key={item} className="px-4 py-3">{item}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#DED2C5]">{result.orders.map((order) => <tr key={order.id}><td className="px-4 py-4 font-semibold">{order.orderNumber}</td><td className="px-4 py-4"><span className="block font-semibold">{order.customer.name}</span><span className="text-xs text-[#6F6259]">{order.customer.email}</span></td><td className="px-4 py-4">{order.itemCount} items</td><td className="px-4 py-4 font-semibold">{formatINR(order.totalAmount)}</td><td className="px-4 py-4"><span className={badge(order.paymentStatus)}>{label(order.paymentStatus)}</span></td><td className="px-4 py-4"><span className={badge(order.orderStatus)}>{label(order.orderStatus)}</span></td><td className="px-4 py-4">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td><td className="px-4 py-4"><Link to={`/admin/orders/${order.id}`} className="font-semibold text-[#672F3B]">View</Link></td></tr>)}</tbody>
        </table></div>
        <div className="divide-y divide-[#DED2C5] md:hidden">{result.orders.map((order) => <article key={order.id} className="space-y-3 p-4"><div className="flex justify-between"><strong>{order.orderNumber}</strong><span>{formatINR(order.totalAmount)}</span></div><p>{order.customer.name} · {order.itemCount} items</p><div className="flex gap-2"><span className={badge(order.paymentStatus)}>{label(order.paymentStatus)}</span><span className={badge(order.orderStatus)}>{label(order.orderStatus)}</span></div><Link to={`/admin/orders/${order.id}`} className="inline-flex min-h-10 items-center font-semibold text-[#672F3B]">View order</Link></article>)}</div>
      </div> : null}
      {result.pagination?.totalPages > 1 ? <div className="flex justify-end gap-3"><button disabled={filters.page <= 1} onClick={() => set('page', filters.page - 1)} className="min-h-10 border px-4 disabled:opacity-40">Previous</button><span className="self-center text-sm">Page {filters.page} of {result.pagination.totalPages}</span><button disabled={filters.page >= result.pagination.totalPages} onClick={() => set('page', filters.page + 1)} className="min-h-10 border px-4 disabled:opacity-40">Next</button></div> : null}
    </section>
  );
}
