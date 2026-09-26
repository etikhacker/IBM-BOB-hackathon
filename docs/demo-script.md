# ReleaseGuard AI — 3-Minute Demo Script

**Audience:** Hackathon judges, technical evaluators  
**Duration:** ~3 minutes  
**Prerequisites:** `npm run dev` running at `http://localhost:3000`

---

## [0:00–0:20] Landing Page — The Problem

> *Open the landing page. Let the hero section speak first.*

**Say:**
> "Every team faces this before a release — hours of manual checklist work before you can
> deploy with confidence. Tests, environment variables, security settings, database migrations.
> Steps get missed. Production breaks. ReleaseGuard AI solves this."

> *Point to the headline: "You ship. Something breaks. Not anymore."*

> "One click. Eight parallel checks. A clear answer: is this code safe to ship?"

---

## [0:20–0:35] Start the Demo Analysis

> *Click the "View Demo Report" button on the landing page.*

**Say:**
> "I'll run the demo analysis on a sample Next.js project. No GitHub credentials,
> no setup — it works out of the box."

> *The analysis progress screen appears.*

---

## [0:35–1:00] Progress Screen — Parallel Checks

> *Watch the check rows animate through running → complete states.*

**Say:**
> "IBM Bob 2.0 is running 8 checks in parallel — you can see the batches:
> first repo structure, then tests, environment variables, and security simultaneously,
> then database migrations and API compatibility, then docs and deployment readiness.
> The whole analysis completes in about 10 seconds."

> *Watch the progress bar fill and checks complete.*

---

## [1:00–1:30] Run 1 Result — BLOCKED

> *The report dashboard appears showing BLOCKED.*

**Say:**
> "Run 1. The result is clear: BLOCKED — risk score 73 out of 100.
> Two critical release blockers. Three failed checks. This repository is not safe to deploy."

> *Scroll to the Release Blockers section.*

> "The blockers section tells us exactly what's wrong: missing required environment variables —
> the app can't connect to the database — and a production build that fails to compile.
> Each blocker has the affected file, a specific fix, and an effort estimate. The first one
> is a 5-minute fix."

> *Click to expand a check card.*

> "Every check card can be expanded for the full analysis and implementation details."

---

## [1:30–1:50] IBM Bob 2.0 Insights

> *Scroll to the IBM Bob 2.0 — AI Insights panel.*

**Say:**
> "This is where IBM Bob 2.0 goes beyond pattern matching. Bob identifies a missing
> session expiry in the authentication config — confidence 91%. And here, Bob computes
> that there's a 73% probability of a production incident if we deploy without fixing
> the blockers. That's not a rule — that's AI reasoning about the specific state
> of this repository."

---

## [1:50–2:20] Re-run — The Before/After Moment

> *Click "Run Analysis Again" (top-right navbar button).*

**Say:**
> "Now — let's say the team fixed the two blockers overnight. They configured the
> environment variables and confirmed the build passes. Let's re-analyze."

> *Progress screen runs again. Report appears.*

> "Run 2. The transition banner shows exactly what changed: BLOCKED → READY FOR RELEASE.
> Risk score dropped from 73 to 18. The two critical issues are resolved."

> *Point to the status header showing READY FOR RELEASE.*

> "The status header is unambiguous. Green. Ready to ship."

> *Scroll past the empty blockers section.*

> "No release blockers. The remaining two warnings — incomplete API documentation
> and test coverage at 42% — are logged in the Fix Plan as 'Before Release' items,
> not blockers."

---

## [2:20–2:45] Export & Fix Plan

> *Scroll to the Recommended Fix Plan.*

**Say:**
> "The Fix Plan groups everything by priority — Immediate, Before Release, Future.
> Each item has an implementation snippet, related files, and a verification method."

> *Click "Copy Fix Plan".*

> "One click copies the entire fix plan as Markdown — paste it directly into a GitHub
> issue or Jira ticket."

> *Click "Export JSON" from the toolbar.*

> "The report is also available as structured JSON for CI/CD pipelines or custom tooling."

---

## [2:45–3:00] Close — IBM Bob 2.0

**Say:**
> "ReleaseGuard AI was built entirely inside IBM Bob 2.0 — architecture, implementation,
> QA engineering, bug fixes, and documentation — all in a single Agent session.
> Bob found and fixed a conditional hook violation, two stale closure bugs, and
> cleaned up unused imports — without being asked to run a QA pass until the product
> was functionally complete."

> "That's the value of IBM Bob 2.0 for real developer workflows: not just code generation,
> but a full engineering partner from first line to final submission."

---

## Key Demo Tips

- **Don't rush the progress screen** — let the parallel checks animation play fully
- **Emphasize the transition banner** — the BLOCKED → READY FOR RELEASE moment is the product's core value proposition
- **Click the expand arrow** on at least one check card to show depth
- **Scroll slowly** through the blockers section — the effort estimates ("5 minutes") are deliberately relatable
- If asked about real repositories: "The analysis engine uses the `RepositoryCheck` interface — connecting a real GitHub API or file parser is the natural next step, and the architecture is already designed for it"
