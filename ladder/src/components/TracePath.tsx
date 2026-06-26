"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Ladder } from "@/lib/ladder";
import { buildPathPoints, getPathLength, pathPointsToD, pointAtDistance } from "@/lib/path";

interface TracePathProps {
  ladder: Ladder;
  startCol: number;
  color: string;
  colWidth: number;
  rowHeight: number;
  delay: number;
  onComplete: (endCol: number) => void;
}

const DURATION_MS = 900;

export default function TracePath({
  ladder,
  startCol,
  color,
  colWidth,
  rowHeight,
  delay,
  onComplete,
}: TracePathProps) {
  const points = useMemo(
    () => buildPathPoints(ladder, startCol, colWidth, rowHeight),
    [ladder, startCol, colWidth, rowHeight],
  );
  const totalLength = useMemo(() => getPathLength(points), [points]);
  const d = useMemo(() => pathPointsToD(points), [points]);
  const endCol = Math.round(points[points.length - 1].x / colWidth);

  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    let cancelled = false;

    const timeout = setTimeout(() => {
      function tick(now: number) {
        if (cancelled) return;
        if (!start) start = now;
        const elapsed = now - start;
        const p = Math.min(1, elapsed / DURATION_MS);
        setProgress(p);
        if (p < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          onCompleteRef.current(endCol);
        }
      }
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
    // Animation should run exactly once per mounted trace (keyed by startCol upstream).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const marker = pointAtDistance(points, totalLength * progress);

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={totalLength * (1 - progress)}
      />
      {progress > 0 && progress < 1 && <circle cx={marker.x} cy={marker.y} r={7} fill={color} />}
    </g>
  );
}
