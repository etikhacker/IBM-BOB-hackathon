import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getRiskColor(score: number): string {
  if (score <= 20) return "text-emerald-400";
  if (score <= 50) return "text-amber-400";
  return "text-red-400";
}

export function getRiskBg(score: number): string {
  if (score <= 20) return "bg-emerald-400";
  if (score <= 50) return "bg-amber-400";
  return "bg-red-400";
}

export function getStatusConfig(status: string) {
  switch (status) {
    case "ready":
      return {
        label: "READY FOR RELEASE",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/30",
        dot: "bg-emerald-400",
        badge: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
      };
    case "needs_attention":
      return {
        label: "NEEDS ATTENTION",
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/30",
        dot: "bg-amber-400",
        badge: "bg-amber-400/20 text-amber-300 border-amber-400/30",
      };
    case "blocked":
      return {
        label: "BLOCKED",
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/30",
        dot: "bg-red-400",
        badge: "bg-red-400/20 text-red-300 border-red-400/30",
      };
    default:
      return {
        label: status,
        color: "text-slate-400",
        bg: "bg-slate-400/10",
        border: "border-slate-400/30",
        dot: "bg-slate-400",
        badge: "bg-slate-400/20 text-slate-300 border-slate-400/30",
      };
  }
}

export function getCheckStatusConfig(status: string) {
  switch (status) {
    case "passed":
      return { label: "Passed", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", icon: "✓" };
    case "warning":
      return { label: "Warning", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", icon: "⚠" };
    case "failed":
      return { label: "Failed", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", icon: "✗" };
    case "running":
      return { label: "Running", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", icon: "↻" };
    case "pending":
    default:
      return { label: "Pending", color: "text-slate-500", bg: "bg-slate-500/10 border-slate-500/20", icon: "○" };
  }
}

export function getSeverityConfig(severity: string) {
  switch (severity) {
    case "critical":
      return { label: "Critical", color: "text-red-400", badge: "bg-red-400/20 text-red-300 border border-red-400/30" };
    case "high":
      return { label: "High", color: "text-orange-400", badge: "bg-orange-400/20 text-orange-300 border border-orange-400/30" };
    case "medium":
      return { label: "Medium", color: "text-amber-400", badge: "bg-amber-400/20 text-amber-300 border border-amber-400/30" };
    case "low":
      return { label: "Low", color: "text-sky-400", badge: "bg-sky-400/20 text-sky-300 border border-sky-400/30" };
    case "informational":
    default:
      return { label: "Info", color: "text-slate-400", badge: "bg-slate-400/20 text-slate-300 border border-slate-400/30" };
  }
}

export function formatCommit(commit: string): string {
  return commit.slice(0, 7);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
