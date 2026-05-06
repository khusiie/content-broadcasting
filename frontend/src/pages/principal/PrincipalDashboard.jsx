import { useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import DashboardStats from '../../components/DashboardStats';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import useApproval from '../../hooks/useApproval';
import { ClipboardCheck, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const PrincipalDashboard = () => {
  const { pending, history, loading } = useApproval();
  const navigate = useNavigate();
  const stats = useMemo(() => {
    const all = [...pending, ...history];
    const unique = Array.from(new Map(all.map(c => [c.id, c])).values());
    return {
      total: unique.length,
      pending: unique.filter(c => c.status === 'pending' || c.status === 'uploaded').length,
      approved: unique.filter(c => c.status === 'approved').length,
      rejected: unique.filter(c => c.status === 'rejected').length,
    };
  }, [pending, history]);
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-400">Content moderation overview</p>
          </div>
        </div>
        {loading ? (
          <>
            <SkeletonLoader type="stats" />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonLoader type="card" count={2} />
            </div>
          </>
        ) : (
          <>
            <DashboardStats stats={stats} />
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {}
              <button
                onClick={() => navigate('/principal/pending')}
                className="p-6 rounded-2xl bg-white/[0.03] border border-amber-500/20 text-left hover:bg-white/[0.06] transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <ClipboardCheck size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Pending Approvals</h3>
                    <p className="text-xs text-gray-500">Review and moderate content</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-amber-400">{stats.pending}</span>
                  <span className="text-xs text-gray-500 group-hover:text-indigo-400 transition-colors">
                    View All →
                  </span>
                </div>
              </button>
              {}
              <button
                onClick={() => navigate('/principal/content')}
                className="p-6 rounded-2xl bg-white/[0.03] border border-indigo-500/20 text-left hover:bg-white/[0.06] transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <FileText size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">All Content</h3>
                    <p className="text-xs text-gray-500">Browse, search, and filter</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-indigo-400">{stats.total}</span>
                  <span className="text-xs text-gray-500 group-hover:text-indigo-400 transition-colors">
                    View All →
                  </span>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
export default PrincipalDashboard;
