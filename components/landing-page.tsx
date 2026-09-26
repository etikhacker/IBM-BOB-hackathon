"use client";

import { useApp } from "@/lib/app-context";
import { Button, Logo, Card } from "@/components/ui";

const CHECKS = [
  {
    label: "Test Suite",
    desc: "Detects missing tests, broken configurations, and insufficient coverage",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Security Scan",
    desc: "Identifies vulnerabilities, debug mode leaks, and missing security headers",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: "Environment Variables",
    desc: "Validates all required secrets and config are present before deploy",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Database Migrations",
    desc: "Catches pending or table-locking migrations that would cause downtime",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  {
    label: "API Compatibility",
    desc: "Flags breaking changes that would silently break existing API clients",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Documentation",
    desc: "Ensures README, CHANGELOG, and API docs are current with this release",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Repo Structure",
    desc: "Validates project layout, naming conventions, and required config files",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    label: "Deployment Readiness",
    desc: "Confirms the production build compiles and the CI/CD pipeline is green",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Connect Your Repository",
    desc: "Paste a GitHub URL, upload a ZIP archive, or use the built-in demo to see results instantly — no credentials required.",
  },
  {
    step: "02",
    title: "8 Parallel AI Checks",
    desc: "IBM Bob 2.0 simultaneously inspects security, tests, config, migrations, API contracts, and build readiness.",
  },
  {
    step: "03",
    title: "Act on a Prioritized Plan",
    desc: "Every finding comes with affected files, severity levels, effort estimates, and exact remediation steps.",
  },
];

export function LandingPage() {
  const { navigate, startAnalysis } = useApp();

  const handleDemo = () => {
    startAnalysis({ source: "demo", projectType: "nextjs", projectName: "my-saas-app" });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* ── Navbar ── */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("landing")}
            className="flex items-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
            aria-label="ReleaseGuard AI home"
          >
            <Logo size="sm" />
            <span className="font-semibold text-sm tracking-tight">ReleaseGuard AI</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block">Powered by IBM Bob 2.0</span>
            <Button size="sm" onClick={() => navigate("form")}>Analyze Repository</Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" aria-hidden="true" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/8 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
            IBM Bob 2.0 Hackathon &mdash; Production-Quality MVP
          </div>

          {/* Problem statement, then solution */}
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">
            The problem every team faces before shipping
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            You ship. Something breaks.{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Not&nbsp;anymore.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Developers spend hours before every release manually checking tests, environment
            variables, security settings, database migrations, and build pipelines.
            Steps get missed. Production breaks.
          </p>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            ReleaseGuard AI runs 8 parallel checks in under 30 seconds and tells you
            exactly what to fix before you deploy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate("form")} className="w-full sm:w-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Analyze a Repository
            </Button>
            <Button size="lg" variant="outline" onClick={handleDemo} className="w-full sm:w-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Demo Report
            </Button>
          </div>

          {/* Status legend */}
          <div className="flex items-center justify-center gap-6 mt-12 flex-wrap" role="list" aria-label="Possible release statuses">
            <div role="listitem" className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" aria-hidden="true" />
              <span className="text-red-400 font-semibold tracking-wide">BLOCKED</span>
              <span className="text-slate-600 hidden sm:inline">— critical issues present</span>
            </div>
            <div role="listitem" className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
              <span className="text-amber-400 font-semibold tracking-wide">NEEDS ATTENTION</span>
              <span className="text-slate-600 hidden sm:inline">— warnings to review</span>
            </div>
            <div role="listitem" className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
              <span className="text-emerald-400 font-semibold tracking-wide">READY FOR RELEASE</span>
              <span className="text-slate-600 hidden sm:inline">— safe to deploy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-slate-700/40 bg-slate-800/30" aria-label="How it works">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">From repository to release confidence in 3 steps</h2>
            <p className="text-slate-400 text-sm">No setup. No credentials required for the demo.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WORKFLOW.map((item) => (
              <Card key={item.step} className="p-6 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
                <div className="absolute top-4 right-4 text-5xl font-black text-slate-700/40 group-hover:text-violet-900/40 transition-colors select-none" aria-hidden="true">
                  {item.step}
                </div>
                <div className="relative">
                  <h3 className="font-semibold text-slate-100 mb-2 text-sm">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Checks grid ── */}
      <section className="border-t border-slate-700/40" aria-label="Analysis checks">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">8 checks running in parallel</h2>
            <p className="text-slate-400 text-sm">Every finding includes severity, affected files, and an exact fix with estimated effort</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHECKS.map((check) => (
              <Card key={check.label} className="p-4 hover:border-violet-500/30 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 group-hover:bg-violet-600/30 transition-colors" aria-hidden="true">
                    {check.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200 mb-1">{check.label}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{check.desc}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── IBM Bob 2.0 section ── */}
      <section className="border-t border-slate-700/40 bg-slate-800/20" aria-label="IBM Bob 2.0 integration">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300 mb-6">
                IBM Bob 2.0 Integration
              </div>
              <h2 className="text-2xl font-bold mb-4">The entire product was built with IBM Bob 2.0</h2>
              <p className="text-slate-400 leading-relaxed mb-2 text-sm">
                ReleaseGuard AI was designed, implemented, debugged, and documented entirely inside
                IBM Bob 2.0 using Agent mode, parallel subagent tasks, and autonomous code analysis.
              </p>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                Bob also powers the analysis engine at runtime — performing intelligent
                pattern detection, risk scoring, and fix-plan generation.
              </p>
              <ul className="space-y-3" role="list">
                {[
                  "Autonomous multi-file code generation in a single Agent session",
                  "Parallel subagents for frontend, backend, and testing tasks",
                  "Security pattern detection with confidence scoring",
                  "N+1 query and performance issue identification",
                  "Release risk probability estimation (73% → 18%)",
                  "Prioritized, actionable fix plan generation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300" role="listitem">
                    <svg className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-5 bg-slate-900/60" aria-label="IBM Bob 2.0 live insight examples">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                <span className="text-xs text-slate-500 font-mono">IBM BOB 2.0 — SAMPLE INSIGHTS</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-800 border border-slate-700/50 p-3">
                  <div className="text-xs text-slate-500 mb-1.5">Security Pattern Detected</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    NextAuth configuration lacks explicit session expiry. Recommend{" "}
                    <code className="text-violet-300 text-xs bg-violet-900/30 px-1 rounded">maxAge: 3600</code>{" "}
                    for production hardening.
                  </p>
                  <div className="flex items-center gap-2 mt-2.5" aria-label="Confidence: 91%">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div className="flex-1 h-1 bg-slate-700 rounded-full" role="progressbar" aria-valuenow={91} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-1 bg-blue-400 rounded-full" style={{ width: "91%" }} />
                    </div>
                    <div className="text-xs text-blue-400 tabular-nums">91%</div>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-800 border border-slate-700/50 p-3">
                  <div className="text-xs text-slate-500 mb-1.5">Release Risk Assessment</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    73% probability of a production incident if deployed without resolving the 2 critical blockers.
                  </p>
                  <div className="flex items-center gap-2 mt-2.5" aria-label="Confidence: 94%">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div className="flex-1 h-1 bg-slate-700 rounded-full" role="progressbar" aria-valuenow={94} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-1 bg-blue-400 rounded-full" style={{ width: "94%" }} />
                    </div>
                    <div className="text-xs text-blue-400 tabular-nums">94%</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-slate-700/40" aria-label="Call to action">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Stop guessing. Start shipping with confidence.</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm sm:text-base">
            Run a full pre-release verification in under 30 seconds.
            No external credentials required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate("form")}>
              Analyze a Repository
            </Button>
            <Button size="lg" variant="outline" onClick={handleDemo}>
              View Demo Report
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-700/40 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="text-sm text-slate-500">ReleaseGuard AI</span>
          </div>
          <p className="text-xs text-slate-600 text-center sm:text-right">
            Built entirely with IBM Bob 2.0 &nbsp;&middot;&nbsp; IBM Bob Hackathon 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
