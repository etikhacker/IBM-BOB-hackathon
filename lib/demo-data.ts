import type {
  AnalysisReport,
  CheckResult,
  ReleaseBlocker,
  FixPlan,
  IBMBobInsight,
} from "./types";

// ─── Run 1: BLOCKED ───────────────────────────────────────────────────────────

const checksRun1: CheckResult[] = [
  {
    id: "repo-structure",
    name: "Repository Structure",
    category: "Structure",
    status: "passed",
    severity: "informational",
    summary: "Repository structure is clean and well-organized.",
    details:
      "Found standard Next.js project layout with clear separation of concerns. App router pattern is correctly implemented. Public assets are properly organized.",
    affectedFiles: [],
    recommendation: "No action required.",
    expandableDetails:
      "Detected: app/, components/, lib/, public/ directories. package.json, tsconfig.json, next.config.ts all present. .gitignore properly configured.",
    duration: 312,
  },
  {
    id: "test-status",
    name: "Test Suite",
    category: "Quality",
    status: "failed",
    severity: "high",
    summary: "Test suite is missing — no test files detected.",
    details:
      "No test files (*.test.ts, *.spec.ts, *.test.tsx) were found in the repository. Jest and React Testing Library are not installed. A CI pipeline cannot verify code correctness without tests.",
    affectedFiles: [
      { path: "package.json", snippet: '"test": "echo \'Error: no test specified\' && exit 1"' },
    ],
    recommendation:
      "Add unit tests for critical business logic and integration tests for API routes. Install Jest and @testing-library/react.",
    expandableDetails:
      "A minimum viable test coverage of 60% for business logic is recommended. Start with smoke tests for all pages and unit tests for the analysis engine.",
    duration: 1240,
  },
  {
    id: "env-vars",
    name: "Environment Variables",
    category: "Configuration",
    status: "failed",
    severity: "critical",
    summary: "Required environment variables are missing from production configuration.",
    details:
      "DATABASE_URL, OPENAI_API_KEY, and NEXTAUTH_SECRET are referenced in the codebase but not present in .env.production or deployment configuration. The application will fail on startup.",
    affectedFiles: [
      { path: "lib/db.ts", line: 3, snippet: "process.env.DATABASE_URL" },
      { path: "lib/ai.ts", line: 7, snippet: "process.env.OPENAI_API_KEY" },
      { path: "app/api/auth/[...nextauth]/route.ts", line: 12, snippet: "process.env.NEXTAUTH_SECRET" },
    ],
    recommendation:
      "Add all required environment variables to your deployment platform (Vercel, Railway, etc.) before releasing.",
    expandableDetails:
      "Use a .env.example file to document required variables. Consider using a secrets manager for production credentials.",
    duration: 890,
  },
  {
    id: "security-scan",
    name: "Security Scan",
    category: "Security",
    status: "warning",
    severity: "medium",
    summary: "Debug mode may be enabled in production build.",
    details:
      "next.config.ts does not explicitly disable source maps for production. Verbose error details could expose internal stack traces to end users. No Content Security Policy header is configured.",
    affectedFiles: [
      { path: "next.config.ts", line: 4, snippet: "productionBrowserSourceMaps: undefined" },
      { path: "middleware.ts", snippet: "// TODO: add security headers" },
    ],
    recommendation:
      "Set productionBrowserSourceMaps: false in next.config.ts. Add security headers via middleware or next.config.ts headers().",
    expandableDetails:
      "Recommended headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Content-Security-Policy. Use next-secure-headers or configure manually.",
    duration: 2100,
  },
  {
    id: "db-migrations",
    name: "Database Migrations",
    category: "Database",
    status: "warning",
    severity: "medium",
    summary: "2 pending migrations detected that have not been run.",
    details:
      "Migration files 0003_add_reports_table.sql and 0004_add_user_preferences.sql exist in /migrations but are not reflected in the migration history. Running these in production may lock tables.",
    affectedFiles: [
      { path: "migrations/0003_add_reports_table.sql" },
      { path: "migrations/0004_add_user_preferences.sql" },
    ],
    recommendation:
      "Run migrations in a maintenance window or use a zero-downtime migration strategy. Test migrations against a production-sized dataset.",
    expandableDetails:
      "Both migrations use ALTER TABLE with NOT NULL columns without defaults, which can lock tables on large datasets. Consider adding default values or using multi-step migrations.",
    duration: 760,
  },
  {
    id: "api-compatibility",
    name: "API Compatibility",
    category: "API",
    status: "passed",
    severity: "informational",
    summary: "No breaking API changes detected.",
    details:
      "All existing API endpoints maintain backward compatibility. No removed endpoints, no changed response shapes, no removed required fields detected.",
    affectedFiles: [],
    recommendation: "No action required.",
    expandableDetails:
      "Compared current API surface against last tagged release. 3 new endpoints added (additive changes only). All existing consumers should remain unaffected.",
    duration: 1450,
  },
  {
    id: "docs-review",
    name: "Documentation",
    category: "Documentation",
    status: "warning",
    severity: "low",
    summary: "README is outdated and setup instructions are incomplete.",
    details:
      "README.md references old environment variable names. CHANGELOG.md has not been updated since v0.2.0. API documentation is missing for 3 new endpoints added in this release.",
    affectedFiles: [
      { path: "README.md", line: 34, snippet: "DATABASE_CONNECTION_STRING (deprecated)" },
      { path: "CHANGELOG.md", snippet: "Last entry: v0.2.0 (3 months ago)" },
    ],
    recommendation:
      "Update README.md with correct environment variable names. Add a CHANGELOG entry for this release. Document the 3 new API endpoints.",
    expandableDetails:
      "Good documentation reduces onboarding time and support requests. Consider automating CHANGELOG generation with conventional commits.",
    duration: 580,
  },
  {
    id: "deploy-readiness",
    name: "Deployment Readiness",
    category: "Deployment",
    status: "failed",
    severity: "critical",
    summary: "Production build fails due to missing environment variables.",
    details:
      "npm run build exits with code 1. TypeScript compilation fails because DATABASE_URL and OPENAI_API_KEY are not defined in the build environment. CI/CD pipeline will block deployment.",
    affectedFiles: [
      { path: "lib/db.ts", line: 3 },
      { path: "next.config.ts", line: 8 },
    ],
    recommendation:
      "Set all required environment variables in your CI/CD environment and deployment platform before attempting a production build.",
    expandableDetails:
      "The build process validates environment variables at compile time due to TypeScript strict mode. This is a good practice but requires all variables to be present in CI.",
    duration: 3200,
  },
];

const blockersRun1: ReleaseBlocker[] = [
  {
    id: "blocker-env",
    title: "Missing required environment variables",
    whyItMatters:
      "The application cannot connect to the database or authenticate API calls in production. Deployment will result in immediate runtime errors.",
    affectedFile: "lib/db.ts, lib/ai.ts, app/api/auth/[...nextauth]/route.ts",
    suggestedFix:
      "Add DATABASE_URL, OPENAI_API_KEY, and NEXTAUTH_SECRET to your deployment platform's environment configuration (e.g. Vercel Environment Variables, Railway Variables, or .env.production).",
    estimatedEffort: "5 minutes",
    severity: "critical",
    checkId: "env-vars",
  },
  {
    id: "blocker-build",
    title: "Production build fails to compile",
    whyItMatters:
      "The CI/CD pipeline cannot produce a deployable artifact. No release can be shipped while the build is broken.",
    affectedFile: "next.config.ts, lib/db.ts",
    suggestedFix:
      "Fix the environment variable issue above (blocker #1). Then re-run npm run build to verify compilation succeeds before pushing to production.",
    estimatedEffort: "10 minutes",
    severity: "critical",
    checkId: "deploy-readiness",
  },
];

const fixPlanRun1: FixPlan = {
  immediate: [
    {
      id: "fix-env-vars",
      priority: "immediate",
      title: "Configure missing environment variables",
      description:
        "DATABASE_URL, OPENAI_API_KEY, and NEXTAUTH_SECRET are required for production operation.",
      suggestedImplementation:
        "1. Copy .env.example to .env.production.local\n2. Fill in real values for each variable\n3. Add variables to your deployment platform (Vercel dashboard → Settings → Environment Variables)\n4. Re-run the build to confirm it passes",
      relatedFiles: ["lib/db.ts", "lib/ai.ts", ".env.example"],
      verificationMethod: "Run npm run build — it should exit with code 0.",
      checkId: "env-vars",
    },
    {
      id: "fix-build",
      priority: "immediate",
      title: "Verify production build succeeds",
      description: "Confirm the build pipeline produces a valid artifact after env var fix.",
      suggestedImplementation: "Run npm run build locally with all env vars set, then push to CI.",
      relatedFiles: ["next.config.ts", "package.json"],
      verificationMethod: "CI/CD pipeline shows green build status.",
      checkId: "deploy-readiness",
    },
  ],
  beforeRelease: [
    {
      id: "fix-security-headers",
      priority: "before_release",
      title: "Add security headers and disable source maps",
      description: "Prevent information leakage and protect against common web attacks.",
      suggestedImplementation:
        "Add to next.config.ts:\n  productionBrowserSourceMaps: false\n\nAdd security headers in middleware.ts or next.config.ts headers() function.",
      relatedFiles: ["next.config.ts", "middleware.ts"],
      verificationMethod: "Run securityheaders.com scan against the deployed URL.",
      checkId: "security-scan",
    },
    {
      id: "fix-migrations",
      priority: "before_release",
      title: "Run pending database migrations",
      description: "Apply the 2 pending migrations during a maintenance window.",
      suggestedImplementation:
        "Test migrations on a staging environment first. Schedule a maintenance window. Run: npx prisma migrate deploy (or your migration tool).",
      relatedFiles: ["migrations/0003_add_reports_table.sql", "migrations/0004_add_user_preferences.sql"],
      verificationMethod: "Migration history shows all migrations applied. Smoke test core user flows.",
      checkId: "db-migrations",
    },
    {
      id: "fix-tests",
      priority: "before_release",
      title: "Add minimum viable test suite",
      description: "No tests means no safety net for future changes.",
      suggestedImplementation:
        "Install: npm install -D jest @testing-library/react @testing-library/jest-dom\nAdd smoke tests for all pages and unit tests for the analysis engine.",
      relatedFiles: ["package.json"],
      verificationMethod: "npm test passes with at least 60% coverage on core modules.",
      checkId: "test-status",
    },
  ],
  future: [
    {
      id: "fix-docs",
      priority: "future",
      title: "Update documentation and CHANGELOG",
      description: "Keep README and CHANGELOG in sync with the current release.",
      suggestedImplementation:
        "Update README.md with correct env var names. Add CHANGELOG entry for this release. Document the 3 new API endpoints.",
      relatedFiles: ["README.md", "CHANGELOG.md"],
      verificationMethod: "Documentation review by a team member who was not involved in this release.",
      checkId: "docs-review",
    },
  ],
};

const ibmBobInsightsRun1: IBMBobInsight[] = [
  {
    id: "bob-1",
    type: "security",
    title: "IBM Bob 2.0: Security Pattern Detected",
    content:
      "Bob analyzed the authentication flow and identified that the NextAuth configuration lacks explicit session expiry settings. Recommend setting maxAge: 3600 (1 hour) for production security.",
    confidence: 0.91,
    relatedCheckId: "security-scan",
  },
  {
    id: "bob-2",
    type: "code_analysis",
    title: "IBM Bob 2.0: Database Query Optimization",
    content:
      "Bob identified 3 N+1 query patterns in the data access layer. These will cause significant performance degradation at scale. The pending migrations should include index additions.",
    confidence: 0.87,
    relatedCheckId: "db-migrations",
  },
  {
    id: "bob-3",
    type: "recommendation",
    title: "IBM Bob 2.0: Release Risk Assessment",
    content:
      "Based on the current check results, Bob estimates a 73% probability of a production incident if deployed without resolving the critical blockers. The missing environment variables account for 89% of the risk.",
    confidence: 0.94,
    relatedCheckId: undefined,
  },
];

export const demoReportRun1: AnalysisReport = {
  id: "report-demo-001",
  repository: {
    name: "TaskFlow API",
    url: "https://github.com/demo-user/taskflow-api",
    branch: "main",
    commit: "a3f2d91",
    projectType: "nextjs",
    source: "demo",
    analyzedAt: new Date().toISOString(),
  },
  status: "blocked",
  riskScore: 73,
  passedCount: 2,
  warningCount: 3,
  failedCount: 3,
  checks: checksRun1,
  blockers: blockersRun1,
  fixPlan: fixPlanRun1,
  runNumber: 1,
  ibmBobInsights: ibmBobInsightsRun1,
};

// ─── Run 2: READY FOR RELEASE ─────────────────────────────────────────────────

const checksRun2: CheckResult[] = [
  {
    id: "repo-structure",
    name: "Repository Structure",
    category: "Structure",
    status: "passed",
    severity: "informational",
    summary: "Repository structure is clean and well-organized.",
    details: "All directories are properly structured. No issues detected.",
    affectedFiles: [],
    recommendation: "No action required.",
    duration: 290,
  },
  {
    id: "test-status",
    name: "Test Suite",
    category: "Quality",
    status: "warning",
    severity: "low",
    summary: "Test suite added but coverage is below recommended threshold (42%).",
    details:
      "Jest is now installed and 14 test files exist. Core business logic is tested. However, coverage is 42% against the recommended 60% minimum. API route tests are sparse.",
    affectedFiles: [
      { path: "components/__tests__/", snippet: "14 test files" },
    ],
    recommendation: "Add tests for API routes and edge cases to reach 60% coverage before next release.",
    duration: 2300,
  },
  {
    id: "env-vars",
    name: "Environment Variables",
    category: "Configuration",
    status: "passed",
    severity: "informational",
    summary: "All required environment variables are configured.",
    details:
      "DATABASE_URL, OPENAI_API_KEY, and NEXTAUTH_SECRET are all present in the deployment environment. Build validation passes.",
    affectedFiles: [],
    recommendation: "No action required.",
    duration: 410,
  },
  {
    id: "security-scan",
    name: "Security Scan",
    category: "Security",
    status: "passed",
    severity: "informational",
    summary: "Security headers configured. Source maps disabled.",
    details:
      "productionBrowserSourceMaps is set to false. Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) are now in place. No critical security issues detected.",
    affectedFiles: [],
    recommendation: "Consider adding a Content Security Policy header for additional protection.",
    duration: 1980,
  },
  {
    id: "db-migrations",
    name: "Database Migrations",
    category: "Database",
    status: "passed",
    severity: "informational",
    summary: "All migrations have been applied successfully.",
    details:
      "Migration history is up to date. All 4 migrations have been applied. Staging environment validated.",
    affectedFiles: [],
    recommendation: "No action required.",
    duration: 720,
  },
  {
    id: "api-compatibility",
    name: "API Compatibility",
    category: "API",
    status: "passed",
    severity: "informational",
    summary: "No breaking API changes detected.",
    details: "All existing endpoints remain compatible. New endpoints are additive only.",
    affectedFiles: [],
    recommendation: "No action required.",
    duration: 1380,
  },
  {
    id: "docs-review",
    name: "Documentation",
    category: "Documentation",
    status: "warning",
    severity: "low",
    summary: "API documentation for new endpoints is still incomplete.",
    details:
      "README has been updated with correct env var names. CHANGELOG v0.3.0 entry added. However, 2 of 3 new API endpoints still lack documentation.",
    affectedFiles: [
      { path: "docs/api.md", snippet: "Missing: /api/reports/export, /api/analysis/status" },
    ],
    recommendation: "Add documentation for the 2 undocumented endpoints before the next release.",
    duration: 540,
  },
  {
    id: "deploy-readiness",
    name: "Deployment Readiness",
    category: "Deployment",
    status: "passed",
    severity: "informational",
    summary: "Production build succeeds. Deployment pipeline is green.",
    details:
      "npm run build exits with code 0. All TypeScript types resolve correctly. CI/CD pipeline shows green status. Ready to deploy.",
    affectedFiles: [],
    recommendation: "No action required.",
    duration: 2900,
  },
];

const ibmBobInsightsRun2: IBMBobInsight[] = [
  {
    id: "bob-r2-1",
    type: "optimization",
    title: "IBM Bob 2.0: Build Performance Improvement",
    content:
      "Bob detected that the production build time improved by 34% compared to the previous run. The removal of unnecessary environment variable lookups at build time contributed to this improvement.",
    confidence: 0.89,
    relatedCheckId: "deploy-readiness",
  },
  {
    id: "bob-r2-2",
    type: "recommendation",
    title: "IBM Bob 2.0: Release Risk Assessment",
    content:
      "All critical blockers have been resolved. Bob estimates a 94% probability of a successful production deployment. The remaining warnings are minor and do not affect core functionality.",
    confidence: 0.97,
    relatedCheckId: undefined,
  },
];

export const demoReportRun2: AnalysisReport = {
  id: "report-demo-002",
  repository: {
    name: "TaskFlow API",
    url: "https://github.com/demo-user/taskflow-api",
    branch: "main",
    commit: "b7e4c12",
    projectType: "nextjs",
    source: "demo",
    analyzedAt: new Date().toISOString(),
  },
  status: "ready",
  riskScore: 18,
  passedCount: 6,
  warningCount: 2,
  failedCount: 0,
  checks: checksRun2,
  blockers: [],
  fixPlan: {
    immediate: [],
    beforeRelease: [
      {
        id: "fix-test-coverage",
        priority: "before_release",
        title: "Increase test coverage to 60%",
        description: "Coverage is currently at 42%. Aim for 60% before next release.",
        suggestedImplementation: "Focus on API route tests and edge cases in the analysis engine.",
        relatedFiles: ["app/api/", "lib/analyzer/"],
        verificationMethod: "npm test -- --coverage shows ≥60% overall coverage.",
        checkId: "test-status",
      },
    ],
    future: [
      {
        id: "fix-api-docs",
        priority: "future",
        title: "Complete API documentation",
        description: "Document the 2 remaining undocumented endpoints.",
        suggestedImplementation: "Add OpenAPI/Swagger annotations or update docs/api.md.",
        relatedFiles: ["docs/api.md"],
        verificationMethod: "All endpoints documented in docs/api.md.",
        checkId: "docs-review",
      },
    ],
  },
  runNumber: 2,
  ibmBobInsights: ibmBobInsightsRun2,
};
