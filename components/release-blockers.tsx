"use client";

import type { ReleaseBlocker } from "@/lib/types";
import { cn, getSeverityConfig } from "@/lib/utils";

interface BlockerCardProps {
  blocker: ReleaseBlocker;
  index: number;
}

function BlockerCard({ blocker, index }: BlockerCardProps) {
  const sev = getSeverityConfig(blocker.severity);
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-red-500/10 flex items-start gap-4">
        <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 text-sm font-bold shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-100 text-sm leading-tight">{blocker.title}</h3>
            <span className={cn("text-xs rounded px-2 py-0.5 shrink-0", sev.badge)}>
              {sev.label}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Why it matters */}
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Why it matters
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{blocker.whyItMatters}</p>
        </div>

        {/* Affected file */}
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Affected File
          </div>
          <code className="text-xs bg-slate-900/60 border border-slate-700/50 rounded px-2 py-1 text-violet-300 font-mono break-all">
            {blocker.affectedFile}
          </code>
        </div>

        {/* Suggested fix */}
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
            Suggested Fix
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{blocker.suggestedFix}</p>
        </div>

        {/* Estimated effort */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-slate-500">Estimated effort:</span>
          <span className="text-xs font-medium text-slate-300">{blocker.estimatedEffort}</span>
        </div>
      </div>
    </div>
  );
}

interface ReleasBlockersProps {
  blockers: ReleaseBlocker[];
}

export function ReleaseBlockers({ blockers }: ReleasBlockersProps) {
  if (blockers.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100">Release Blockers</h2>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-8 text-center">
          <div className="text-emerald-400 text-2xl mb-2">✓</div>
          <p className="text-sm text-emerald-400 font-medium">No release blockers found</p>
          <p className="text-xs text-slate-500 mt-1">All critical checks have passed</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100">Release Blockers</h2>
          <p className="text-xs text-slate-500">{blockers.length} critical issue{blockers.length > 1 ? "s" : ""} preventing safe release</p>
        </div>
      </div>
      <div className="space-y-4">
        {blockers.map((b, i) => (
          <BlockerCard key={b.id} blocker={b} index={i} />
        ))}
      </div>
    </section>
  );
}
