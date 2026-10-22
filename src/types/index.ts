import {DatumValue} from '@nivo/core';

export interface graphDataType {
  id: string;
  // 1 for the most senior apostle; null for a future apostle.
  seniority: number | null;
  data: {
    x: string;
    y: number;
    age: number | null;
  }[];
}

export interface coloredGraphDataType extends graphDataType {
  color: string;
}

export interface graphDataPointType {
  x: DatumValue;
  xFormatted: string | number;
  y: DatumValue;
  yFormatted: string | number;
  yStacked?: number | undefined;
  age: number | null;
}

export type hoverDataType = {
  date: string;
  points: Array<{
    id: string;
    data: graphDataPointType;
  }>;
} | null;
