"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Navbar } from "@/components/navbar";
import { Button, ProgressBar, Badge } from "@/components/ui";
import { CheckCard } from "@/components/check-card";
import { ReleaseBlockers } from "@/components/release-blockers";
import { FixPlanSection } from "@/components/fix-plan";
import {
  cn,
  getStatusConfig,
  getRiskColor,
  formatCommit,
  formatDate,
} from "@/lib/utils";
import type { AnalysisReport, IBMBobInsight } from "@/lib/types";

// ─── Status Header ────────────────────────────────────────────────────────────

function StatusHeader({ report }: { report: AnalysisReport }) {
  const config = getStatusConfig(report.status);
  const riskColor = getRiskColor(report.riskScore);

  return (
    <div
      className={cn("rounded-2xl border p-5 sm:p-8", config.bg, config.border)}
      role="region"
      aria-label={`Release status: ${config.label}`}
    >
      {/* Top row: repo metadata */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="font-medium text-slate-400">{report.repository.name}</span>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          branch{" "}
          <code className="text-slate-300 font-mono">{report.repository.branch}</code>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          commit{" "}
          <code className="text-slate-300 font-mono">{formatCommit(report.repository.commit)}</code>
        </span>
        <span aria-hidden="true">·</span>
        <span>{formatDate(report.repository.analyzedAt)}</span>
        {report.runNumber > 1 && (
          <>
            <span aria-hidden="true">·</span>
            <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Re-run #{report.runNumber}
            </Badge>
          </>
        )}
      </div>

      {/* Main status + risk score row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex-1 min-w-0">
          {/* Status pill */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 border",
                config.badge
              )}
              aria-hidden="true"
            >
              <div className={cn("w-2 h-2 rounded-full shrink-0", config.dot)} />
              <span className="text-sm font-black tracking-widest uppercase">{config.label}</span>
            </div>
          </div>

          {/* Human-readable summary */}
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            {report.status === "ready"
              ? "All critical checks passed. This repository is safe to deploy to production."
              : report.status === "blocked"
              ? `${report.blockers.length} critical issue${report.blockers.length > 1 ? "s" : ""} must be resolved before this repository can be safely deployed.`
              : "Non-critical warnings detected. Review and resolve these issues before the release."}
          </p>
        </div>

        {/* Risk score */}
        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
          <div className="text-center sm:text-right">
            <div
              className={cn("text-5xl font-black tabular-nums leading-none", riskColor)}
              aria-label={`Risk score: ${report.riskScore} out of 100`}
            >
              {report.riskScore}
            </div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Risk Score</div>
          </div>
          <div className="w-32 sm:w-28">
            <ProgressBar
              value={report.riskScore}
              color={
                report.riskScore <= 20
                  ? "bg-emerald-400"
                  : report.riskScore <= 50
                  ? "bg-amber-400"
                  : "bg-red-400"
              }
              height="h-2"
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-700/30"
        role="list"
        aria-label="Check summary"
      >
        {[
          { label: "Passed", value: report.passedCount, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Warnings", value: report.warningCount, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Failed", value: report.failedCount, color: "text-red-400", bg: "bg-red-400/10" },
        ].map((stat) => (
          <div
            key={stat.label}
            role="listitem"
            className={cn("rounded-lg p-3 text-center", stat.bg)}
            aria-label={`${stat.value} ${stat.label}`}
          >
            <div className={cn("text-2xl sm:text-3xl font-bold tabular-nums", stat.color)}>
              {stat.value}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Before/After transition banner ─────────────────────────────────────────

function TransitionBanner({
  previous,
  current,
}: {
  previous: AnalysisReport;
  current: AnalysisReport;
}) {
  if (previous.status === current.status) return null;

  const prevConfig = getStatusConfig(previous.status);
  const currConfig = getStatusConfig(current.status);
  const isImproved =
    current.status === "ready" ||
    (current.status === "needs_attention" && previous.status === "blocked");

  const riskDelta = previous.riskScore - current.riskScore;
  const fixedCount = previous.failedCount - current.failedCount;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 sm:p-5",
        isImproved
          ? "border-emerald-500/40 bg-emerald-500/8"
          : "border-amber-500/40 bg-amber-500/8"
      )}
      role="status"
      aria-live="polite"
      aria-label={isImproved ? "Status improved" : "Status changed"}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg",
            isImproved ? "bg-emerald-500/20" : "bg-amber-500/20"
          )}
          aria-hidden="true"
        >
          {isImproved ? "🎉" : "⚠️"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-100 mb-1">
            {isImproved ? "Release status improved!" : "Status changed"}
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold rounded px-2 py-0.5 border",
                getStatusConfig(previous.status).badge
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", getStatusConfig(previous.status).dot)} aria-hidden="true" />
              {prevConfig.label}
            </span>
            <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold rounded px-2 py-0.5 border",
                getStatusConfig(current.status).badge
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", getStatusConfig(current.status).dot)} aria-hidden="true" />
              {currConfig.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isImproved ? (
              <>
                Risk score dropped from{" "}
                <span className="text-red-400 font-semibold">{previous.riskScore}</span>
                {" "}to{" "}
                <span className="text-emerald-400 font-semibold">{current.riskScore}</span>
                {riskDelta > 0 && (
                  <span className="text-emerald-400"> (−{riskDelta} points)</span>
                )}
                {fixedCount > 0 && (
                  <>
                    {" "}·{" "}
                    <span className="text-emerald-400 font-semibold">{fixedCount} critical issue{fixedCount > 1 ? "s" : ""} resolved</span>
                  </>
                )}
              </>
            ) : (
              `Re-analysis detected ${current.failedCount} failed check${current.failedCount !== 1 ? "s" : ""}.`
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── IBM Bob Insights panel ──────────────────────────────────────────────────

function IBMBobInsights({ insights }: { insights: IBMBobInsight[] }) {
  if (!insights || insights.length === 0) return null;

  return (
    <section aria-label="IBM Bob 2.0 AI Insights">
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-blue-500/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
          <h2 className="text-xs font-semibold text-blue-300 uppercase tracking-wide">
            IBM Bob 2.0 — AI Insights
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className="rounded-lg bg-slate-900/40 border border-slate-700/40 p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-blue-300">{insight.title}</span>
                <div
                  className="flex items-center gap-1.5 shrink-0"
                  aria-label={`Confidence: ${Math.round(insight.confidence * 100)}%`}
                >
                  <span className="text-xs text-slate-500">Confidence</span>
                  <div
                    className="w-16 h-1 bg-slate-700 rounded-full"
                    role="progressbar"
                    aria-valuenow={Math.round(insight.confidence * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-1 bg-blue-400 rounded-full transition-all"
                      style={{ width: `${insight.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-blue-400 tabular-nums w-7 text-right">
                    {Math.round(insight.confidence * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{insight.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Export Toolbar ───────────────────────────────────────────────────────────

function ExportToolbar({
  onExport,
  onRerun,
}: {
  onExport: (f: "json" | "markdown") => void;
  onRerun: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Report actions">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onExport("json")}
        aria-label="Download report as JSON"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export JSON
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onExport("markdown")}
        aria-label="Download report as Markdown"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Export Markdown
      </Button>
      <div className="flex-1 sm:flex-none" />
      <Button
        variant="primary"
        size="sm"
        onClick={onRerun}
        aria-label="Run analysis again"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Run Analysis Again
      </Button>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function ReportDashboard() {
  const { state, rerunAnalysis, exportReport, copyFixPlan } = useApp();
  // All hooks must be called unconditionally — before any early return
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const report = state.report;

  if (!report) return null;

  const categories = [
    "all",
    ...Array.from(new Set(report.checks.map((c) => c.category))),
  ];
  const filteredChecks =
    activeCategory === "all"
      ? report.checks
      : report.checks.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar
        showBack
        rightSlot={
          <Button
            variant="primary"
            size="sm"
            onClick={rerunAnalysis}
            aria-label="Run analysis again"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Re-run
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Transition banner — shown after a re-run with status change */}
        {state.previousReport && (
          <TransitionBanner previous={state.previousReport} current={report} />
        )}

        {/* Status header */}
        <StatusHeader report={report} />

        {/* Export / re-run toolbar */}
        <ExportToolbar onExport={exportReport} onRerun={rerunAnalysis} />

        {/* IBM Bob AI insights */}
        {report.ibmBobInsights && report.ibmBobInsights.length > 0 && (
          <IBMBobInsights insights={report.ibmBobInsights} />
        )}

        {/* Release blockers */}
        <ReleaseBlockers blockers={report.blockers} />

        {/* Check results with category filter */}
        <section aria-label="Check results">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Check Results</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {report.checks.length} checks performed
              </p>
            </div>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filter checks by category"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={cn(
                    "rounded px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                    activeCategory === cat
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300 hover:border-slate-600"
                  )}
                >
                  {cat === "all" ? "All" : cat}
                  {cat === "all" && (
                    <span className="ml-1 text-slate-600" aria-hidden="true">
                      {report.checks.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filteredChecks.map((check) => (
              <CheckCard key={check.id} check={check} />
            ))}
          </div>
        </section>

        {/* Fix plan */}
        <FixPlanSection plan={report.fixPlan} onCopy={copyFixPlan} />

        {/* Footer actions */}
        <div className="border-t border-slate-700/40 pt-6">
          <ExportToolbar onExport={exportReport} onRerun={rerunAnalysis} />
        </div>

        <p className="text-center text-xs text-slate-700 pb-4">
          Analysis powered by IBM Bob 2.0 &middot; ReleaseGuard AI
        </p>
      </main>
    </div>
  );
}
