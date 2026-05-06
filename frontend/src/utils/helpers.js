export const getScheduleStatus = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (now < start) return 'scheduled';
  if (now >= start && now <= end) return 'active';
  return 'expired';
};
export const formatDate = (dateStr) => {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleString('en-IN', {
    timeZone: 'UTC',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
export const truncateText = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
};
export const computeStats = (contentArray = []) => {
  return {
    total: contentArray.length,
    pending: contentArray.filter(c => c.status === 'pending' || c.status === 'uploaded').length,
    approved: contentArray.filter(c => c.status === 'approved').length,
    rejected: contentArray.filter(c => c.status === 'rejected').length,
  };
};
