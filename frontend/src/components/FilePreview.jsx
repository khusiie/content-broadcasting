import { memo, useState } from 'react';
import Modal from './ui/Modal';
import StatusBadge from './ui/StatusBadge';
import { formatDate, formatFileSize, getScheduleStatus } from '../utils/helpers';
import { FileText } from 'lucide-react';
const FilePreview = ({ item, onClose }) => {
  const [imgError, setImgError] = useState(false);
  if (!item) return null;
  const scheduleStatus = getScheduleStatus(item.start_time, item.end_time);
  return (
    <Modal
      isOpen={!!item}
      onClose={onClose}
      title={item.title}
      subtitle={item.subject}
      maxWidth="max-w-2xl"
    >
      {}
      <div className="rounded-xl overflow-hidden bg-black/30 mb-4 min-h-[200px] flex items-center justify-center">
        {item.file_url && !imgError ? (
          <img
            src={item.file_url}
            alt={item.title}
            className="w-full max-h-[60vh] object-contain"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <FileText size={48} />
            <span className="text-xs uppercase tracking-widest font-bold">Preview Unavailable</span>
          </div>
        )}
      </div>
      {}
      <div className="flex items-center gap-2 mb-4">
        <StatusBadge status={item.status} />
        {scheduleStatus && <StatusBadge status={scheduleStatus} />}
      </div>
      {}
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
        <div><span className="text-gray-600">Type:</span> {item.file_type || 'N/A'}</div>
        <div><span className="text-gray-600">Size:</span> {formatFileSize(item.file_size)}</div>
        <div><span className="text-gray-600">Start:</span> {formatDate(item.start_time)}</div>
        <div><span className="text-gray-600">End:</span> {formatDate(item.end_time)}</div>
        {item.rotation_duration && (
          <div><span className="text-gray-600">Rotation:</span> {item.rotation_duration} min</div>
        )}
        {item.users?.name && (
          <div><span className="text-gray-600">Uploaded by:</span> {item.users.name}</div>
        )}
      </div>
      {item.description && (
        <p className="mt-4 text-sm text-gray-400 leading-relaxed">{item.description}</p>
      )}
      {item.rejection_reason && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
          <p className="text-xs text-rose-400 italic">Rejection reason: {item.rejection_reason}</p>
        </div>
      )}
    </Modal>
  );
};
export default memo(FilePreview);
