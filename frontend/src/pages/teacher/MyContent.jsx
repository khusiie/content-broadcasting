import { useState, useMemo, useCallback } from 'react';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ContentCard from '../../components/ContentCard';
import FilePreview from '../../components/FilePreview';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import useContent from '../../hooks/useContent';
import { useNavigate } from 'react-router-dom';
const ITEMS_PER_PAGE = 8;
const MyContent = () => {
  const { content, loading } = useContent();
  const [currentPage, setCurrentPage] = useState(1);
  const [previewItem, setPreviewItem] = useState(null);
  const navigate = useNavigate();
  const totalPages = useMemo(() => Math.ceil(content.length / ITEMS_PER_PAGE), [content.length]);
  const paginatedContent = useMemo(
    () => content.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [content, currentPage]
  );
  const handlePrevPage = useCallback(() => setCurrentPage(p => Math.max(p - 1, 1)), []);
  const handleNextPage = useCallback(() => setCurrentPage(p => Math.min(p + 1, totalPages)), [totalPages]);
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">My Content</h1>
          <p className="text-gray-400">View and track all your uploaded broadcasts</p>
        </div>
        {loading ? (
          <SkeletonLoader type="row" count={6} />
        ) : content.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No content uploaded yet"
            description="Start by uploading your first broadcast content"
            action={() => navigate('/teacher/upload')}
            actionLabel="Upload Content"
          />
        ) : (
          <>
            <div className="space-y-3">
              {paginatedContent.map(item => (
                <ContentCard
                  key={item.id}
                  item={item}
                  showSchedule
                  onClick={setPreviewItem}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 text-sm text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages} ({content.length} items)
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 text-sm text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
        <FilePreview item={previewItem} onClose={() => setPreviewItem(null)} />
      </div>
    </DashboardLayout>
  );
};
export default MyContent;
