import { memo } from 'react';
import { Loader2 } from 'lucide-react';
const variants = {
  primary: 'btn-primary',
  secondary: 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10',
  danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:bg-rose-500/30',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
};
const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-xl font-medium transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-40 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};
export default memo(Button);
