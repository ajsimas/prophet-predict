import {Line} from '@nivo/line';
import type {LineCustomSvgLayerProps} from '@nivo/line';
import {useEffect, useRef, useState} from 'react';
import type React from 'react';
import {useTheme} from '@/contexts/ThemeContext';
import {coloredGraphDataType, graphDataType} from '@/types';
import {
  formatMonth,
  peakIndex,
  surname,
  yearStep,
  yearTicks,
} from '@/lib/display';
import Legend from './Legend';
import {HIGHLIGHT_COLOR, colorSeries} from './seriesColors';

type LayerProps = LineCustomSvgLayerProps<coloredGraphDataType>;
// What the drawing helpers need from a series, computed or not.
type SeriesInfo = Pick<
  coloredGraphDataType,
  'id' | 'seniority' | 'featured' | 'color'
>;
type Box = {x0: number; x1: number; y0: number; y1: number};

const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
// Lines peaking below this get no label unless highlighted.
const LABEL_MIN_PEAK = 0.04;

const CHART_COLORS = {
  light: {
    background: '#ffffff',
    ink: '#111827',
    label: '#4b5563',
    axis: '#374151',
    grid: '#e5e7eb',
  },
  dark: {
    background: '#0f172a',
    ink: '#f1f5f9',
    label: '#cbd5e1',
    axis: '#cbd5e1',
    grid: '#334155',
  },
};

// Tracks an element's content size.
function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({width: 0, height: 0});
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : {width, height}
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

let measureContext: CanvasRenderingContext2D | null = null;
// Width of a 12px chart label in the page font.
function labelWidth(text: string, bold: boolean): number {
  measureContext ??= document.createElement('canvas').getContext('2d');
  if (!measureContext) return text.length * 7;
  const family = getComputedStyle(document.body).fontFamily;
  measureContext.font = `${bold ? 700 : 500} 12px ${family}`;
  return measureContext.measureText(text).width;
}

function lineLabel(series: SeriesInfo): string {
  if (series.seniority === null) return series.id;
  if (series.seniority === 1) return `${surname(series.id)}, President today`;
  return surname(series.id);
}

export default function LineGraph({
  data,
}: {
  data: graphDataType[];
}): React.JSX.Element {
  const {theme} = useTheme();
  const boxRef = useRef<HTMLDivElement>(null);
  const {width, height} = useSize(boxRef);
  // The date chosen on the chart, as an index into each series' data.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // The apostle whose line is drawn on top of the others.
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const pointerType = useRef('mouse');

  if (!data[0]?.data.length) return <></>;

  const colors = CHART_COLORS[theme];
  // Series arrive most senior first.
  const series = colorSeries(data, theme);
  const lastIndex = series[0].data.length - 1;
  const start = new Date(`${series[0].data[0].x}T00:00:00Z`);
  const end = new Date(`${series[0].data[lastIndex].x}T00:00:00Z`);

  const compact = width < 640;
  const margin = compact
    ? {top: 32, right: 16, bottom: 32, left: 44}
    : {top: 32, right: 28, bottom: 52, left: 68};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xTicks = yearTicks(
    start,
    end,
    yearStep(innerWidth, (end.getTime() - start.getTime()) / MS_PER_YEAR)
  );
  const yTicks =
    innerHeight < 320
      ? [0, 0.25, 0.5, 0.75, 1]
      : [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

  const toggleHighlight = (id: string) =>
    setHighlighted((prev) => (prev === id ? null : id));

  // Gray lines at the bottom, the successors above them with the next in
  // line on top, and a highlighted line above everything.
  const drawOrder = (s: SeriesInfo) =>
    s.id === highlighted
      ? 3
      : s.featured
      ? 2 + 1 / (s.seniority ?? 1)
      : s.seniority === null
      ? 0
      : 1;

  const strokeFor = (s: SeriesInfo) =>
    s.id === highlighted && !s.featured ? HIGHLIGHT_COLOR[theme] : s.color;

  function LinesLayer({series: computed, lineGenerator}: LayerProps) {
    return (
      <g>
        {[...computed]
          .sort((a, b) => drawOrder(a) - drawOrder(b))
          .map((s) => (
            <path
              key={s.id}
              d={lineGenerator(s.data.map((d) => d.position)) ?? undefined}
              fill="none"
              stroke={strokeFor(s)}
              strokeWidth={s.id === highlighted ? 3 : 2}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={highlighted === null || s.id === highlighted ? 1 : 0.25}
            />
          ))}
      </g>
    );
  }

  // Each line is named at its highest point. Labels are placed most
  // important first and skipped where they would overlap one already placed.
  function LabelsLayer({
    series: computed,
    innerWidth: w,
    innerHeight: h,
  }: LayerProps) {
    const placed: Box[] = [];
    const isFree = (b: Box) =>
      b.x0 >= 0 &&
      b.x1 <= w &&
      b.y0 >= -6 &&
      b.y1 <= h - 2 &&
      !placed.some(
        (p) => !(b.x1 < p.x0 || b.x0 > p.x1 || b.y1 < p.y0 || b.y0 > p.y1)
      );
    const priority = (s: SeriesInfo, peak: number) =>
      (s.id === highlighted
        ? 1000
        : s.featured
        ? 500
        : s.seniority === 1
        ? 400
        : 0) +
      peak * 100;
    const candidates = computed
      .map((s) => {
        const index = peakIndex(s.data.map((d) => Number(d.data.y)));
        return {s, index, peak: Number(s.data[index].data.y)};
      })
      .filter((c) => c.peak >= LABEL_MIN_PEAK || c.s.id === highlighted)
      .sort((a, b) => priority(b.s, b.peak) - priority(a.s, a.peak));

    const labels: React.JSX.Element[] = [];
    for (const {s, index} of candidates) {
      const text = lineLabel(s);
      const strong = s.featured || s.id === highlighted;
      const textWidth = labelWidth(text, strong);
      const {x, y} = s.data[index].position;
      const tries =
        index === 0
          ? [{x: x + 8, y: y + 14}]
          : [
              {x: x - textWidth / 2, y: y - 9},
              {x: x + 6, y: y - 7},
              {x: x - textWidth - 6, y: y - 7},
              {x: x - textWidth / 2, y: y - 23},
              {x: x - textWidth - 6, y: y + 16},
            ];
      for (const t of tries) {
        const x0 = Math.min(Math.max(t.x, 2), w - 2 - textWidth);
        const box = {
          x0: x0 - 3,
          x1: x0 + textWidth + 3,
          y0: t.y - 12,
          y1: t.y + 3,
        };
        if (!isFree(box)) continue;
        placed.push(box);
        labels.push(
          <text
            key={s.id}
            x={x0}
            y={t.y}
            fill={strong ? colors.ink : colors.label}
            stroke={colors.background}
            strokeWidth={4}
            strokeLinejoin="round"
            paintOrder="stroke"
            style={{fontSize: 12, fontWeight: strong ? 700 : 500}}
            opacity={highlighted === null || s.id === highlighted ? 1 : 0.45}
          >
            {text}
          </text>
        );
        break;
      }
    }
    return <g pointerEvents="none">{labels}</g>;
  }

  // The chosen date: a solid rule, a dot on each colored line, and the month
  // above the plot.
  function CursorLayer({
    series: computed,
    innerHeight: h,
    innerWidth: w,
  }: LayerProps) {
    if (activeIndex === null) return null;
    const x = computed[0].data[activeIndex].position.x;
    const text = formatMonth(series[0].data[activeIndex].x);
    const pillWidth = labelWidth(text, true) + 16;
    const pillX = Math.min(
      Math.max(x - pillWidth / 2, -margin.left + 2),
      w + margin.right - pillWidth - 2
    );
    return (
      <g pointerEvents="none">
        <line
          x1={x}
          x2={x}
          y1={-6}
          y2={h}
          stroke={colors.ink}
          strokeOpacity={0.7}
          strokeWidth={1}
        />
        {computed
          .filter(
            (s) =>
              (s.featured || s.id === highlighted) &&
              Number(s.data[activeIndex].data.y) >= 0.0005
          )
          .map((s) => (
            <circle
              key={s.id}
              cx={x}
              cy={s.data[activeIndex].position.y}
              r={4.5}
              fill={strokeFor(s)}
              stroke={colors.background}
              strokeWidth={2}
            />
          ))}
        <g transform={`translate(${pillX},${-margin.top + 4})`}>
          <rect width={pillWidth} height={22} rx={11} fill={colors.ink} />
          <text
            x={pillWidth / 2}
            y={15}
            textAnchor="middle"
            fill={colors.background}
            style={{fontSize: 12, fontWeight: 700}}
          >
            {text}
          </text>
        </g>
      </g>
    );
  }

  // Takes the pointer: hovering with a mouse, or tapping and dragging on a
  // touch screen, chooses the nearest date. Vertical drags still scroll the
  // page. Clicking with a mouse near a line highlights it.
  function PointerLayer({
    series: computed,
    innerWidth: w,
    innerHeight: h,
  }: LayerProps) {
    const positions = computed[0].data.map((d) => d.position.x);
    const nearestIndex = (x: number) => {
      let best = 0;
      positions.forEach((position, index) => {
        if (Math.abs(position - x) < Math.abs(positions[best] - x))
          best = index;
      });
      return best;
    };
    const plotPoint = (event: React.PointerEvent | React.MouseEvent) => {
      const rect = (
        event.currentTarget as SVGRectElement
      ).getBoundingClientRect();
      return {x: event.clientX - rect.left, y: event.clientY - rect.top};
    };
    const choose = (event: React.PointerEvent) => {
      pointerType.current = event.pointerType;
      setActiveIndex(nearestIndex(plotPoint(event).x));
    };
    return (
      <rect
        width={w}
        height={h}
        fill="transparent"
        style={{touchAction: 'pan-y', cursor: 'crosshair'}}
        onPointerDown={choose}
        onPointerMove={choose}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setActiveIndex(null);
        }}
        onClick={(event) => {
          if (pointerType.current !== 'mouse') return;
          const {x, y} = plotPoint(event);
          const index = nearestIndex(x);
          const nearest = computed
            .map((s) => ({
              id: s.id,
              distance: Math.abs(s.data[index].position.y - y),
            }))
            .sort((a, b) => a.distance - b.distance)[0];
          if (nearest && nearest.distance <= 12) toggleHighlight(nearest.id);
          else setHighlighted(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
      <section
        aria-label="Chart"
        className="flex flex-col gap-1 px-2 pt-3 md:px-6 lg:min-h-0 lg:min-w-0 lg:flex-1 lg:pb-4"
      >
        <p className="m-0 px-2 text-sm text-gray-600 dark:text-slate-400">
          <span className="pointer-coarse:hidden">
            Point at the chart to see each apostle&apos;s chance on that date.
            Click a line or a name to highlight it.
          </span>
          <span className="hidden pointer-coarse:inline">
            Tap or drag across the chart to see each apostle&apos;s chance on
            that date. Tap a name to highlight it.
          </span>
        </p>
        <div
          ref={boxRef}
          className="relative h-[clamp(280px,55dvh,560px)] touch-pan-y lg:h-auto lg:min-h-[320px] lg:flex-1"
        >
          {width > 0 && height > 0 && (
            <div className="absolute inset-0">
              <Line
                data={series}
                width={width}
                height={height}
                margin={margin}
                xScale={{
                  format: '%Y-%m-%d',
                  type: 'time',
                  min: 'auto',
                  max: 'auto',
                }}
                yScale={{type: 'linear', stacked: false, min: 0, max: 1}}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickValues: xTicks,
                  tickSize: 5,
                  tickPadding: 5,
                  format: (value: Date) => String(value.getUTCFullYear()),
                  legend: compact ? '' : 'Year',
                  legendOffset: 40,
                  legendPosition: 'middle',
                }}
                axisLeft={{
                  tickValues: yTicks,
                  tickSize: 5,
                  tickPadding: 5,
                  format: (value: number) => `${Math.round(value * 100)}%`,
                  legend: compact ? '' : 'Prophet Probability',
                  legendOffset: -54,
                  legendPosition: 'middle',
                }}
                enableGridX={false}
                gridYValues={yTicks}
                colors={{datum: 'color'}}
                isInteractive={false}
                animate={false}
                ariaLabel={`Line chart of each apostle's chance of being President on each date, ${formatMonth(
                  series[0].data[0].x
                )} to ${formatMonth(
                  series[0].data[lastIndex].x
                )}. The legend lists each apostle's highest chance and when it comes.`}
                layers={[
                  'grid',
                  'axes',
                  LinesLayer,
                  LabelsLayer,
                  CursorLayer,
                  PointerLayer,
                ]}
                theme={{
                  text: {fontFamily: 'inherit', fontSize: 12},
                  axis: {
                    ticks: {text: {fill: colors.axis}},
                    legend: {text: {fill: colors.axis}},
                  },
                  grid: {line: {stroke: colors.grid}},
                }}
              />
            </div>
          )}
        </div>
      </section>
      <Legend
        series={series}
        activeIndex={activeIndex}
        highlighted={highlighted}
        highlightColor={HIGHLIGHT_COLOR[theme]}
        onHighlight={toggleHighlight}
        onClearDate={() => setActiveIndex(null)}
      />
    </div>
  );
}
