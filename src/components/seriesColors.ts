import {graphDataType, coloredGraphDataType} from '@/types';

// One color per apostle by seniority, shared by the chart and both legends.
const APOSTLE_COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#bcbd22',
  '#17becf',
  '#aec7e8',
  '#ffbb78',
  '#98df8a',
  '#ff9896',
  '#c5b0d5',
  '#c49c94',
];
const FUTURE_APOSTLE_COLOR = '#7f7f7f';

export function colorSeries(data: graphDataType[]): coloredGraphDataType[] {
  return data.map((series) => ({
    ...series,
    color:
      series.seniority === null
        ? FUTURE_APOSTLE_COLOR
        : APOSTLE_COLORS[(series.seniority - 1) % APOSTLE_COLORS.length],
  }));
}
