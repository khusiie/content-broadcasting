import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Archive } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ContentCard from '../../components/ContentCard';
import FilePreview from '../../components/FilePreview';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import useApproval from '../../hooks/useApproval';
const ITEMS_PER_PAGE = 8;
const AllContent = () => {
  const { history, loading, historyMeta, fetchHistory } = useApproval();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewItem, setPreviewItem] = useState(null);
  useEffect(() => {
    fetchHistory({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      status: statusFilter || undefined,
      subject: subjectFilter || undefined,
    });
  }, [currentPage, statusFilter, subjectFilter, fetchHistory]);
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter(item =>
      item.title?.toLowerCase().includes(query) ||
      item.subject?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.users?.name?.toLowerCase().includes(query)
    );
  }, [history, searchQuery]);
  const subjects = useMemo(
    () => [...new Set(history.map(i => i.subject).filter(Boolean))],
    [history]
  );
  const handleFilterChange = useCallback((setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  }, []);
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">All Content</h1>
          <p className="text-gray-400">Browse and filter all uploaded content</p>
        </div>
        {}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, subject, or teacher..."
              className="glass-input pl-9 py-2 text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Filter size={16} className="text-gray-500 ml-2" />
          {}
          <select
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
            className="glass-input py-2 px-3 text-sm w-auto min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="uploaded">Uploaded</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          {}
          <select
            value={subjectFilter}
            onChange={handleFilterChange(setSubjectFilter)}
            className="glass-input py-2 px-3 text-sm w-auto min-w-[140px]"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {}
        {loading ? (
          <SkeletonLoader type="row" count={6} />
        ) : filteredHistory.length === 0 ? (
          <EmptyState
            icon={Archive}
            title="No content found"
            description={searchQuery ? 'Try adjusting your search or filters' : 'No content has been uploaded yet'}
          />
        ) : (
          <>
            <div className="space-y-3">
              {filteredHistory.map(item => (
                <ContentCard
                  key={item.id}
                  item={item}
                  showSchedule
                  onClick={setPreviewItem}
                />
              ))}
            </div>
            {}
            {historyMeta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 text-sm text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {historyMeta.totalPages} ({historyMeta.total} items)
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, historyMeta.totalPages))}
                  disabled={currentPage === historyMeta.totalPages}
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
export default AllContent;
