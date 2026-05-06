import { memo } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import useToast from '../../hooks/useToast';
const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};
const colors = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  info: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
};
const ToastItem = memo(({ toast, onRemove }) => {
  const Icon = icons[toast.type] || Info;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${colors[toast.type]} animate-slide-in`}>
      <Icon size={18} className="flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
});
ToastItem.displayName = 'ToastItem';
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
export default memo(ToastContainer);
