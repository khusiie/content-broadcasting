import { memo } from 'react';
const Card = ({ children, className = '', hover = true, padding = 'p-6' }) => {
  return (
    <div className={`glass-card ${padding} ${hover ? '' : 'no-hover'} ${className}`}>
      {children}
    </div>
  );
};
export default memo(Card);
