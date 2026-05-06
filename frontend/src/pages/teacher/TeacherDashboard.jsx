import { useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import DashboardStats from '../../components/DashboardStats';
import ContentCard from '../../components/ContentCard';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import useContent from '../../hooks/useContent';
import { computeStats } from '../../utils/helpers';
import { Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const TeacherDashboard = () => {
  const { content, loading } = useContent();
  const navigate = useNavigate();
  const stats = useMemo(() => computeStats(content), [content]);
  const recentContent = useMemo(() => content.slice(0, 6), [content]);
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-400">Overview of your broadcast content</p>
          </div>
          <button
            onClick={() => navigate('/teacher/upload')}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Upload size={16} /> New Upload
          </button>
        </div>
        {loading ? (
          <>
            <SkeletonLoader type="stats" />
            <div className="mt-8">
              <SkeletonLoader type="row" count={4} />
            </div>
          </>
        ) : (
          <>
            <DashboardStats stats={stats} />
            <div className="mt-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-300">Recent Uploads</h2>
                {content.length > 6 && (
                  <button
                    onClick={() => navigate('/teacher/content')}
                    className="text-sm text-indigo-400 hover:underline"
                  >
                    View All ({content.length})
                  </button>
                )}
              </div>
              {recentContent.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No content uploaded yet"
                  description="Start by uploading your first broadcast content"
                  action={() => navigate('/teacher/upload')}
                  actionLabel="Upload Content"
                />
              ) : (
                <div className="space-y-3">
                  {recentContent.map(item => (
                    <ContentCard key={item.id} item={item} showSchedule />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
export default TeacherDashboard;
