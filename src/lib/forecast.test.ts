import {describe, expect, it} from 'vitest';
import {
  FUTURE_APOSTLE,
  buildForecast,
  presidingProbabilities,
} from '@/lib/forecast';
import {
  apostleMortality,
  completedYears,
  survivalProbability,
} from '@/lib/mortality';
import {parseDate, roster} from '@/lib/roster';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

describe('presidingProbabilities', () => {
  it('needs an apostle alive and everyone senior to them dead', () => {
    const {apostles, futureApostle} = presidingProbabilities([0.9, 0.8, 0.7]);
    expect(apostles[0]).toBeCloseTo(0.9, 12);
    expect(apostles[1]).toBeCloseTo(0.1 * 0.8, 12);
    expect(apostles[2]).toBeCloseTo(0.1 * 0.2 * 0.7, 12);
    expect(futureApostle).toBeCloseTo(0.1 * 0.2 * 0.3, 12);
  });

  it('leaves nothing to anyone junior to an apostle certain to be alive', () => {
    const {apostles, futureApostle} = presidingProbabilities([0.5, 1, 0.9]);
    expect(apostles).toEqual([0.5, 0.5, 0]);
    expect(futureApostle).toBe(0);
  });

  it('gives everything to a future apostle when all have died', () => {
    const {apostles, futureApostle} = presidingProbabilities([0, 0]);
    expect(apostles).toEqual([0, 0]);
    expect(futureApostle).toBe(1);
  });
});

describe('buildForecast on the current apostles', () => {
  const start = parseDate('2026-10-22');
  const forecast = buildForecast(roster.apostles, {
    start,
    years: 30,
    stepDays: 90,
    mortality: apostleMortality,
  });
  const dates = forecast[0].data.map((point) => point.x);

  it('has one series per apostle, most senior first, then a future apostle', () => {
    expect(forecast.map((series) => series.id)).toEqual([
      ...roster.apostles.map((apostle) => apostle.name),
      FUTURE_APOSTLE,
    ]);
    expect(forecast.map((series) => series.seniority)).toEqual([
      ...roster.apostles.map((apostle) => apostle.seniority),
      null,
    ]);
  });

  it('samples every 90 days for 30 years from the start date', () => {
    expect(dates[0]).toBe('2026-10-22');
    expect(dates).toHaveLength(122);
    dates.slice(1).forEach((date, index) => {
      const gap = parseDate(date).getTime() - parseDate(dates[index]).getTime();
      expect(gap).toBe(90 * MS_PER_DAY);
    });
    expect(dates[dates.length - 1] <= '2056-10-22').toBe(true);
    forecast.forEach((series) => {
      expect(series.data.map((point) => point.x)).toEqual(dates);
    });
  });

  it('starts with the most senior apostle presiding', () => {
    forecast.forEach((series, index) => {
      expect(series.data[0].y).toBe(index === 0 ? 1 : 0);
    });
  });

  it('gives probabilities between 0 and 1 that sum to 1 on every date', () => {
    dates.forEach((_, day) => {
      let total = 0;
      forecast.forEach((series) => {
        const {y} = series.data[day];
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(1);
        total += y;
      });
      expect(total).toBeCloseTo(1, 12);
    });
  });

  it('only grows the chance that a future apostle presides', () => {
    const notYet = forecast[forecast.length - 1].data.map((point) => point.y);
    notYet.slice(1).forEach((y, index) => {
      expect(y).toBeGreaterThanOrEqual(notYet[index]);
    });
  });

  it('shows each apostle with their age on each date', () => {
    roster.apostles.forEach((apostle, index) => {
      forecast[index].data.forEach((point) => {
        expect(point.age).toBe(
          completedYears(apostle.birthDate, parseDate(point.x))
        );
      });
    });
    expect(forecast[0].data[0].age).toBe(94);
    forecast[forecast.length - 1].data.forEach((point) => {
      expect(point.age).toBeNull();
    });
  });

  it('matches a simulation of who presides', () => {
    // Small seeded generator (mulberry32) so the test always draws the same.
    let seed = 20261022;
    const random = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const trials = 100000;

    [20, 60, 100].forEach((day) => {
      const date = parseDate(dates[day]);
      const survival = roster.apostles.map((apostle) =>
        survivalProbability(apostleMortality, apostle.birthDate, start, date)
      );
      const counts = new Array(survival.length + 1).fill(0);
      for (let trial = 0; trial < trials; trial++) {
        const alive = survival.map((chance) => random() < chance);
        const president = alive.indexOf(true);
        counts[president === -1 ? survival.length : president]++;
      }
      // Allow five standard errors, plus a few draws for rare outcomes.
      forecast.forEach((series, index) => {
        const p = series.data[day].y;
        const tolerance = 5 * Math.sqrt((p * (1 - p)) / trials) + 5 / trials;
        expect(Math.abs(counts[index] / trials - p)).toBeLessThan(tolerance);
      });
    });
  });
});
