import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminEmptyState from '../components/AdminEmptyState.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import AdminTable from '../components/AdminTable.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import {
  getRefunds,
  initiateOrderRefund,
  reconcileRefund,
  retryRefund,
} from '../services/adminRefundService.js';
import { formatINR } from '../../utils/currency.js';

const defaultFilters = {
  search: '',
  orderNumber: '',
  status: '',
  inventoryRestorationStatus: '',
  dateFrom: '',
  dateTo: '',
  page: 1,
  limit: 20,
};

function Badge({ children }) {
  return <span className="inline-flex border border-[#DED2C5] bg-[#F3ECE3] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#302925]">{children}</span>;
}

function RefundListPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [refunds, setRefunds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalRefunds: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [working, setWorking] = useState(false);
  const [newRefund, setNewRefund] = useState({ orderNumber: '', reason: '' });

  const loadRefunds = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRefunds(filters);
      setRefunds(result.refunds);
      setPagination(result.pagination);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRefunds();
  }, [loadRefunds]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value, page: field === 'page' ? value : 1 }));
  }

  async function runConfirmAction() {
    if (!confirm) return;
    setWorking(true);
    try {
      if (confirm.action === 'reconcile') {
        await reconcileRefund(confirm.refund.id);
        toast.success('Refund reconciled');
      } else if (confirm.action === 'retry') {
        await retryRefund(confirm.refund.id);
        toast.success('Refund retry processed');
      } else if (confirm.action === 'initiate') {
        await initiateOrderRefund(newRefund.orderNumber.trim(), newRefund.reason.trim());
        setNewRefund({ orderNumber: '', reason: '' });
        toast.success('Full refund initiated');
      }
      setConfirm(null);
      loadRefunds();
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Payments"
        title="Refunds"
        description="Initiate and monitor full-order Razorpay refunds. Amounts and payment IDs are always derived by the backend."
      />

      <section className="border border-[#DED2C5] bg-[#FFFDF8] p-4">
        <h2 className="font-heading text-2xl font-semibold text-[#302925]">Initiate full refund</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-[220px_1fr_auto]">
          <input
            value={newRefund.orderNumber}
            onChange={(event) => setNewRefund((current) => ({ ...current, orderNumber: event.target.value.toUpperCase() }))}
            placeholder="AMR-2026-000001"
            className="min-h-11 border border-[#DED2C5] bg-white px-3 text-sm"
          />
          <input
            value={newRefund.reason}
            onChange={(event) => setNewRefund((current) => ({ ...current, reason: event.target.value }))}
            placeholder="Refund reason"
            className="min-h-11 border border-[#DED2C5] bg-white px-3 text-sm"
          />
          <button
            type="button"
            className="min-h-11 bg-[#672F3B] px-5 text-sm font-semibold text-white disabled:opacity-50"
            disabled={!newRefund.orderNumber || newRefund.reason.trim().length < 5}
            onClick={() =>
              setConfirm({
                action: 'initiate',
                title: 'Initiate full refund?',
                message:
                  'This refunds the complete paid order amount. Stock will be restored only after Razorpay confirms the refund as processed. Partial refunds are not supported in this phase.',
              })
            }
          >
            Initiate Full Refund
          </button>
        </div>
      </section>

      <section className="grid gap-3 border border-[#DED2C5] bg-[#FFFDF8] p-4 md:grid-cols-3 xl:grid-cols-6">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search" className="min-h-10 border border-[#DED2C5] px-3 text-sm" />
        <input value={filters.orderNumber} onChange={(event) => updateFilter('orderNumber', event.target.value.toUpperCase())} placeholder="Order number" className="min-h-10 border border-[#DED2C5] px-3 text-sm" />
        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className="min-h-10 border border-[#DED2C5] px-3 text-sm">
          <option value="">All statuses</option>
          {['initiating', 'pending', 'processed', 'failed'].map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <select value={filters.inventoryRestorationStatus} onChange={(event) => updateFilter('inventoryRestorationStatus', event.target.value)} className="min-h-10 border border-[#DED2C5] px-3 text-sm">
          <option value="">All inventory</option>
          {['not_required', 'pending', 'completed', 'failed'].map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <input type="date" value={filters.dateFrom} onChange={(event) => updateFilter('dateFrom', event.target.value)} className="min-h-10 border border-[#DED2C5] px-3 text-sm" />
        <input type="date" value={filters.dateTo} onChange={(event) => updateFilter('dateTo', event.target.value)} className="min-h-10 border border-[#DED2C5] px-3 text-sm" />
      </section>

      {loading ? (
        <div className="h-80 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" />
      ) : error ? (
        <AdminEmptyState title="Could not load refunds" message={error} />
      ) : refunds.length === 0 ? (
        <AdminEmptyState title="No refunds found" message="Refund attempts will appear here after an admin initiates a full-order refund." />
      ) : (
        <>
          <AdminTable columns={['Refund', 'Order', 'Customer', 'Amount', 'Status', 'Inventory', 'Dates', 'Actions']}>
            {refunds.map((refund) => (
              <tr key={refund.id}>
                <td className="px-4 py-4 text-xs text-[#6F6259]">{refund.razorpayRefundId || refund.id}</td>
                <td className="px-4 py-4 font-semibold text-[#302925]">{refund.orderNumber}</td>
                <td className="px-4 py-4 text-[#6F6259]">{refund.customer?.fullName || 'Customer'}</td>
                <td className="px-4 py-4 font-semibold text-[#302925]">{formatINR(refund.amount)}</td>
                <td className="px-4 py-4"><Badge>{refund.status}</Badge></td>
                <td className="px-4 py-4"><Badge>{refund.inventoryRestorationStatus}</Badge></td>
                <td className="px-4 py-4 text-xs text-[#6F6259]">
                  <div>Initiated: {refund.initiatedAt ? new Date(refund.initiatedAt).toLocaleDateString('en-IN') : '-'}</div>
                  <div>Processed: {refund.processedAt ? new Date(refund.processedAt).toLocaleDateString('en-IN') : '-'}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link className="text-sm font-semibold text-[#672F3B]" to={`/admin/refunds/${refund.id}`}>View</Link>
                    <button type="button" className="text-sm font-semibold text-[#672F3B]" onClick={() => setConfirm({ action: 'reconcile', refund, title: 'Reconcile refund?', message: 'This safely checks Razorpay for the latest refund state.' })}>Reconcile</button>
                    {refund.status === 'failed' ? (
                      <button type="button" className="text-sm font-semibold text-[#672F3B]" onClick={() => setConfirm({ action: 'retry', refund, title: 'Retry refund?', message: 'This reconciles first and creates a new full-refund attempt only when the previous attempt truly failed.' })}>Retry</button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
          <div className="flex justify-between border border-[#DED2C5] bg-[#FFFDF8] p-4 text-sm text-[#6F6259]">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => updateFilter('page', pagination.page - 1)} className="border border-[#DED2C5] px-4 py-2 disabled:opacity-40">Previous</button>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => updateFilter('page', pagination.page + 1)} className="border border-[#DED2C5] px-4 py-2 disabled:opacity-40">Next</button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title || 'Confirm refund action'}
        message={confirm?.message || ''}
        confirmLabel={confirm?.action === 'initiate' ? 'Initiate Refund' : 'Confirm'}
        loading={working}
        onCancel={() => setConfirm(null)}
        onConfirm={runConfirmAction}
      />
    </section>
  );
}

export default RefundListPage;
