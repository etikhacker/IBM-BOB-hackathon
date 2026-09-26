import type {
  AnalysisReport,
  RepositoryContext,
  CheckProgress,
  AnalysisProgress,
} from "./types";
import { demoReportRun1, demoReportRun2 } from "./demo-data";

// ─── Simulated check steps ─────────────────────────────────────────────────

const CHECK_STEPS = [
  { checkId: "repo-structure", name: "Repository Structure", messages: ["Scanning directory tree...", "Inspecting repository structure"] },
  { checkId: "test-status", name: "Test Suite", messages: ["Searching for test files...", "Running test verification"] },
  { checkId: "env-vars", name: "Environment Variables", messages: ["Scanning env references...", "Checking environment configuration"] },
  { checkId: "security-scan", name: "Security Scan", messages: ["Analyzing security patterns...", "Scanning for vulnerabilities"] },
  { checkId: "db-migrations", name: "Database Migrations", messages: ["Comparing migration history...", "Reviewing database migrations"] },
  { checkId: "api-compatibility", name: "API Compatibility", messages: ["Comparing API surface...", "Reviewing potential breaking API changes"] },
  { checkId: "docs-review", name: "Documentation", messages: ["Scanning documentation files...", "Reviewing documentation coverage"] },
  { checkId: "deploy-readiness", name: "Deployment Readiness", messages: ["Validating build config...", "Checking deployment configuration"] },
];

// ─── Timing config per check (ms) ────────────────────────────────────────────

const CHECK_DURATIONS: Record<string, number> = {
  "repo-structure": 600,
  "test-status": 1400,
  "env-vars": 900,
  "security-scan": 1800,
  "db-migrations": 1100,
  "api-compatibility": 1300,
  "docs-review": 700,
  "deploy-readiness": 2000,
};

// ─── Analyzer class ───────────────────────────────────────────────────────────

export type ProgressCallback = (progress: AnalysisProgress) => void;

export class AnalysisEngine {
  private abortController: AbortController | null = null;

  abort() {
    this.abortController?.abort();
  }

  async analyze(
    context: RepositoryContext,
    onProgress: ProgressCallback
  ): Promise<AnalysisReport> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    // Initialize progress
    const initialChecks: CheckProgress[] = CHECK_STEPS.map((step) => ({
      checkId: step.checkId,
      name: step.name,
      status: "pending",
      statusMessage: "Waiting...",
    }));

    onProgress({
      overall: "running",
      currentStep: 0,
      totalSteps: CHECK_STEPS.length,
      checks: initialChecks,
      message: "Initializing analysis engine...",
    });

    const checks: CheckProgress[] = [...initialChecks];

    // Run checks with simulated delays (some in parallel)
    // First: repo-structure (fast, alone)
    // Then: test + env + security in parallel
    // Then: db + api in parallel
    // Then: docs + deploy in parallel

    const runCheck = async (index: number): Promise<void> => {
      if (signal.aborted) return;
      const step = CHECK_STEPS[index];

      // Mark as running
      checks[index] = {
        checkId: step.checkId,
        name: step.name,
        status: "running",
        statusMessage: step.messages[0],
      };

      onProgress({
        overall: "running",
        currentStep: checks.filter((c) => c.status !== "pending" && c.status !== "running").length,
        totalSteps: CHECK_STEPS.length,
        checks: [...checks],
        message: step.messages[1],
      });

      await delay(CHECK_DURATIONS[step.checkId] || 1000, signal);
      if (signal.aborted) return;

      // Mark as completed with a temporary "passed" state; final status is set in the batch at the end
      checks[index] = {
        checkId: step.checkId,
        name: step.name,
        status: "passed",
        statusMessage: "Completed",
      };

      onProgress({
        overall: "running",
        currentStep: checks.filter((c) => c.status !== "pending" && c.status !== "running").length,
        totalSteps: CHECK_STEPS.length,
        checks: [...checks],
        message: step.messages[1],
      });
    };

    // Batch 1: repo structure
    await runCheck(0);
    if (signal.aborted) throw new Error("Aborted");

    // Batch 2: test, env, security in parallel
    await Promise.all([runCheck(1), runCheck(2), runCheck(3)]);
    if (signal.aborted) throw new Error("Aborted");

    // Batch 3: db, api in parallel
    await Promise.all([runCheck(4), runCheck(5)]);
    if (signal.aborted) throw new Error("Aborted");

    // Batch 4: docs, deploy in parallel
    await Promise.all([runCheck(6), runCheck(7)]);
    if (signal.aborted) throw new Error("Aborted");

    // Get the appropriate demo report
    const report = context.runNumber === 1 ? demoReportRun1 : demoReportRun2;

    // Mark all checks with their final status from the report
    const finalReport: AnalysisReport = {
      ...report,
      repository: {
        ...report.repository,
        analyzedAt: new Date().toISOString(),
      },
      runNumber: context.runNumber,
    };

    // Update checks display with final statuses
    const finalChecks: CheckProgress[] = CHECK_STEPS.map((step) => {
      const result = finalReport.checks.find((c) => c.id === step.checkId);
      return {
        checkId: step.checkId,
        name: step.name,
        status: result?.status ?? "passed",
        statusMessage: result?.summary ?? "Check complete",
      };
    });

    onProgress({
      overall: "complete",
      currentStep: CHECK_STEPS.length,
      totalSteps: CHECK_STEPS.length,
      checks: finalChecks,
      message: "Analysis complete.",
    });

    return finalReport;
  }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("Aborted"));
    });
  });
}

// ─── Export helpers ───────────────────────────────────────────────────────────

export function exportReportAsJSON(report: AnalysisReport): string {
  return JSON.stringify(report, null, 2);
}

export function exportReportAsMarkdown(report: AnalysisReport): string {
  const r = report;
  const statusEmoji = r.status === "ready" ? "✅" : r.status === "blocked" ? "🚫" : "⚠️";
  const statusLabel =
    r.status === "ready"
      ? "READY FOR RELEASE"
      : r.status === "blocked"
      ? "BLOCKED"
      : "NEEDS ATTENTION";

  const lines: string[] = [
    `# ReleaseGuard AI — Release Report`,
    ``,
    `**Repository:** ${r.repository.name}`,
    `**Branch:** ${r.repository.branch}`,
    `**Commit:** ${r.repository.commit}`,
    `**Analyzed:** ${new Date(r.repository.analyzedAt).toLocaleString()}`,
    ``,
    `## Overall Status: ${statusEmoji} ${statusLabel}`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Risk Score | ${r.riskScore}/100 |`,
    `| Passed | ${r.passedCount} |`,
    `| Warnings | ${r.warningCount} |`,
    `| Failed | ${r.failedCount} |`,
    ``,
  ];

  if (r.blockers.length > 0) {
    lines.push(`## 🚫 Release Blockers`, ``);
    r.blockers.forEach((b, i) => {
      lines.push(
        `### ${i + 1}. ${b.title}`,
        `**Why it matters:** ${b.whyItMatters}`,
        `**Affected:** \`${b.affectedFile}\``,
        `**Fix:** ${b.suggestedFix}`,
        `**Effort:** ${b.estimatedEffort}`,
        ``
      );
    });
  }

  lines.push(`## Check Results`, ``);
  r.checks.forEach((c) => {
    const icon = c.status === "passed" ? "✅" : c.status === "warning" ? "⚠️" : c.status === "failed" ? "❌" : "⏳";
    lines.push(`### ${icon} ${c.name}`, `**Status:** ${c.status} | **Severity:** ${c.severity}`, ``, c.summary, ``, `> ${c.recommendation}`, ``);
  });

  lines.push(`## Recommended Fix Plan`, ``);

  const addSection = (title: string, items: typeof r.fixPlan.immediate) => {
    if (items.length === 0) return;
    lines.push(`### ${title}`, ``);
    items.forEach((item) => {
      lines.push(`#### ${item.title}`, item.description, ``, `**Implementation:** ${item.suggestedImplementation}`, `**Verify:** ${item.verificationMethod}`, ``);
    });
  };

  addSection("🔴 Immediate", r.fixPlan.immediate);
  addSection("🟡 Before Release", r.fixPlan.beforeRelease);
  addSection("🟢 Future Improvements", r.fixPlan.future);

  lines.push(`---`, `*Generated by ReleaseGuard AI powered by IBM Bob 2.0*`);

  return lines.join("\n");
}

// ─── Singleton engine ─────────────────────────────────────────────────────────

export const analysisEngine = new AnalysisEngine();
