"use client";

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from "react";
import type {
  AnalysisReport,
  AnalysisFormInput,
  AnalysisProgress,
} from "@/lib/types";
import { analysisEngine, exportReportAsJSON, exportReportAsMarkdown } from "@/lib/analyzer";

// ─── State ────────────────────────────────────────────────────────────────────

type AppScreen = "landing" | "form" | "progress" | "report";

interface AppState {
  screen: AppScreen;
  formInput: AnalysisFormInput | null;
  progress: AnalysisProgress | null;
  report: AnalysisReport | null;
  runNumber: number;
  previousReport: AnalysisReport | null;
  error: string | null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type AppAction =
  | { type: "NAVIGATE"; screen: AppScreen }
  | { type: "SET_FORM_INPUT"; input: AnalysisFormInput }
  | { type: "SET_PROGRESS"; progress: AnalysisProgress }
  | { type: "SET_REPORT"; report: AnalysisReport }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RERUN_ANALYSIS" };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, screen: action.screen, error: null };
    case "SET_FORM_INPUT":
      return { ...state, formInput: action.input };
    case "SET_PROGRESS":
      return { ...state, progress: action.progress };
    case "SET_REPORT":
      return {
        ...state,
        report: action.report,
        previousReport: state.report ?? state.previousReport,
        screen: "report",
        progress: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RERUN_ANALYSIS":
      return {
        ...state,
        screen: "progress",
        previousReport: state.report,
        report: null,
        runNumber: state.runNumber + 1,
        progress: null,
      };
    default:
      return state;
  }
}

const initialState: AppState = {
  screen: "landing",
  formInput: null,
  progress: null,
  report: null,
  runNumber: 1,
  previousReport: null,
  error: null,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  navigate: (screen: AppScreen) => void;
  startAnalysis: (input: AnalysisFormInput) => Promise<void>;
  rerunAnalysis: () => Promise<void>;
  exportReport: (format: "json" | "markdown") => void;
  copyFixPlan: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Keep a ref to always access the latest state inside callbacks without stale closures.
  // We sync it in an effect (not during render) to satisfy React 19 ref rules.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const navigate = useCallback((screen: AppScreen) => {
    dispatch({ type: "NAVIGATE", screen });
  }, []);

  const runAnalysis = useCallback(
    async (input: AnalysisFormInput, runNumber: number) => {
      dispatch({ type: "NAVIGATE", screen: "progress" });
      dispatch({ type: "SET_FORM_INPUT", input });

      try {
        const report = await analysisEngine.analyze(
          {
            name: input.projectName || "my-saas-app",
            projectType: input.projectType,
            source: input.source,
            runNumber,
            url: input.url,
          },
          (progress) => {
            dispatch({ type: "SET_PROGRESS", progress });
          }
        );
        dispatch({ type: "SET_REPORT", report });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Analysis failed";
        if (msg !== "Aborted") {
          dispatch({ type: "SET_ERROR", error: msg });
          dispatch({ type: "NAVIGATE", screen: "form" });
        }
      }
    },
    []
  );

  const startAnalysis = useCallback(
    async (input: AnalysisFormInput) => {
      await runAnalysis(input, 1);
    },
    [runAnalysis]
  );

  const rerunAnalysis = useCallback(async () => {
    // Read from ref to avoid stale closures — this always reflects the current state
    const currentInput = stateRef.current.formInput;
    if (!currentInput) return;

    // Compute nextRun before dispatching so we know which demo report to load.
    // RERUN_ANALYSIS increments runNumber in the reducer, so the next logical run
    // is runNumber + 1 from the current state.
    const nextRun = stateRef.current.runNumber + 1;
    dispatch({ type: "RERUN_ANALYSIS" });

    await runAnalysis(currentInput, Math.min(nextRun, 2));
  }, [runAnalysis]);

  const exportReport = useCallback(
    (format: "json" | "markdown") => {
      const report = stateRef.current.report;
      if (!report) return;

      const content =
        format === "json"
          ? exportReportAsJSON(report)
          : exportReportAsMarkdown(report);

      const blob = new Blob([content], {
        type: format === "json" ? "application/json" : "text/markdown",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `releaseguard-report-${report.repository.name}-${report.repository.commit}.${format === "json" ? "json" : "md"}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    []
  );

  const copyFixPlan = useCallback(() => {
    const report = stateRef.current.report;
    if (!report) return;
    const md = exportReportAsMarkdown(report);
    navigator.clipboard.writeText(md).catch(() => {});
  }, []);

  return (
    <AppContext.Provider
      value={{ state, navigate, startAnalysis, rerunAnalysis, exportReport, copyFixPlan }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
