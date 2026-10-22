import type React from 'react';
import {coloredGraphDataType} from '@/types';
import {formatChance, formatMonth, peakIndex} from '@/lib/display';

// The readout beside the chart (below it on smaller screens). At rest it
// shows each apostle's highest chance and the year it comes; while a date is
// chosen on the chart it shows each apostle's chance on that date. Rows stay
// in seniority order so the apostle you are following doesn't move, and each
// row highlights that apostle's line.
export default function Legend({
  series,
  activeIndex,
  highlighted,
  highlightColor,
  onHighlight,
  onClearDate,
}: {
  series: coloredGraphDataType[];
  activeIndex: number | null;
  highlighted: string | null;
  // The color a highlighted gray line is drawn in.
  highlightColor: string;
  onHighlight: (id: string) => void;
  onClearDate: () => void;
}): React.JSX.Element {
  const rows = series.map((s) => {
    const index =
      activeIndex === null ? peakIndex(s.data.map((d) => d.y)) : activeIndex;
    return {
      series: s,
      value: s.data[index].y,
      age: s.data[activeIndex === null ? 0 : activeIndex].age,
      when:
        activeIndex === null
          ? index === 0
            ? 'now'
            : s.data[index].x.slice(0, 4)
          : null,
    };
  });
  const leader =
    activeIndex === null
      ? null
      : rows.reduce((best, row) => (row.value > best.value ? row : best));

  return (
    <aside
      className="border-t border-gray-200 bg-gray-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900 md:px-8 lg:w-[360px] lg:flex-shrink-0 xl:w-[380px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:bg-white lg:px-5 lg:py-4 lg:dark:bg-slate-900"
      aria-labelledby="legend-title"
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="legend-title"
            className="m-0 text-base font-semibold text-gray-800 dark:text-slate-100"
          >
            Apostles
          </h2>
          <p className="m-0 text-sm text-gray-600 dark:text-slate-400">
            {activeIndex === null
              ? 'Highest chance, and when'
              : `Chance on ${formatMonth(series[0].data[activeIndex].x)}`}
          </p>
        </div>
        {activeIndex !== null && (
          <button
            type="button"
            className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-blue-800 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
            onClick={onClearDate}
          >
            Clear
          </button>
        )}
      </div>
      <div
        className="flex justify-end gap-2 pb-1 pr-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400 md:hidden lg:flex"
        aria-hidden="true"
      >
        <span className="w-8 text-right">Age</span>
        <span className="w-[84px] text-right">Chance</span>
      </div>
      <ol className="m-0 list-none p-0 md:columns-2 md:gap-x-8 lg:columns-1">
        {rows.map(({series: s, value, age, when}) => {
          const isHighlighted = highlighted === s.id;
          const faint = activeIndex !== null && value < 0.001;
          return (
            <li key={s.id} className="break-inside-avoid">
              <button
                type="button"
                aria-pressed={isHighlighted}
                onClick={() => onHighlight(s.id)}
                className={`flex min-h-8 w-full cursor-pointer items-center gap-2 rounded-md border px-2 py-1 text-left text-sm ${
                  isHighlighted
                    ? 'border-gray-800 font-semibold dark:border-slate-200'
                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className="h-[3px] w-4 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      isHighlighted && !s.featured ? highlightColor : s.color,
                  }}
                  aria-hidden="true"
                />
                <span
                  className={`min-w-0 flex-1 leading-tight ${
                    faint
                      ? 'text-gray-500 dark:text-slate-400'
                      : 'text-gray-800 dark:text-slate-200'
                  }`}
                >
                  {s.id}
                </span>
                <span className="w-8 flex-shrink-0 text-right tabular-nums text-gray-500 dark:text-slate-400">
                  {faint ? '' : age}
                  {age !== null && !faint && (
                    <span className="sr-only"> years old</span>
                  )}
                </span>
                <span className="relative flex w-[84px] flex-shrink-0 items-center justify-end gap-1 tabular-nums">
                  <span
                    className="absolute inset-y-0.5 left-0 rounded-sm bg-gray-200 dark:bg-slate-700"
                    style={{width: `${Math.min(1, value) * 100}%`}}
                    aria-hidden="true"
                  />
                  <span
                    className={`relative ${
                      faint
                        ? 'text-gray-500 dark:text-slate-400'
                        : leader && leader.series.id === s.id
                        ? 'font-bold text-gray-900 dark:text-white'
                        : 'text-gray-800 dark:text-slate-200'
                    }`}
                  >
                    {formatChance(value)}
                  </span>
                  {when && (
                    <span className="relative text-gray-500 dark:text-slate-400">
                      {when}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
