import type { Ladder } from "./ladder";

export interface Point {
  x: number;
  y: number;
}

/**
 * Converts a ladder + starting column into the sequence of pixel points
 * a marker would travel through, including the horizontal jogs where a
 * rung exists. Rungs are drawn at the vertical midpoint of each row.
 */
export function buildPathPoints(ladder: Ladder, startCol: number, colWidth: number, rowHeight: number): Point[] {
  const points: Point[] = [];
  let col = startCol;
  points.push({ x: col * colWidth, y: 0 });

  ladder.forEach((row, rowIndex) => {
    const midY = rowIndex * rowHeight + rowHeight / 2;
    const bottomY = (rowIndex + 1) * rowHeight;

    if (col > 0 && row[col - 1]) {
      points.push({ x: col * colWidth, y: midY });
      col -= 1;
      points.push({ x: col * colWidth, y: midY });
    } else if (col < row.length && row[col]) {
      points.push({ x: col * colWidth, y: midY });
      col += 1;
      points.push({ x: col * colWidth, y: midY });
    }
    points.push({ x: col * colWidth, y: bottomY });
  });

  return points;
}

export function pathPointsToD(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

export function getPathLength(points: Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return total;
}

/** Walks along the polyline and returns the point at the given distance from the start. */
export function pointAtDistance(points: Point[], distance: number): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  if (distance <= 0) return points[0];

  let remaining = distance;
  for (let i = 1; i < points.length; i++) {
    const segLen = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    if (remaining <= segLen) {
      const t = segLen === 0 ? 0 : remaining / segLen;
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
      };
    }
    remaining -= segLen;
  }
  return points[points.length - 1];
}
