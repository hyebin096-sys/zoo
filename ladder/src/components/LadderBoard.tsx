"use client";

import type { Ladder } from "@/lib/ladder";
import TracePath from "./TracePath";

export interface Trace {
  startCol: number;
  color: string;
  delay: number;
  endCol: number | null;
}

interface LadderBoardProps {
  ladder: Ladder;
  names: string[];
  results: string[];
  traces: Trace[];
  onSelectColumn: (col: number) => void;
  onComplete: (startCol: number, endCol: number) => void;
}

const COL_WIDTH = 64;
const ROW_HEIGHT = 28;
const PADDING = 36;

export default function LadderBoard({
  ladder,
  names,
  results,
  traces,
  onSelectColumn,
  onComplete,
}: LadderBoardProps) {
  const playerCount = names.length;
  const rowCount = ladder.length;
  const width = COL_WIDTH * (playerCount - 1) + PADDING * 2;
  const height = ROW_HEIGHT * rowCount;

  const traceByStartCol = new Map(traces.map((t) => [t.startCol, t]));
  const traceByEndCol = new Map(traces.filter((t) => t.endCol !== null).map((t) => [t.endCol as number, t]));

  function colX(col: number) {
    return col * COL_WIDTH + PADDING;
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="mx-auto" style={{ width: Math.max(width, 260) }}>
        <div className="relative" style={{ width, height: 44 }}>
          {names.map((name, col) => {
            const trace = traceByStartCol.get(col);
            return (
              <button
                key={col}
                type="button"
                onClick={() => onSelectColumn(col)}
                disabled={!!trace}
                aria-label={`${name} 사다리 타기`}
                style={{ left: colX(col), top: 0, position: "absolute", transform: "translateX(-50%)" }}
                className={`flex h-11 min-w-[44px] max-w-[64px] items-center justify-center rounded-full px-2 text-xs font-semibold ring-1 transition sm:text-sm ${
                  trace
                    ? "opacity-70"
                    : "bg-white ring-slate-200 hover:scale-105 active:scale-95 dark:bg-slate-800 dark:ring-slate-600"
                }`}
              >
                <span
                  className="truncate"
                  style={{
                    color: trace ? trace.color : undefined,
                  }}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
          {names.map((_, col) => (
            <line
              key={col}
              x1={colX(col)}
              x2={colX(col)}
              y1={0}
              y2={height}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-600"
              strokeWidth={3}
            />
          ))}
          {ladder.map((row, rowIndex) =>
            row.map((hasRung, col) =>
              hasRung ? (
                <line
                  key={`${rowIndex}-${col}`}
                  x1={colX(col)}
                  x2={colX(col + 1)}
                  y1={rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2}
                  y2={rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2}
                  stroke="currentColor"
                  className="text-slate-300 dark:text-slate-600"
                  strokeWidth={3}
                />
              ) : null,
            ),
          )}
          <g transform={`translate(${PADDING}, 0)`}>
            {traces.map((trace) => (
              <TracePath
                key={trace.startCol}
                ladder={ladder}
                startCol={trace.startCol}
                color={trace.color}
                colWidth={COL_WIDTH}
                rowHeight={ROW_HEIGHT}
                delay={trace.delay}
                onComplete={(endCol) => onComplete(trace.startCol, endCol)}
              />
            ))}
          </g>
        </svg>

        <div className="relative" style={{ width, height: 44 }}>
          {results.map((result, col) => {
            const trace = traceByEndCol.get(col);
            return (
              <div
                key={col}
                style={{ left: colX(col), top: 0, position: "absolute", transform: "translateX(-50%)" }}
                className="flex h-11 min-w-[44px] max-w-[64px] items-center justify-center"
              >
                <span
                  className={`flex h-8 w-full items-center justify-center truncate rounded-full px-2 text-xs font-semibold transition sm:text-sm ${
                    trace ? "text-white" : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                  }`}
                  style={trace ? { backgroundColor: trace.color } : undefined}
                >
                  {trace ? result : "?"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
