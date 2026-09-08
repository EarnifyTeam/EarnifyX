import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-[#6C5CE7] via-[#7C4DFF] to-[#8B5CF6] hover:brightness-110 shadow-lg shadow-[#6C5CE7]/25 border border-purple-400/20 hover:shadow-purple-500/35",
    secondary: "text-slate-200 bg-[#111827] hover:bg-[#1f293d] border border-white/10 hover:border-purple-500/30 text-white shadow-md",
    outline: "text-purple-300 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/40 hover:border-purple-400 text-white",
    danger: "text-white bg-red-600/90 hover:bg-red-600 shadow-lg shadow-red-900/20 border border-red-500/30",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="w-4 h-4 mr-2.5 animate-spin text-current" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
