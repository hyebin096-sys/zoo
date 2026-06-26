import { describe, expect, it } from "vitest";
import { generateLadder, pickRowCount, traceFinalColumn } from "./ladder";
import { buildPathPoints, getPathLength, pathPointsToD, pointAtDistance } from "./path";

describe("buildPathPoints", () => {
  it("starts at the start column and ends at the traced final column", () => {
    const ladder = generateLadder(5, pickRowCount(5));
    const colWidth = 64;
    const rowHeight = 28;
    const points = buildPathPoints(ladder, 2, colWidth, rowHeight);

    expect(points[0]).toEqual({ x: 2 * colWidth, y: 0 });

    const expectedEndCol = traceFinalColumn(ladder, 2);
    const last = points[points.length - 1];
    expect(last.x).toBe(expectedEndCol * colWidth);
    expect(last.y).toBe(ladder.length * rowHeight);
  });

  it("y is always non-decreasing (path only moves downward or sideways)", () => {
    const ladder = generateLadder(6, pickRowCount(6));
    const points = buildPathPoints(ladder, 0, 64, 28);
    for (let i = 1; i < points.length; i++) {
      expect(points[i].y).toBeGreaterThanOrEqual(points[i - 1].y);
    }
  });
});

describe("pathPointsToD", () => {
  it("produces an SVG path string starting with M and using L for the rest", () => {
    const points = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }];
    expect(pathPointsToD(points)).toBe("M 0 0 L 10 0 L 10 20");
  });
});

describe("getPathLength + pointAtDistance", () => {
  const points = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }];

  it("sums the straight-line distance of every segment", () => {
    expect(getPathLength(points)).toBe(20);
  });

  it("returns the start point at distance 0 and end point at full length", () => {
    expect(pointAtDistance(points, 0)).toEqual({ x: 0, y: 0 });
    expect(pointAtDistance(points, 20)).toEqual({ x: 10, y: 10 });
  });

  it("interpolates partway through a segment", () => {
    expect(pointAtDistance(points, 5)).toEqual({ x: 5, y: 0 });
    expect(pointAtDistance(points, 15)).toEqual({ x: 10, y: 5 });
  });
});
