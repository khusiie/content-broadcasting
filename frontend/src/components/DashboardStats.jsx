import { memo, useMemo } from 'react';
import { BarChart3, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
const iconMap = {
  total: BarChart3,
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};
const colorMap = {
  total: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  rejected: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
};
const StatCard = memo(({ label, value, type }) => {
  const Icon = iconMap[type] || FileText;
  const colors = colorMap[type] || colorMap.total;
  return (
    <div className={`p-5 rounded-2xl bg-white/[0.03] border ${colors.border} transition-all hover:bg-white/[0.06]`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <Icon size={16} className={colors.text} />
        </div>
      </div>
      <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
    </div>
  );
});
StatCard.displayName = 'StatCard';
const DashboardStats = ({ stats }) => {
  const items = useMemo(() => [
    { label: 'Total Content', value: stats.total, type: 'total' },
    { label: 'Pending', value: stats.pending, type: 'pending' },
    { label: 'Approved', value: stats.approved, type: 'approved' },
    { label: 'Rejected', value: stats.rejected, type: 'rejected' },
  ], [stats]);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map(item => (
        <StatCard key={item.type} {...item} />
      ))}
    </div>
  );
};
export default memo(DashboardStats);
