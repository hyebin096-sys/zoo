"use client";

import { useState } from "react";
import SetupForm from "./SetupForm";
import LadderBoard, { type Trace } from "./LadderBoard";
import { generateLadder, pickRowCount, type Ladder } from "@/lib/ladder";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6", "#6366f1"];

interface GameConfig {
  names: string[];
  results: string[];
}

export default function LadderGame() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [ladder, setLadder] = useState<Ladder>([]);
  const [traces, setTraces] = useState<Trace[]>([]);

  function handleStart(names: string[], results: string[]) {
    setConfig({ names, results });
    setLadder(generateLadder(names.length, pickRowCount(names.length)));
    setTraces([]);
  }

  function handleReshuffle() {
    if (!config) return;
    setLadder(generateLadder(config.names.length, pickRowCount(config.names.length)));
    setTraces([]);
  }

  function handleBackToSetup() {
    setConfig(null);
    setTraces([]);
  }

  function handleSelectColumn(col: number) {
    setTraces((prev) => {
      if (prev.some((t) => t.startCol === col)) return prev;
      const color = COLORS[prev.length % COLORS.length];
      return [...prev, { startCol: col, color, delay: 0, endCol: null }];
    });
  }

  function handleRevealAll() {
    if (!config) return;
    setTraces((prev) => {
      const startedCols = new Set(prev.map((t) => t.startCol));
      const remaining = config.names.map((_, col) => col).filter((col) => !startedCols.has(col));
      const additions: Trace[] = remaining.map((col, i) => ({
        startCol: col,
        color: COLORS[(prev.length + i) % COLORS.length],
        delay: i * 150,
        endCol: null,
      }));
      return [...prev, ...additions];
    });
  }

  function handleComplete(startCol: number, endCol: number) {
    setTraces((prev) => prev.map((t) => (t.startCol === startCol ? { ...t, endCol } : t)));
  }

  if (!config) {
    return <SetupForm onStart={handleStart} />;
  }

  const allStarted = traces.length === config.names.length;
  const allRevealed = traces.filter((t) => t.endCol !== null).length === config.names.length;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <LadderBoard
        ladder={ladder}
        names={config.names}
        results={config.results}
        traces={traces}
        onSelectColumn={handleSelectColumn}
        onComplete={handleComplete}
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleRevealAll}
          disabled={allStarted}
          className="h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 active:scale-95 disabled:opacity-40"
        >
          전체 결과 보기
        </button>
        <button
          type="button"
          onClick={handleReshuffle}
          className="h-11 rounded-xl bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-95 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
        >
          사다리 다시 섞기
        </button>
        <button
          type="button"
          onClick={handleBackToSetup}
          className="h-11 rounded-xl bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-95 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
        >
          처음으로
        </button>
      </div>

      {allRevealed && (
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">모든 결과가 공개되었어요</p>
      )}
    </div>
  );
}
