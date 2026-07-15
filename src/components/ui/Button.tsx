import React from 'react';
import { Shield } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-rpg-accent hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(49,130,206,0.3)] hover:shadow-[0_0_20px_rgba(49,130,206,0.5)] border border-blue-400/50',
    secondary: 'bg-rpg-card hover:bg-slate-600 text-white border border-slate-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-red-400/50',
    ghost: 'bg-transparent hover:bg-rpg-card/50 text-slate-300 hover:text-white',
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-8 py-3',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Shield className="w-5 h-5 animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}
