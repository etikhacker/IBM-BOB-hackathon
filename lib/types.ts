// ─── Core Domain Types ────────────────────────────────────────────────────────

export type CheckStatus = "pending" | "running" | "passed" | "warning" | "failed";
export type Severity = "critical" | "high" | "medium" | "low" | "informational";
export type ReleaseStatus = "ready" | "needs_attention" | "blocked";
export type ProjectType = "nextjs" | "react" | "fastapi" | "python" | "nodejs" | "other";
export type AnalysisSource = "demo" | "github" | "zip";
export type Priority = "immediate" | "before_release" | "future";

// ─── Check Result ─────────────────────────────────────────────────────────────

export interface AffectedFile {
  path: string;
  line?: number;
  snippet?: string;
}

export interface CheckResult {
  id: string;
  name: string;
  category: string;
  status: CheckStatus;
  severity: Severity;
  summary: string;
  details: string;
  affectedFiles: AffectedFile[];
  recommendation: string;
  expandableDetails?: string;
  duration?: number; // ms
}

// ─── Release Blocker ──────────────────────────────────────────────────────────

export interface ReleaseBlocker {
  id: string;
  title: string;
  whyItMatters: string;
  affectedFile: string;
  suggestedFix: string;
  estimatedEffort: string;
  severity: Severity;
  checkId: string;
}

// ─── Fix Plan ─────────────────────────────────────────────────────────────────

export interface FixRecommendation {
  id: string;
  priority: Priority;
  title: string;
  description: string;
  suggestedImplementation: string;
  relatedFiles: string[];
  verificationMethod: string;
  checkId: string;
}

export interface FixPlan {
  immediate: FixRecommendation[];
  beforeRelease: FixRecommendation[];
  future: FixRecommendation[];
}

// ─── Repository Metadata ─────────────────────────────────────────────────────

export interface RepositoryMetadata {
  name: string;
  url?: string;
  branch: string;
  commit: string;
  projectType: ProjectType;
  source: AnalysisSource;
  analyzedAt: string; // ISO string
}

// ─── Analysis Report ─────────────────────────────────────────────────────────

export interface AnalysisReport {
  id: string;
  repository: RepositoryMetadata;
  status: ReleaseStatus;
  riskScore: number; // 0-100
  passedCount: number;
  warningCount: number;
  failedCount: number;
  checks: CheckResult[];
  blockers: ReleaseBlocker[];
  fixPlan: FixPlan;
  runNumber: number; // 1 = first run, 2+ = re-run
  ibmBobInsights?: IBMBobInsight[];
}

// ─── IBM Bob Insights ────────────────────────────────────────────────────────

export interface IBMBobInsight {
  id: string;
  type: "code_analysis" | "security" | "optimization" | "recommendation";
  title: string;
  content: string;
  confidence: number; // 0-1
  relatedCheckId?: string;
}

// ─── Repository Context (for analyzer input) ─────────────────────────────────

export interface RepositoryContext {
  name: string;
  projectType: ProjectType;
  source: AnalysisSource;
  runNumber: number;
  files?: string[];
  url?: string;
}

// ─── Check Interface ──────────────────────────────────────────────────────────

export interface RepositoryCheck {
  id: string;
  name: string;
  description: string;
  run(context: RepositoryContext, runNumber: number): Promise<CheckResult[]>;
}

// ─── Analysis Progress ────────────────────────────────────────────────────────

export interface CheckProgress {
  checkId: string;
  name: string;
  status: CheckStatus;
  statusMessage: string;
}

export interface AnalysisProgress {
  overall: "idle" | "running" | "complete" | "error";
  currentStep: number;
  totalSteps: number;
  checks: CheckProgress[];
  message: string;
}

// ─── Form Input ───────────────────────────────────────────────────────────────

export interface AnalysisFormInput {
  source: AnalysisSource;
  url?: string;
  projectName?: string;
  projectType: ProjectType;
  file?: File;
}

// ─── Export formats ───────────────────────────────────────────────────────────

export type ExportFormat = "json" | "markdown";
