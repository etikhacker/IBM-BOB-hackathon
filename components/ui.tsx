"use client";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium",
        variant === "outline" && "border",
        className
      )}
    >
      {children}
    </span>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        {
          "bg-violet-600 hover:bg-violet-500 text-white focus:ring-violet-500": variant === "primary",
          "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500": variant === "secondary",
          "hover:bg-slate-800 text-slate-300 hover:text-white focus:ring-slate-500": variant === "ghost",
          "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 focus:ring-red-500": variant === "danger",
          "border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white focus:ring-slate-500": variant === "outline",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-sm": size === "md",
          "px-6 py-3 text-base": size === "lg",
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm",
        onClick && "cursor-pointer hover:border-slate-600 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("border-t border-slate-700/60", className)} />;
}

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: string;
  animated?: boolean;
}

export function ProgressBar({ value, color = "bg-violet-500", height = "h-1.5", animated }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-slate-700 rounded-full overflow-hidden", height)}>
      <div
        className={cn(color, height, "rounded-full transition-all duration-500", animated && "animate-pulse")}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <svg
      className={cn(
        "animate-spin text-slate-400",
        { "w-4 h-4": size === "sm", "w-6 h-6": size === "md", "w-8 h-8": size === "lg" },
        className
      )}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: 24, md: 32, lg: 48 }[size];
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className="shrink-0">
      <rect width="48" height="48" rx="10" fill="url(#logoGrad)" />
      <path d="M24 10L36 18V30L24 38L12 30V18L24 10Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M18 24L22 28L30 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
