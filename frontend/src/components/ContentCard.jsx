import { memo, useMemo, useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, ArrowUpCircle } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';
import { getScheduleStatus, formatDate } from '../utils/helpers';
const StatusIcon = memo(({ status }) => {
  if (status === 'approved') return <CheckCircle size={18} className="text-emerald-500" />;
  if (status === 'rejected') return <XCircle size={18} className="text-rose-500" />;
  if (status === 'uploaded') return <ArrowUpCircle size={18} className="text-sky-500" />;
  return <Clock size={18} className="text-amber-500" />;
});
StatusIcon.displayName = 'StatusIcon';
const ContentCard = ({ item, actions, showSchedule = false, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const scheduleStatus = useMemo(
    () => getScheduleStatus(item.start_time, item.end_time),
    [item.start_time, item.end_time]
  );
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {}
        <button
          onClick={() => onClick?.(item)}
          className="w-12 h-12 rounded-xl overflow-hidden bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 hover:ring-2 hover:ring-indigo-500/50 transition-all"
        >
          {item.file_url && !imgError ? (
            <img
              src={item.file_url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <FileText size={22} />
          )}
        </button>
        {}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-base truncate">{item.title}</h3>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="text-indigo-400 font-bold uppercase">{item.subject}</span>
            <span className="text-gray-700">•</span>
            <Clock size={11} />
            {item.start_time ? formatDate(item.start_time) : 'Not scheduled'}
          </p>
          {item.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
          )}
          {item.status === 'rejected' && item.rejection_reason && (
            <p className="text-xs text-rose-400 mt-1 bg-rose-500/5 px-2 py-1 rounded-lg border border-rose-500/10 italic">
              Reason: {item.rejection_reason}
            </p>
          )}
        </div>
      </div>
      {}
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {showSchedule && scheduleStatus && (
          <StatusBadge status={scheduleStatus} />
        )}
        <StatusBadge status={item.status} />
        <StatusIcon status={item.status} />
        {actions}
      </div>
    </div>
  );
};
export default memo(ContentCard);
