import {describe, expect, it} from 'vitest';
import {
  formatChance,
  formatMonth,
  peakIndex,
  surname,
  yearStep,
  yearTicks,
} from '@/lib/display';

describe('formatChance', () => {
  it.each([
    [1, '100%'],
    [0.5354, '54%'],
    [0.1201, '12%'],
    [0.0995, '10%'],
    [0.0994, '9.9%'],
    [0.0235, '2.4%'],
    [0.001, '0.1%'],
    [0.0009, '<0.1%'],
    [0.00001, '<0.1%'],
    [0, '0%'],
  ])('shows %f as %s', (value, text) => {
    expect(formatChance(value)).toBe(text);
  });
});

describe('formatMonth', () => {
  it('shows a data date as its month and year', () => {
    expect(formatMonth('2040-02-11')).toBe('Feb 2040');
    expect(formatMonth('2026-10-01')).toBe('Oct 2026');
  });
});

describe('yearStep', () => {
  it('labels every year when there is room', () => {
    expect(yearStep(1500, 30)).toBe(1);
  });

  it('labels every other year on a laptop-width chart', () => {
    expect(yearStep(1000, 30)).toBe(2);
  });

  it('labels every five years on a tablet or a phone', () => {
    expect(yearStep(640, 30)).toBe(5);
    expect(yearStep(320, 30)).toBe(5);
  });

  it('falls back to ten years on a very narrow chart', () => {
    expect(yearStep(200, 30)).toBe(10);
  });
});

describe('yearTicks', () => {
  const start = new Date(Date.UTC(2026, 9, 22));
  const end = new Date(Date.UTC(2056, 9, 22));

  it('puts a tick on January 1 of each multiple of the step', () => {
    const ticks = yearTicks(start, end, 5);
    expect(ticks.map((tick) => tick.getUTCFullYear())).toEqual([
      2030, 2035, 2040, 2045, 2050, 2055,
    ]);
    expect(ticks[0].toISOString()).toBe('2030-01-01T00:00:00.000Z');
  });

  it('starts after the first date and stops at the last', () => {
    const ticks = yearTicks(start, end, 1);
    expect(ticks[0].getUTCFullYear()).toBe(2027);
    expect(ticks[ticks.length - 1].getUTCFullYear()).toBe(2056);
    expect(ticks).toHaveLength(30);
  });
});

describe('peakIndex', () => {
  it('finds the highest value', () => {
    expect(peakIndex([0, 0.2, 0.7, 0.4])).toBe(2);
  });

  it('keeps the earliest of tied values', () => {
    expect(peakIndex([1, 0.5, 1])).toBe(0);
  });
});

describe('surname', () => {
  it.each([
    ['Dallin H. Oaks', 'Oaks'],
    ['D. Todd Christofferson', 'Christofferson'],
    ['Gérald Caussé', 'Caussé'],
  ])('labels %s as %s', (name, label) => {
    expect(surname(name)).toBe(label);
  });
});
