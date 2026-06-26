export type Ladder = boolean[][];

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;

/**
 * Picks a row count that scales with player count so the ladder
 * has enough crossings to feel random without getting too tall.
 */
export function pickRowCount(playerCount: number): number {
  return Math.min(20, Math.max(8, playerCount * 3));
}

/**
 * Generates a ladder as a grid of rungs. `ladder[row][col] === true`
 * means there is a horizontal rung connecting column `col` and `col + 1`
 * on that row. Two rungs can never share a column on the same row,
 * which guarantees every starting column maps to exactly one ending
 * column (a bijection).
 */
export function generateLadder(playerCount: number, rowCount: number): Ladder {
  const colCount = Math.max(0, playerCount - 1);
  const ladder: Ladder = Array.from({ length: rowCount }, () => new Array(colCount).fill(false));

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (col > 0 && ladder[row][col - 1]) {
        continue;
      }
      ladder[row][col] = Math.random() < 0.5;
    }
  }

  return ladder;
}

/**
 * Walks the ladder from a starting column and returns the column index
 * after each row (length = ladder.length + 1, first entry is startCol).
 */
export function getColumnSequence(ladder: Ladder, startCol: number): number[] {
  const sequence = [startCol];
  let col = startCol;

  for (const row of ladder) {
    if (col > 0 && row[col - 1]) {
      col -= 1;
    } else if (col < row.length && row[col]) {
      col += 1;
    }
    sequence.push(col);
  }

  return sequence;
}

/** Convenience wrapper that returns just the final column. */
export function traceFinalColumn(ladder: Ladder, startCol: number): number {
  const sequence = getColumnSequence(ladder, startCol);
  return sequence[sequence.length - 1];
}

/** Returns the full start-column -> end-column mapping for a ladder. */
export function getResultMapping(ladder: Ladder, playerCount: number): number[] {
  return Array.from({ length: playerCount }, (_, startCol) => traceFinalColumn(ladder, startCol));
}
