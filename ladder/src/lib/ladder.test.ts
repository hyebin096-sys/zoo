import { describe, expect, it } from "vitest";
import {
  generateLadder,
  getColumnSequence,
  getResultMapping,
  pickRowCount,
  traceFinalColumn,
} from "./ladder";

describe("generateLadder", () => {
  it("creates a grid with the requested row count and playerCount-1 columns", () => {
    const ladder = generateLadder(5, 12);
    expect(ladder).toHaveLength(12);
    for (const row of ladder) {
      expect(row).toHaveLength(4);
    }
  });

  it("never places two adjacent rungs on the same row", () => {
    for (let trial = 0; trial < 50; trial++) {
      const ladder = generateLadder(8, pickRowCount(8));
      for (const row of ladder) {
        for (let col = 0; col < row.length - 1; col++) {
          expect(row[col] && row[col + 1]).toBe(false);
        }
      }
    }
  });
});

describe("getColumnSequence", () => {
  it("only moves by at most one column per row and starts at startCol", () => {
    const ladder = generateLadder(6, pickRowCount(6));
    const sequence = getColumnSequence(ladder, 2);
    expect(sequence[0]).toBe(2);
    expect(sequence).toHaveLength(ladder.length + 1);
    for (let i = 1; i < sequence.length; i++) {
      expect(Math.abs(sequence[i] - sequence[i - 1])).toBeLessThanOrEqual(1);
    }
  });

  it("matches traceFinalColumn's result", () => {
    const ladder = generateLadder(4, pickRowCount(4));
    const sequence = getColumnSequence(ladder, 1);
    expect(sequence[sequence.length - 1]).toBe(traceFinalColumn(ladder, 1));
  });
});

describe("getResultMapping", () => {
  it("is always a bijection: every start maps to a unique end column", () => {
    for (let trial = 0; trial < 100; trial++) {
      const playerCount = 2 + (trial % 7); // 2..8
      const ladder = generateLadder(playerCount, pickRowCount(playerCount));
      const mapping = getResultMapping(ladder, playerCount);

      expect(mapping).toHaveLength(playerCount);
      const uniqueEndCols = new Set(mapping);
      expect(uniqueEndCols.size).toBe(playerCount);
      for (const endCol of mapping) {
        expect(endCol).toBeGreaterThanOrEqual(0);
        expect(endCol).toBeLessThan(playerCount);
      }
    }
  });
});

describe("pickRowCount", () => {
  it("stays within a sane range for small and large player counts", () => {
    expect(pickRowCount(2)).toBeGreaterThanOrEqual(8);
    expect(pickRowCount(8)).toBeLessThanOrEqual(20);
  });
});
