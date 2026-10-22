import {describe, expect, it} from 'vitest';
import lifeTable from '@/data/actuarialLifeTable.json';
import {
  ageInYears,
  apostleHazardRatio,
  apostleMortality,
  completedYears,
  createMortalityModel,
  survivalProbability,
} from '@/lib/mortality';
import {parseDate} from '@/lib/roster';

const q = lifeTable.probabilityOfDeath;
const unscaled = () => 1;

// Survival from one exact age to another.
function survivalBetweenAges(
  model: ReturnType<typeof createMortalityModel>,
  fromAge: number,
  toAge: number
): number {
  return Math.exp(
    model.cumulativeHazard(fromAge) - model.cumulativeHazard(toAge)
  );
}

describe('life table', () => {
  it('has a death probability for every age from 0 to 119', () => {
    expect(q).toHaveLength(120);
    q.forEach((value) => {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(1);
    });
  });

  it('rises with age from age 10 on', () => {
    for (let age = 10; age < q.length - 1; age++) {
      expect(q[age + 1]).toBeGreaterThanOrEqual(q[age]);
    }
  });
});

describe('createMortalityModel', () => {
  it('gives a one-year survival of 1 - q for each year of age', () => {
    const model = createMortalityModel([0.1, 0.25, 0.5, 0.75], unscaled);
    expect(survivalBetweenAges(model, 0, 1)).toBeCloseTo(0.9, 12);
    expect(survivalBetweenAges(model, 1, 2)).toBeCloseTo(0.75, 12);
    expect(survivalBetweenAges(model, 2, 3)).toBeCloseTo(0.5, 12);
    expect(survivalBetweenAges(model, 0, 3)).toBeCloseTo(0.9 * 0.75 * 0.5, 12);
  });

  it('scales the force of mortality by the hazard ratio mid-year', () => {
    for (let age = 0; age < q.length - 1; age++) {
      expect(survivalBetweenAges(apostleMortality, age, age + 1)).toBeCloseTo(
        Math.pow(1 - q[age], apostleHazardRatio(age + 0.5)),
        12
      );
    }
  });

  it('keeps the force of mortality constant within a year of age', () => {
    const model = createMortalityModel([0.1, 0.36], unscaled);
    expect(survivalBetweenAges(model, 1, 1.5)).toBeCloseTo(0.8, 12);
    expect(survivalBetweenAges(model, 1.5, 1.75)).toBeCloseTo(
      Math.sqrt(0.8),
      12
    );
  });

  it('lets nobody live past the end of the table', () => {
    const model = createMortalityModel([0.1, 0.36], unscaled);
    expect(model.cumulativeHazard(2)).toBe(Infinity);
    expect(model.cumulativeHazard(50)).toBe(Infinity);
  });

  it('treats a death probability of 1 as certain death', () => {
    const model = createMortalityModel([0.1, 1], unscaled);
    expect(survivalBetweenAges(model, 1, 1.5)).toBe(0);
    expect(model.cumulativeHazard(1)).toBeCloseTo(-Math.log(0.9), 12);
  });

  it('rejects negative ages', () => {
    expect(() => apostleMortality.cumulativeHazard(-0.1)).toThrow();
  });
});

describe('apostleHazardRatio', () => {
  it('is 0.355 at age 85 and grows 8.6% a year', () => {
    expect(apostleHazardRatio(85)).toBeCloseTo(0.355, 12);
    expect(apostleHazardRatio(70)).toBeCloseTo(
      0.355 * Math.pow(1.086, -15),
      12
    );
    expect(apostleHazardRatio(91) / apostleHazardRatio(90)).toBeCloseTo(
      1.086,
      12
    );
  });

  it('reaches the U.S. rate at about 97.5 and stays there', () => {
    expect(apostleHazardRatio(97)).toBeLessThan(1);
    expect(apostleHazardRatio(98)).toBe(1);
    expect(apostleHazardRatio(119)).toBe(1);
  });
});

describe('survivalProbability', () => {
  const birthDate = parseDate('1932-08-12');
  const from = parseDate('2026-10-22');

  it('is 1 over no time', () => {
    expect(survivalProbability(apostleMortality, birthDate, from, from)).toBe(
      1
    );
  });

  it('never rises as the end date moves later, and reaches 0 at age 120', () => {
    let previous = 1;
    for (let year = 2027; year <= 2060; year++) {
      const to = parseDate(`${year}-01-01`);
      const survival = survivalProbability(
        apostleMortality,
        birthDate,
        from,
        to
      );
      expect(survival).toBeLessThanOrEqual(previous);
      previous = survival;
    }
    expect(
      survivalProbability(
        apostleMortality,
        birthDate,
        from,
        parseDate('2052-08-12')
      )
    ).toBe(0);
  });

  it('rejects an end date before the start date', () => {
    expect(() =>
      survivalProbability(
        apostleMortality,
        birthDate,
        from,
        parseDate('2026-10-21')
      )
    ).toThrow();
  });
});

describe('ageInYears', () => {
  it('counts years of 365.2425 days', () => {
    const birthDate = parseDate('2000-01-01');
    expect(ageInYears(birthDate, birthDate)).toBe(0);
    expect(ageInYears(birthDate, parseDate('2400-01-01'))).toBeCloseTo(400, 12);
  });
});

describe('completedYears', () => {
  it('goes up on the birthday', () => {
    const birthDate = parseDate('1963-05-20');
    expect(completedYears(birthDate, parseDate('2056-05-19'))).toBe(92);
    expect(completedYears(birthDate, parseDate('2056-05-20'))).toBe(93);
  });

  it('handles a leap-day birthday', () => {
    const birthDate = parseDate('2000-02-29');
    expect(completedYears(birthDate, parseDate('2001-02-28'))).toBe(0);
    expect(completedYears(birthDate, parseDate('2001-03-01'))).toBe(1);
    expect(completedYears(birthDate, parseDate('2004-02-29'))).toBe(4);
  });
});
