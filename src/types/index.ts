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
  // True for the apostles next in line, who get a color of their own.
  featured: boolean;
}
