import apostlesData from '@/data/apostles.json';

export interface ApostleRecord {
  seniority: number;
  name: string;
  birthDate: string;
  ordinationDate: string;
}

export interface Apostle {
  // 1 for the most senior apostle, who is the President.
  seniority: number;
  name: string;
  birthDate: Date;
  ordinationDate: Date;
}

// Reads a YYYY-MM-DD date as midnight UTC.
export function parseDate(value: string): Date {
  const date = new Date(`${value}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`Expected a YYYY-MM-DD date, got "${value}"`);
  }
  return date;
}

// Checks the apostles' records and returns them most senior first. Seniority
// is listed rather than worked out from ordination dates, because apostles
// ordained on the same day are ranked by the order they were ordained in.
export function parseRoster(records: readonly ApostleRecord[]): Apostle[] {
  const apostles = records
    .map((record) => ({
      seniority: record.seniority,
      name: record.name,
      birthDate: parseDate(record.birthDate),
      ordinationDate: parseDate(record.ordinationDate),
    }))
    .sort((a, b) => a.seniority - b.seniority);

  apostles.forEach((apostle, index) => {
    if (apostle.seniority !== index + 1) {
      throw new Error(
        `Seniority must run from 1 to ${apostles.length} with no gaps or repeats`
      );
    }
    if (
      apostles.some((other) => other !== apostle && other.name === apostle.name)
    ) {
      throw new Error(`${apostle.name} is listed more than once`);
    }
    if (apostle.ordinationDate <= apostle.birthDate) {
      throw new Error(`${apostle.name} is ordained before being born`);
    }
    const senior = apostles[index - 1];
    if (senior && apostle.ordinationDate < senior.ordinationDate) {
      throw new Error(
        `${apostle.name} is ranked below ${senior.name} but was ordained first`
      );
    }
  });

  return apostles;
}

export const roster = {
  // The date the list of living apostles was last checked.
  asOf: parseDate(apostlesData.asOf),
  apostles: parseRoster(apostlesData.apostles),
};
