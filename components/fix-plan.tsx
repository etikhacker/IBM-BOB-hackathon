"use client";

import { useState } from "react";
import type { FixPlan, FixRecommendation } from "@/lib/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG = {
  immediate: {
    label: "Immediate",
    desc: "Must be fixed before deployment",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    dotColor: "bg-red-400",
    icon: "🔴",
  },
  before_release: {
    label: "Before Release",
    desc: "Should be fixed before release",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    dotColor: "bg-amber-400",
    icon: "🟡",
  },
  future: {
    label: "Future Improvements",
    desc: "Non-blocking improvements",
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
    dotColor: "bg-sky-400",
    icon: "🟢",
  },
} as const;

function FixCard({ rec }: { rec: FixRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const config = PRIORITY_CONFIG[rec.priority];

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", config.dotColor)} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-200 mb-1">{rec.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-2 border-t border-slate-700/40 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors cursor-pointer"
        aria-expanded={expanded}
      >
        <span>{expanded ? "Hide implementation" : "Show implementation"}</span>
        <svg className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-700/40 bg-slate-900/20 space-y-3 pt-3">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Implementation
            </div>
            <pre className="text-xs text-slate-300 bg-slate-900/60 border border-slate-700/50 rounded p-3 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {rec.suggestedImplementation}
            </pre>
          </div>
          {rec.relatedFiles.length > 0 && (
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Related Files
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rec.relatedFiles.map((f) => (
                  <code key={f} className="text-xs bg-slate-900/60 border border-slate-700/50 rounded px-2 py-0.5 text-violet-300 font-mono">
                    {f}
                  </code>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Verification
            </div>
            <p className="text-xs text-slate-400">{rec.verificationMethod}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface FixPlanSectionProps {
  plan: FixPlan;
  onCopy: () => void;
}

export function FixPlanSection({ plan, onCopy }: FixPlanSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalItems =
    plan.immediate.length + plan.beforeRelease.length + plan.future.length;

  if (totalItems === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-100">Recommended Fix Plan</h2>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-8 text-center">
          <p className="text-sm text-emerald-400 font-medium">No fixes required</p>
          <p className="text-xs text-slate-500 mt-1">All checks passed — ready to ship!</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Recommended Fix Plan</h2>
          <p className="text-xs text-slate-500 mt-0.5">{totalItems} recommendation{totalItems > 1 ? "s" : ""} grouped by priority</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Fix Plan
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {(["immediate", "before_release", "future"] as const).map((priority) => {
          const items = priority === "immediate" ? plan.immediate : priority === "before_release" ? plan.beforeRelease : plan.future;
          if (items.length === 0) return null;
          const config = PRIORITY_CONFIG[priority];
          return (
            <div key={priority}>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-sm">{config.icon}</span>
                <div>
                  <span className={cn("text-sm font-semibold", config.color)}>{config.label}</span>
                  <span className="text-xs text-slate-500 ml-2">{config.desc}</span>
                </div>
                <span className={cn("ml-auto text-xs rounded-full px-2 py-0.5 border", config.bg, config.color)}>
                  {items.length}
                </span>
              </div>
              <div className="space-y-2 pl-0">
                {items.map((rec) => (
                  <FixCard key={rec.id} rec={rec} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
