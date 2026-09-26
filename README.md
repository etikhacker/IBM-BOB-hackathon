# ReleaseGuard AI

> **IBM Bob 2.0 Hackathon 2025 Submission**

An AI-powered pre-release verification platform that analyzes software repositories
and tells developers exactly what to fix before they deploy to production.

---

## The Problem

Every engineering team faces the same costly ritual before a release: hours of manual
checklists — are the tests passing? are environment variables set? are there pending
migrations that might cause downtime? does the build actually compile? These checks are
tedious, error-prone, and often incomplete. Steps get missed. Production breaks.

## The Solution

ReleaseGuard AI runs 8 parallel checks on your repository in under 30 seconds and
delivers a prioritized, actionable report that clearly answers: **is this code safe to ship?**

The answer is always one of three states:

| Status | Meaning |
|--------|---------|
| 🚫 **BLOCKED** | One or more critical issues must be resolved before deploying |
| ⚠️ **NEEDS ATTENTION** | Non-critical warnings present — review before release |
| ✅ **READY FOR RELEASE** | All critical checks passed — safe to deploy |

---

## Features

- **8 parallel release checks** — security, tests, environment variables, database migrations,
  API compatibility, documentation, repository structure, deployment readiness
- **Risk score (0–100)** — at-a-glance deployment risk quantification
- **Release Blockers** — dedicated section listing only what will cause a production incident,
  with affected files, root-cause explanation, exact fix, and estimated effort
- **Recommended Fix Plan** — recommendations grouped by priority:
  Immediate → Before Release → Future Improvements
- **Before/after demo flow** — run 1 shows BLOCKED (risk: 73), run 2 shows READY (risk: 18)
  with a clear transition banner showing the improvement
- **IBM Bob 2.0 AI insights** — confidence-scored analysis surfaced directly on the report
- **Report export** — download as JSON or Markdown
- **Copy fix plan** — one click to copy the full remediation plan to clipboard
- **No credentials required** — fully functional with the built-in demo repository

---

## Architecture

```
ReleaseGuard AI
├── app/
│   ├── layout.tsx          # Root layout — wraps tree in AppProvider
│   ├── page.tsx            # Single-page router: landing | form | progress | report
│   └── globals.css         # Global styles and dark theme
│
├── components/
│   ├── ui.tsx              # Design system primitives (Button, Card, Badge, Logo…)
│   ├── navbar.tsx          # Persistent navigation bar
│   ├── landing-page.tsx    # Landing page (hero, workflow, checks, IBM Bob section)
│   ├── analysis-form.tsx   # Repository source selection + project config form
│   ├── analysis-progress.tsx # Animated parallel checks progress screen
│   ├── report-dashboard.tsx  # Main report view with all sections
│   ├── check-card.tsx      # Individual check result card with expand/collapse
│   ├── release-blockers.tsx  # Critical blockers section
│   └── fix-plan.tsx        # Prioritized fix plan with inline implementation details
│
└── lib/
    ├── types.ts            # Complete TypeScript domain model
    ├── demo-data.ts        # Run 1 (BLOCKED) + Run 2 (READY) demo report fixtures
    ├── analyzer.ts         # AnalysisEngine class, report export functions
    ├── app-context.tsx     # Global state management with useReducer + useRef
    └── utils.ts            # cn(), status configs, severity configs, formatters
```

**Key design decisions:**
- Single Next.js app with no external API calls — fully self-contained
- `RepositoryCheck` interface defines the contract for all analyzers, making them independently testable and extensible
- `AnalysisEngine` simulates realistic parallel batches with individual check timings
- State managed via `useReducer` + `useRef` to avoid stale closure bugs in async callbacks

---

## How IBM Bob 2.0 Was Used

ReleaseGuard AI was designed, implemented, debugged, and documented **entirely inside IBM Bob 2.0**
using a single Agent session.

Bob was used for:

1. **Architecture design** — Agent mode analyzed the requirements and produced the full
   TypeScript domain model, component tree, and state management strategy
2. **Parallel implementation** — Multiple code files were generated simultaneously using
   Bob's parallel task execution (UI components, analysis engine, demo data, context)
3. **QA engineering** — Bob performed a full audit pass: found the conditional `useState` hook bug,
   stale closure issues in `rerunAnalysis`/`exportReport`, unused imports, and `STATUS_MESSAGES`
   dead code — all fixed in the same session
4. **Runtime intelligence** — The analysis engine surfaces IBM Bob 2.0 insights directly on the
   report dashboard: security pattern detection, N+1 query identification, and release risk
   probability estimation with confidence scores
5. **Documentation** — All docs in `docs/` were written by Bob

See [`docs/ibm-bob-usage.md`](docs/ibm-bob-usage.md) for the full breakdown.

---

## Local Setup

**Prerequisites:** Node.js 18+ and npm 9+

```bash
# 1. Clone or open the project
cd "ReleaseGuard AI"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open the app
open http://localhost:3000
```

No environment variables, API keys, or external services required.

---

## Demo Instructions

The fastest path to see the full product:

1. Open `http://localhost:3000`
2. Click **"View Demo Report"** on the landing page  
   *(this runs the demo analysis immediately)*
3. Watch the **8 parallel checks** animate on the progress screen
4. See the **BLOCKED** report — risk score 73, 2 critical release blockers
5. Click **"Run Analysis Again"** (top-right or bottom toolbar)
6. See the transition banner: **BLOCKED → READY FOR RELEASE**, risk score drops to 18
7. Try **Export JSON** and **Export Markdown** to download the report
8. Try **Copy Fix Plan** to copy the remediation plan to clipboard

Alternatively, click **"Analyze a Repository"** to use the form flow with the Demo Repository option.

---

## Testing Commands

```bash
# TypeScript type checking (strict mode)
npx tsc --noEmit

# ESLint (Next.js + TypeScript rules)
npm run lint

# Production build verification
npm run build

# Development server
npm run dev
```

All three verification commands pass with zero errors and zero warnings.

> **Note:** No unit test framework (Jest/Vitest) is configured in this MVP. The codebase
> passes strict TypeScript checking and full ESLint validation. Unit tests are listed as
> a future improvement.

---

## Known Limitations

| Limitation | Impact | Planned Fix |
|------------|--------|-------------|
| All analysis is simulated | Demo only — no real repo analysis | Connect GitHub API / file parser |
| No unit/E2E tests | No automated regression protection | Add Jest + Playwright |
| Clipboard API requires HTTPS | `copyFixPlan` fails silently on plain HTTP | Fallback textarea copy |
| `date-fns` installed but unused | Dead package dependency | Remove with `npm uninstall date-fns` |
| ZIP files are validated but not parsed | Upload works but analysis is simulated | Implement zip extraction |

---

## Future Improvements

- **Real GitHub API integration** — analyze actual repositories using the GitHub REST API
- **Genuine static analysis** — parse `package.json`, `.env.example`, migration files, test configs
- **FastAPI backend** — extract the analysis engine into a Python FastAPI service for richer checks
- **Supabase persistence** — store report history and track release readiness over time
- **CI/CD integration** — GitHub Action that runs ReleaseGuard as a pre-merge gate
- **Custom check rules** — team-configurable checklists per project type
- **Slack/Teams notifications** — push report summaries to team channels
- **Multi-repo dashboard** — track release health across multiple repositories

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| State | React useReducer + useRef |
| AI backbone | IBM Bob 2.0 |
| Runtime | Node.js 18+ |
| Build | Turbopack |

---

*Built entirely with IBM Bob 2.0 · IBM Bob Hackathon 2025*
