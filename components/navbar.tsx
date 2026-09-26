"use client";

import { useApp } from "@/lib/app-context";
import { Logo } from "@/components/ui";

interface NavbarProps {
  showBack?: boolean;
  rightSlot?: React.ReactNode;
}

export function Navbar({ showBack, rightSlot }: NavbarProps) {
  const { navigate } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("landing")}
          className="flex items-center gap-2.5 text-white hover:text-violet-300 transition-colors cursor-pointer"
        >
          <Logo size="sm" />
          <span className="font-semibold text-sm tracking-tight">ReleaseGuard AI</span>
        </button>

        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate("form")}
              className="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              New Analysis
            </button>
          )}
          {rightSlot}
          <span className="text-xs text-slate-500 hidden sm:block">Powered by IBM Bob 2.0</span>
        </div>
      </div>
    </header>
  );
}
