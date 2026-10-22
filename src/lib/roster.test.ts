import {describe, expect, it} from 'vitest';
import apostlesData from '@/data/apostles.json';
import {ApostleRecord, parseDate, parseRoster, roster} from '@/lib/roster';

describe('parseDate', () => {
  it('reads a YYYY-MM-DD date as midnight UTC', () => {
    expect(parseDate('2026-02-12').toISOString()).toBe(
      '2026-02-12T00:00:00.000Z'
    );
  });

  it.each([
    '2026-2-12',
    '2026-02-30',
    '02/12/2026',
    '2026-02-12T12:00:00Z',
    '',
  ])('rejects "%s"', (value) => {
    expect(() => parseDate(value)).toThrow();
  });
});

describe('parseRoster', () => {
  const records: ApostleRecord[] = [
    {
      seniority: 1,
      name: 'A',
      birthDate: '1930-01-01',
      ordinationDate: '1980-01-01',
    },
    {
      seniority: 2,
      name: 'B',
      birthDate: '1950-01-01',
      ordinationDate: '1990-01-01',
    },
    {
      seniority: 3,
      name: 'C',
      birthDate: '1940-01-01',
      ordinationDate: '1990-01-01',
    },
  ];

  it('returns the apostles most senior first', () => {
    const apostles = parseRoster([...records].reverse());
    expect(apostles.map((apostle) => apostle.name)).toEqual(['A', 'B', 'C']);
    expect(apostles[0].birthDate).toEqual(parseDate('1930-01-01'));
  });

  it('ranks apostles ordained on the same day as listed', () => {
    const swapped = [
      records[0],
      {...records[1], seniority: 3},
      {...records[2], seniority: 2},
    ];
    expect(parseRoster(swapped).map((apostle) => apostle.name)).toEqual([
      'A',
      'C',
      'B',
    ]);
  });

  it('rejects gaps and repeats in seniority', () => {
    expect(() => parseRoster([records[0], records[2]])).toThrow(/no gaps/);
    expect(() =>
      parseRoster([records[0], {...records[1], seniority: 1}])
    ).toThrow(/no gaps/);
  });

  it('rejects a ranking that contradicts the ordination dates', () => {
    expect(() =>
      parseRoster([
        {...records[0], seniority: 2},
        {...records[1], seniority: 1},
      ])
    ).toThrow(/ordained first/);
  });

  it('rejects an ordination before birth', () => {
    expect(() =>
      parseRoster([{...records[0], ordinationDate: '1920-01-01'}])
    ).toThrow(/before being born/);
  });

  it('rejects a name listed twice', () => {
    expect(() => parseRoster([records[0], {...records[1], name: 'A'}])).toThrow(
      /more than once/
    );
  });

  it('rejects a malformed date', () => {
    expect(() => parseRoster([{...records[0], birthDate: '1930-1-1'}])).toThrow(
      /YYYY-MM-DD/
    );
  });
});

describe('the apostle list', () => {
  it('has between 1 and 15 apostles', () => {
    expect(roster.apostles.length).toBeGreaterThan(0);
    expect(roster.apostles.length).toBeLessThanOrEqual(15);
  });

  it('is written in seniority order', () => {
    expect(apostlesData.apostles.map((apostle) => apostle.seniority)).toEqual(
      roster.apostles.map((apostle) => apostle.seniority)
    );
  });

  it('was checked after the latest ordination', () => {
    roster.apostles.forEach((apostle) => {
      expect(roster.asOf.getTime()).toBeGreaterThanOrEqual(
        apostle.ordinationDate.getTime()
      );
    });
  });
});
