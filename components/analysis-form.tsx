"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui";
import { Navbar } from "@/components/navbar";
import type { AnalysisFormInput, AnalysisSource, ProjectType } from "@/lib/types";
import { cn } from "@/lib/utils";

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "nextjs", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "fastapi", label: "FastAPI" },
  { value: "python", label: "Python" },
  { value: "nodejs", label: "Node.js" },
  { value: "other", label: "Other" },
];

const SOURCE_OPTIONS: { value: AnalysisSource; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: "demo",
    label: "Demo Repository",
    desc: "Analyze a sample Next.js project with pre-configured issues",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    value: "github",
    label: "GitHub Repository URL",
    desc: "Enter a public GitHub repository URL for analysis",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    value: "zip",
    label: "Upload ZIP File",
    desc: "Upload a compressed project archive for local analysis",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
];

export function AnalysisForm() {
  const { startAnalysis } = useApp();
  const [source, setSource] = useState<AnalysisSource>("demo");
  const [url, setUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("nextjs");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".zip")) {
      setFileError("Only .zip files are supported.");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setFileError("File must be under 50 MB.");
      return;
    }
    setFileError("");
    setFile(f);
  };

  const validateUrl = (val: string) => {
    if (!val) {
      setUrlError("Repository URL is required.");
      return false;
    }
    try {
      const u = new URL(val);
      if (!u.hostname.includes("github.com")) {
        setUrlError("Only GitHub URLs are supported in this version.");
        return false;
      }
    } catch {
      setUrlError("Please enter a valid URL.");
      return false;
    }
    setUrlError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (source === "github" && !validateUrl(url)) return;
    if (source === "zip" && !file) {
      setFileError("Please select a file.");
      return;
    }

    setLoading(true);
    const input: AnalysisFormInput = {
      source,
      projectType,
      projectName: projectName || (source === "demo" ? "my-saas-app" : undefined),
      url: source === "github" ? url : undefined,
      file: source === "zip" ? (file ?? undefined) : undefined,
    };

    await startAnalysis(input);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">New Analysis</h1>
          <p className="text-slate-400 text-sm">
            Select a repository source and configure your analysis parameters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Source selection ── */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Repository Source
            </label>
            <div className="space-y-2">
              {SOURCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSource(opt.value)}
                  className={cn(
                    "w-full text-left rounded-xl border p-4 transition-all duration-150 cursor-pointer",
                    source === opt.value
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-slate-700 bg-slate-800/40 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 shrink-0 transition-colors",
                        source === opt.value ? "text-violet-400" : "text-slate-500"
                      )}
                    >
                      {opt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors",
                            source === opt.value ? "text-slate-100" : "text-slate-300"
                          )}
                        >
                          {opt.label}
                        </span>
                        {opt.value === "demo" && (
                          <span className="text-xs bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded px-2 py-0.5">
                            Always works
                          </span>
                        )}
                        {opt.value === "github" && (
                          <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded px-2 py-0.5">
                            Simulated
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 transition-colors",
                        source === opt.value
                          ? "border-violet-500 bg-violet-500"
                          : "border-slate-600"
                      )}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── GitHub URL ── */}
          {source === "github" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Repository URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (urlError) setUrlError(""); }}
                onBlur={() => url && validateUrl(url)}
                placeholder="https://github.com/username/repository"
                className={cn(
                  "w-full rounded-lg border bg-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors",
                  urlError ? "border-red-500" : "border-slate-600 focus:border-violet-500"
                )}
              />
              {urlError && <p className="mt-1.5 text-xs text-red-400">{urlError}</p>}
              <p className="mt-1.5 text-xs text-slate-500">
                Analysis will be simulated if the repository is not accessible.
              </p>
            </div>
          )}

          {/* ── ZIP upload ── */}
          {source === "zip" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Archive <span className="text-red-400">*</span>
              </label>
              <label
                className={cn(
                  "flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
                  file
                    ? "border-violet-500/50 bg-violet-500/5"
                    : "border-slate-600 hover:border-slate-500 bg-slate-800/40"
                )}
              >
                <input type="file" accept=".zip" className="hidden" onChange={handleFileChange} />
                {file ? (
                  <>
                    <svg className="w-8 h-8 text-violet-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-slate-300 font-medium">{file.name}</span>
                    <span className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-slate-400">Click to upload or drag and drop</span>
                    <span className="text-xs text-slate-500 mt-1">.zip only · max 50 MB</span>
                  </>
                )}
              </label>
              {fileError && <p className="mt-1.5 text-xs text-red-400">{fileError}</p>}
            </div>
          )}

          {/* ── Project Name ── */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Project Name <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={source === "demo" ? "my-saas-app" : "Enter project name"}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
            />
          </div>

          {/* ── Project Type ── */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Project Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PROJECT_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setProjectType(pt.value)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer",
                    projectType === pt.value
                      ? "border-violet-500 bg-violet-500/20 text-violet-300"
                      : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                  )}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? "Starting Analysis..." : "Start Analysis"}
            </Button>
            <p className="text-center text-xs text-slate-500 mt-3">
              Analysis completes in ~10 seconds using simulated checks
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
