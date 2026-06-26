"use client";

import { useState } from "react";
import { MAX_PLAYERS, MIN_PLAYERS } from "@/lib/ladder";

interface SetupFormProps {
  onStart: (names: string[], results: string[]) => void;
}

function defaultNames(count: number, prev: string[] = []): string[] {
  return Array.from({ length: count }, (_, i) => prev[i] ?? `참가자${i + 1}`);
}

function defaultResults(count: number, prev: string[] = []): string[] {
  return Array.from({ length: count }, (_, i) => prev[i] ?? `결과${i + 1}`);
}

export default function SetupForm({ onStart }: SetupFormProps) {
  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState<string[]>(() => defaultNames(4));
  const [results, setResults] = useState<string[]>(() => defaultResults(4));

  function changeCount(next: number) {
    const clamped = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, next));
    setPlayerCount(clamped);
    setNames((prev) => defaultNames(clamped, prev));
    setResults((prev) => defaultResults(clamped, prev));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const finalNames = names.map((name, i) => (name.trim() ? name.trim() : `참가자${i + 1}`));
    const finalResults = results.map((result, i) => (result.trim() ? result.trim() : `결과${i + 1}`));
    onStart(finalNames, finalResults);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700">
        <span className="font-medium text-slate-700 dark:text-slate-200">참가자 수</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => changeCount(playerCount - 1)}
            disabled={playerCount <= MIN_PLAYERS}
            aria-label="참가자 수 줄이기"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700 transition active:scale-95 disabled:opacity-40 dark:bg-slate-700 dark:text-slate-200"
          >
            −
          </button>
          <span className="w-8 text-center text-xl font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {playerCount}
          </span>
          <button
            type="button"
            onClick={() => changeCount(playerCount + 1)}
            disabled={playerCount >= MAX_PLAYERS}
            aria-label="참가자 수 늘리기"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700 transition active:scale-95 disabled:opacity-40 dark:bg-slate-700 dark:text-slate-200"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h3 className="px-1 text-sm font-semibold text-slate-500 dark:text-slate-400">참가자 이름</h3>
          {names.map((name, i) => (
            <input
              key={i}
              value={name}
              onChange={(e) =>
                setNames((prev) => prev.map((n, idx) => (idx === i ? e.target.value : n)))
              }
              placeholder={`참가자${i + 1}`}
              maxLength={12}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="px-1 text-sm font-semibold text-slate-500 dark:text-slate-400">결과</h3>
          {results.map((result, i) => (
            <input
              key={i}
              value={result}
              onChange={(e) =>
                setResults((prev) => prev.map((r, idx) => (idx === i ? e.target.value : r)))
              }
              placeholder={`결과${i + 1}`}
              maxLength={12}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">사다리를 타면 참가자와 결과가 무작위로 연결돼요</p>

      <button
        type="submit"
        className="h-12 rounded-xl bg-indigo-600 font-semibold text-white shadow-md transition hover:bg-indigo-500 active:scale-[0.99]"
      >
        사다리 만들기
      </button>
    </form>
  );
}
