import { memo } from 'react';
const SkeletonCard = () => (
  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded-lg w-3/4" />
        <div className="h-3 bg-white/10 rounded-lg w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-white/10 rounded-lg w-full" />
      <div className="h-3 bg-white/10 rounded-lg w-2/3" />
    </div>
  </div>
);
const SkeletonRow = () => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 animate-pulse">
    <div className="flex items-center gap-4 flex-1">
      <div className="w-12 h-12 rounded-xl bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded-lg w-1/2" />
        <div className="h-3 bg-white/10 rounded-lg w-1/3" />
      </div>
    </div>
    <div className="h-6 w-20 bg-white/10 rounded-full" />
  </div>
);
const SkeletonStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 animate-pulse">
        <div className="h-3 bg-white/10 rounded w-1/2 mb-3" />
        <div className="h-8 bg-white/10 rounded w-1/3" />
      </div>
    ))}
  </div>
);
const SkeletonLoader = ({ type = 'card', count = 4 }) => {
  if (type === 'stats') return <SkeletonStats />;
  return (
    <div className={type === 'card' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
      {Array.from({ length: count }).map((_, i) => (
        type === 'card' ? <SkeletonCard key={i} /> : <SkeletonRow key={i} />
      ))}
    </div>
  );
};
export default memo(SkeletonLoader);
