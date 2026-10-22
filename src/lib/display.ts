// Helpers for showing the forecast: number formats, axis spacing and labels.

// Whole percents from 10%, one decimal below that, and "<0.1%" for chances
// that would otherwise read as zero.
export function formatChance(value: number): string {
  if (value === 0) return '0%';
  if (value < 0.001) return '<0.1%';
  const percent = value * 100;
  if (percent < 9.95) return `${percent.toFixed(1)}%`;
  return `${Math.round(percent)}%`;
}

const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

// A data date (YYYY-MM-DD) as a month and year: "Feb 2040".
export function formatMonth(date: string): string {
  return monthYear.format(new Date(`${date}T00:00:00Z`));
}

// The year step for x-axis labels: the smallest of 1, 2, 5 or 10 years that
// leaves at least `minGap` pixels from one label to the next.
export function yearStep(widthPx: number, years: number, minGap = 44): number {
  const perYear = widthPx / years;
  return [1, 2, 5].find((step) => step * perYear >= minGap) ?? 10;
}

// January 1 of every year between two dates that is a multiple of `step`,
// in UTC to match the chart's time scale.
export function yearTicks(start: Date, end: Date, step: number): Date[] {
  const ticks: Date[] = [];
  const first = Math.ceil(start.getUTCFullYear() / step) * step;
  for (let year = first; year <= end.getUTCFullYear(); year += step) {
    const tick = new Date(Date.UTC(year, 0, 1));
    if (tick >= start && tick <= end) ticks.push(tick);
  }
  return ticks;
}

// The index of the highest value, the earliest one if several tie.
export function peakIndex(values: readonly number[]): number {
  let peak = 0;
  values.forEach((value, index) => {
    if (value > values[peak]) peak = index;
  });
  return peak;
}

// The name a line is labeled with: "Dallin H. Oaks" is "Oaks".
export function surname(name: string): string {
  const words = name.trim().split(/\s+/);
  return words[words.length - 1];
}
