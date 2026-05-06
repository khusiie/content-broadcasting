import { memo } from 'react';
import { Inbox } from 'lucide-react';
const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data available',
  description = '',
  action,
  actionLabel = 'Get Started',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        <Icon size={32} className="text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-400 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action} className="btn-primary mt-6 text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
export default memo(EmptyState);
