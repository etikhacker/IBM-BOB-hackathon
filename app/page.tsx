"use client";

import { useApp } from "@/lib/app-context";
import { LandingPage } from "@/components/landing-page";
import { AnalysisForm } from "@/components/analysis-form";
import { AnalysisProgress } from "@/components/analysis-progress";
import { ReportDashboard } from "@/components/report-dashboard";

export default function Home() {
  const { state } = useApp();

  switch (state.screen) {
    case "landing":
      return <LandingPage />;
    case "form":
      return <AnalysisForm />;
    case "progress":
      return <AnalysisProgress />;
    case "report":
      return <ReportDashboard />;
    default:
      return <LandingPage />;
  }
}
