import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminEmptyState from '../components/AdminEmptyState.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { getRefundById, reconcileRefund, retryRefund } from '../services/adminRefundService.js';
import { formatINR } from '../../utils/currency.js';

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#DED2C5] py-3 text-sm">
      <span className="text-[#6F6259]">{label}</span>
      <span className="text-right font-semibold text-[#302925]">{value || '-'}</span>
    </div>
  );
}

function RefundDetailsPage() {
  const { refundId } = useParams();
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [working, setWorking] = useState(false);

  async function loadRefund() {
    setLoading(true);
    try {
      setRefund(await getRefundById(refundId));
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRefund();
  }, [refundId]);

  async function runAction() {
    setWorking(true);
    try {
      if (confirm === 'reconcile') {
        await reconcileRefund(refundId);
        toast.success('Refund reconciled');
      } else if (confirm === 'retry') {
        await retryRefund(refundId);
        toast.success('Refund retry processed');
      }
      setConfirm(null);
      loadRefund();
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setWorking(false);
    }
  }

  if (loading) return <div className="h-80 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" />;
  if (error || !refund) return <AdminEmptyState title="Refund not found" message={error || 'Unable to load refund.'} />;

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Refund details"
        title={refund.orderNumber}
        description="Review full-refund state, Razorpay refund ID, inventory restoration and safe reconciliation actions."
        action={<Link to="/admin/refunds" className="inline-flex min-h-11 items-center border border-[#672F3B] px-5 text-sm font-semibold text-[#672F3B]">Back to Refunds</Link>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5">
          <h2 className="font-heading text-2xl font-semibold text-[#302925]">Refund</h2>
          <div className="mt-4">
            <Row label="Status" value={refund.status} />
            <Row label="Amount" value={formatINR(refund.amount)} />
            <Row label="Razorpay refund ID" value={refund.razorpayRefundId} />
            <Row label="Reason" value={refund.reason} />
            <Row label="Attempt" value={refund.attemptNumber} />
            <Row label="Bank reference" value={refund.acquirerReference} />
          </div>
        </section>
        <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5">
          <h2 className="font-heading text-2xl font-semibold text-[#302925]">Processing</h2>
          <div className="mt-4">
            <Row label="Inventory restoration" value={refund.inventoryRestorationStatus} />
            <Row label="Initiated" value={refund.initiatedAt ? new Date(refund.initiatedAt).toLocaleString('en-IN') : ''} />
            <Row label="Processed" value={refund.processedAt ? new Date(refund.processedAt).toLocaleString('en-IN') : ''} />
            <Row label="Failed" value={refund.failedAt ? new Date(refund.failedAt).toLocaleString('en-IN') : ''} />
            <Row label="Failure reason" value={refund.failureReason} />
          </div>
        </section>
      </div>

      <div className="flex flex-wrap gap-3 border border-[#DED2C5] bg-[#FFFDF8] p-5">
        <button type="button" className="min-h-11 bg-[#672F3B] px-5 text-sm font-semibold text-white" onClick={() => setConfirm('reconcile')}>Reconcile</button>
        {refund.status === 'failed' ? (
          <button type="button" className="min-h-11 border border-[#672F3B] px-5 text-sm font-semibold text-[#672F3B]" onClick={() => setConfirm('retry')}>Retry Failed Refund</button>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm === 'retry' ? 'Retry failed refund?' : 'Reconcile refund?'}
        message={confirm === 'retry' ? 'This reconciles Razorpay first, then retries only when the previous full-refund attempt truly failed.' : 'This checks Razorpay for the current refund status and applies any safe local finalisation.'}
        confirmLabel={confirm === 'retry' ? 'Retry' : 'Reconcile'}
        loading={working}
        onCancel={() => setConfirm(null)}
        onConfirm={runAction}
      />
    </section>
  );
}

export default RefundDetailsPage;
