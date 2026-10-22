import {graphDataType, coloredGraphDataType} from '@/types';

type Theme = 'light' | 'dark';

// Sixteen lines can't be told apart by color, so only the three apostles next
// in line after the President, the likely successors, get a color of their
// own. Everyone else is gray and named by the label on their line. Each set
// passes the data-viz palette checks (contrast and color blindness) on its
// theme's chart background.
const SUCCESSOR_COLORS: Record<Theme, readonly string[]> = {
  light: ['#2a78d6', '#eb6834', '#1baf7a'],
  dark: ['#3987e5', '#d95926', '#199e70'],
};
const APOSTLE_COLOR: Record<Theme, string> = {
  light: '#a1a7af',
  dark: '#646b75',
};
const FUTURE_APOSTLE_COLOR: Record<Theme, string> = {
  light: '#c9cdd3',
  dark: '#3f454d',
};
// A highlighted gray line is drawn in the text color instead.
export const HIGHLIGHT_COLOR: Record<Theme, string> = {
  light: '#1f2937',
  dark: '#f1f5f9',
};

export function colorSeries(
  data: graphDataType[],
  theme: Theme
): coloredGraphDataType[] {
  return data.map((series) => {
    const successor =
      series.seniority === null
        ? undefined
        : SUCCESSOR_COLORS[theme][series.seniority - 2];
    return {
      ...series,
      featured: successor !== undefined,
      color:
        successor ??
        (series.seniority === null
          ? FUTURE_APOSTLE_COLOR[theme]
          : APOSTLE_COLOR[theme]),
    };
  });
}
