"use client";

import { useState } from "react";
import type { CheckResult } from "@/lib/types";
import { cn, getCheckStatusConfig, getSeverityConfig } from "@/lib/utils";
import { Badge } from "@/components/ui";

interface CheckCardProps {
  check: CheckResult;
}

export function CheckCard({ check }: CheckCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = getCheckStatusConfig(check.status);
  const severityConfig = getSeverityConfig(check.severity);

  return (
    <div
      className={cn(
        "rounded-xl border bg-slate-800/40 overflow-hidden transition-all duration-200",
        check.status === "failed"
          ? "border-red-500/30"
          : check.status === "warning"
          ? "border-amber-500/30"
          : check.status === "passed"
          ? "border-slate-700/60"
          : "border-slate-700/40"
      )}
    >
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Status dot */}
            <div
              className={cn(
                "w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0",
                statusConfig.bg,
                statusConfig.color
              )}
              aria-label={`Status: ${statusConfig.label}`}
            >
              {statusConfig.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-slate-100 text-sm leading-tight">{check.name}</h3>
              <span className="text-xs text-slate-500">{check.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={severityConfig.badge}>{severityConfig.label}</Badge>
            <Badge
              className={cn(
                "text-xs font-medium",
                check.status === "passed" && "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
                check.status === "warning" && "bg-amber-400/10 text-amber-400 border border-amber-400/20",
                check.status === "failed" && "bg-red-400/10 text-red-400 border border-red-400/20",
              )}
            >
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{check.summary}</p>
      </div>

      {/* Affected files */}
      {check.affectedFiles.length > 0 && (
        <div className="px-4 pb-3">
          <div className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Affected Files</div>
          <div className="space-y-1">
            {check.affectedFiles.map((file, i) => (
              <div key={i} className="flex items-start gap-2">
                <code className="text-xs bg-slate-900/60 border border-slate-700/50 rounded px-2 py-0.5 text-violet-300 font-mono">
                  {file.path}{file.line ? `:${file.line}` : ""}
                </code>
                {file.snippet && (
                  <code className="text-xs text-slate-500 font-mono truncate">{file.snippet}</code>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className="px-4 pb-4">
        <div className="flex items-start gap-2 rounded-lg bg-slate-900/40 border border-slate-700/40 p-3">
          <svg className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-slate-400 leading-relaxed">{check.recommendation}</p>
        </div>
      </div>

      {/* Expand button */}
      {(check.details || check.expandableDetails) && (
        <>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="w-full flex items-center justify-between px-4 py-2.5 border-t border-slate-700/40 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors cursor-pointer"
            aria-expanded={expanded}
          >
            <span>{expanded ? "Hide details" : "Show details"}</span>
            <svg
              className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expanded && (
            <div className="px-4 pb-4 border-t border-slate-700/40 bg-slate-900/20">
              <div className="pt-3 space-y-3">
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                    Full Details
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{check.details}</p>
                </div>
                {check.expandableDetails && (
                  <div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Additional Context
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{check.expandableDetails}</p>
                  </div>
                )}
                {check.duration && (
                  <div className="text-xs text-slate-600">
                    Check completed in {check.duration}ms
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
