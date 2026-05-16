import dayjs, { Dayjs } from "dayjs";
import type { SymbolDateRangeResult } from "../../services/symbolService";

export type DatePresetId = "1M" | "3M" | "6M" | "YTD" | "1Y" | "Max";

export const PRESETS: DatePresetId[] = ["1M", "3M", "6M", "YTD", "1Y", "Max"];

export function computePresetStart(
  preset: DatePresetId,
  rangeEnd: Dayjs,
  rangeStart: Dayjs
): Dayjs {
  switch (preset) {
    case "1M":
      return maxOf(rangeEnd.subtract(1, "month"), rangeStart);
    case "3M":
      return maxOf(rangeEnd.subtract(3, "month"), rangeStart);
    case "6M":
      return maxOf(rangeEnd.subtract(6, "month"), rangeStart);
    case "YTD":
      return maxOf(rangeEnd.startOf("year"), rangeStart);
    case "1Y":
      return maxOf(rangeEnd.subtract(1, "year"), rangeStart);
    case "Max":
      return rangeStart;
  }
}

export function detectActivePreset(
  start: Dayjs | null,
  end: Dayjs | null,
  range: SymbolDateRangeResult | null | undefined
): DatePresetId | null {
  if (!start || !end || !range) return null;
  const rangeEnd = dayjs(range.lastDate);
  const rangeStart = dayjs(range.firstDate);
  if (!end.isSame(rangeEnd, "day")) return null;
  for (const p of PRESETS) {
    const expected = computePresetStart(p, rangeEnd, rangeStart);
    if (expected.isSame(start, "day")) return p;
  }
  return null;
}

function maxOf(a: Dayjs, b: Dayjs): Dayjs {
  return a.isBefore(b) ? b : a;
}
