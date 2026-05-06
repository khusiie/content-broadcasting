import { memo } from 'react';
const statusConfig = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Pending' },
  uploaded: { bg: 'bg-sky-500/10', text: 'text-sky-400', label: 'Uploaded' },
  approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Approved' },
  rejected: { bg: 'bg-rose-500/10', text: 'text-rose-400', label: 'Rejected' },
  scheduled: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Scheduled' },
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Active' },
  expired: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Expired' },
};
const StatusBadge = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
        ${config.bg} ${config.text} ${className}
      `}
    >
      {config.label}
    </span>
  );
};
export default memo(StatusBadge);
