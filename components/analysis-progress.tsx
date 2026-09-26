"use client";

import { useApp } from "@/lib/app-context";
import { Navbar } from "@/components/navbar";
import { ProgressBar, Spinner, Card } from "@/components/ui";
import { cn, getCheckStatusConfig } from "@/lib/utils";
import type { CheckProgress } from "@/lib/types";

function CheckRow({ check }: { check: CheckProgress }) {
  const config = getCheckStatusConfig(check.status);
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border px-4 py-3 transition-all duration-300",
        check.status === "running"
          ? "border-violet-500/40 bg-violet-500/5"
          : check.status === "pending"
          ? "border-slate-700/50 bg-slate-800/30 opacity-50"
          : "border-slate-700/50 bg-slate-800/30"
      )}
    >
      {/* Status icon */}
      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
        {check.status === "running" ? (
          <Spinner size="sm" className="text-violet-400" />
        ) : check.status === "pending" ? (
          <div className="w-2 h-2 rounded-full bg-slate-600" />
        ) : (
          <div
            className={cn(
              "w-7 h-7 rounded-full border flex items-center justify-center text-sm font-bold",
              config.bg,
              config.color
            )}
          >
            {config.icon}
          </div>
        )}
      </div>

      {/* Name and message */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              check.status === "pending" ? "text-slate-500" : "text-slate-200"
            )}
          >
            {check.name}
          </span>
          {check.status !== "pending" && (
            <span className={cn("text-xs font-medium shrink-0", config.color)}>
              {config.label}
            </span>
          )}
        </div>
        {check.status === "running" && (
          <p className="text-xs text-slate-500 mt-0.5 animate-pulse">{check.statusMessage}</p>
        )}
      </div>
    </div>
  );
}

export function AnalysisProgress() {
  const { state } = useApp();
  const progress = state.progress;

  const completed = progress?.checks.filter(
    (c) => c.status !== "pending" && c.status !== "running"
  ).length ?? 0;
  const total = progress?.checks.length ?? 8;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const runningCheck = progress?.checks.find((c) => c.status === "running");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 mb-5">
            <Spinner size="lg" className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Analyzing Repository</h1>
          <p className="text-slate-400 text-sm">
            {runningCheck ? runningCheck.statusMessage : progress?.message || "Initializing..."}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Overall Progress</span>
            <span className="text-sm font-mono text-slate-300">{completed}/{total}</span>
          </div>
          <ProgressBar
            value={percentage}
            color="bg-gradient-to-r from-violet-500 to-indigo-500"
            height="h-2"
          />
          <div className="mt-2 text-right">
            <span className="text-xs text-slate-500">{percentage}% complete</span>
          </div>
        </div>

        {/* Parallel checks indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-1">
            {progress?.checks.filter((c) => c.status === "running").map((c) => (
              <div key={c.checkId} className="w-2 h-2 rounded-full bg-violet-400 animate-pulse border border-slate-900" />
            ))}
          </div>
          {(progress?.checks.filter((c) => c.status === "running").length ?? 0) > 1 && (
            <span className="text-xs text-violet-400">
              {progress?.checks.filter((c) => c.status === "running").length} checks running in parallel
            </span>
          )}
        </div>

        {/* Check list */}
        <Card className="divide-y divide-slate-700/40 overflow-hidden p-0">
          <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Checks</span>
            <span className="text-xs text-slate-600">IBM Bob 2.0 engine</span>
          </div>
          <div className="p-3 space-y-2">
            {(progress?.checks ?? Array.from({ length: 8 }, (_, i) => ({
              checkId: `check-${i}`,
              name: ["Repository Structure", "Test Suite", "Environment Variables", "Security Scan", "Database Migrations", "API Compatibility", "Documentation", "Deployment Readiness"][i],
              status: "pending" as const,
              statusMessage: "Waiting...",
            }))).map((check) => (
              <CheckRow key={check.checkId} check={check} />
            ))}
          </div>
        </Card>

        {/* IBM Bob badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Analysis powered by IBM Bob 2.0 · Running parallel checks
        </div>
      </main>
    </div>
  );
}
