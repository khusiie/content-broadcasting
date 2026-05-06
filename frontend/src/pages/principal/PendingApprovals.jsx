import { useState, useCallback } from 'react';
import { Check, X, AlertTriangle, Loader2, ClipboardCheck } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import FilePreview from '../../components/FilePreview';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import useApproval from '../../hooks/useApproval';
import useToast from '../../hooks/useToast';
import { formatDate } from '../../utils/helpers';
import { FileText, Clock } from 'lucide-react';
const PendingApprovals = () => {
  const { pending, loading, approve, reject } = useApproval();
  const toast = useToast();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const handleApprove = useCallback(async (id) => {
    setActionLoading(id);
    try {
      await approve(id);
      toast.success('Content approved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  }, [approve, toast]);
  const openRejectModal = useCallback((item) => {
    setSelectedItem(item);
    setRejectReason('');
    setShowRejectModal(true);
  }, []);
  const closeRejectModal = useCallback(() => {
    setShowRejectModal(false);
    setSelectedItem(null);
    setRejectReason('');
  }, []);
  const handleReject = useCallback(async () => {
    if (!rejectReason.trim() || rejectReason.trim().length < 5) {
      toast.warning('Please provide a detailed rejection reason (min 5 chars)');
      return;
    }
    setActionLoading('reject');
    try {
      await reject(selectedItem.id, rejectReason.trim());
      toast.success('Content rejected.');
      closeRejectModal();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  }, [rejectReason, selectedItem, reject, toast, closeRejectModal]);
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Pending Approvals</h1>
          <p className="text-gray-400">Review and moderate teacher-uploaded content</p>
        </div>
        {loading ? (
          <SkeletonLoader type="card" count={4} />
        ) : pending.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="All caught up!"
            description="No pending content to review. Check back later."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pending.map(item => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="w-12 h-12 rounded-xl overflow-hidden bg-purple-500/20 flex items-center justify-center text-purple-400 hover:ring-2 hover:ring-purple-500/50 transition-all flex-shrink-0"
                      >
                        {item.file_url ? (
                          <img src={item.file_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <FileText size={20} />
                        )}
                      </button>
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <span className="text-xs font-bold text-indigo-400 uppercase">{item.subject}</span>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {item.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDate(item.start_time)}
                    </span>
                    {item.users?.name && <span>by {item.users.name}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={X}
                    onClick={() => openRejectModal(item)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    icon={Check}
                    loading={actionLoading === item.id}
                    onClick={() => handleApprove(item.id)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Modal
          isOpen={showRejectModal}
          onClose={closeRejectModal}
          title="Reject Content"
          subtitle="The teacher will see your reason"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-rose-400" />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-4">
            <p className="text-xs text-gray-400 mb-1">Content being rejected</p>
            <p className="font-semibold">{selectedItem?.title}</p>
            <p className="text-xs text-indigo-400 mt-0.5">{selectedItem?.subject}</p>
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <label className="text-sm text-gray-400">
              Rejection Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              className="glass-input w-full h-28 resize-none text-sm leading-relaxed"
              placeholder="Explain why this content is being rejected..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-gray-500 text-right">{rejectReason.length} chars</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={closeRejectModal}
              disabled={actionLoading === 'reject'}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              icon={X}
              loading={actionLoading === 'reject'}
              disabled={!rejectReason.trim()}
              onClick={handleReject}
            >
              Confirm Reject
            </Button>
          </div>
        </Modal>
        <FilePreview item={previewItem} onClose={() => setPreviewItem(null)} />
      </div>
    </DashboardLayout>
  );
};
export default PendingApprovals;
