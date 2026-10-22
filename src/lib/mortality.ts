import lifeTable from '@/data/actuarialLifeTable.json';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_YEAR = 365.2425;

// How an apostle's force of mortality compares with a U.S. man's of the same
// age. Apostles die far less often in their 60s and 70s, but the gap closes
// with age. Fitted by maximum likelihood to the record of every apostle who
// served from 1995 to Oct 2026: 14 deaths where the SSA table predicts 30.7.
// The ratio is 0.355 at age 85 and grows 8.6% a year (95% CI 1% to 28%),
// reaching 1 at about 97.5. A single ratio for all ages (0.455) fits worse
// (likelihood ratio p = 0.02): it makes apostles over 90 live too long and
// those under 85 die too often.
export function apostleHazardRatio(ageYears: number): number {
  return Math.min(1, 0.355 * Math.pow(1.086, ageYears - 85));
}

export interface MortalityModel {
  // Cumulative force of mortality from birth to an exact age in years.
  cumulativeHazard: (ageYears: number) => number;
}

// Builds a model from one-year death probabilities by age, assuming a
// constant force of mortality within each year of age, scaled by the hazard
// ratio at the middle of that year. Nobody survives past the last age in the
// table.
export function createMortalityModel(
  probabilityOfDeath: readonly number[],
  hazardRatio: (ageYears: number) => number
): MortalityModel {
  const hazards = probabilityOfDeath.map(
    (q, age) => -Math.log(1 - q) * hazardRatio(age + 0.5)
  );
  const cumulative = [0];
  hazards.forEach((hazard, age) => cumulative.push(cumulative[age] + hazard));

  return {
    cumulativeHazard(ageYears: number): number {
      if (ageYears < 0) throw new Error(`Negative age: ${ageYears}`);
      if (ageYears >= hazards.length) return Infinity;
      const wholeYears = Math.floor(ageYears);
      const partYear = ageYears - wholeYears;
      if (partYear === 0) return cumulative[wholeYears];
      return cumulative[wholeYears] + partYear * hazards[wholeYears];
    },
  };
}

export const apostleMortality: MortalityModel = createMortalityModel(
  lifeTable.probabilityOfDeath,
  apostleHazardRatio
);

export function ageInYears(birthDate: Date, date: Date): number {
  return (date.getTime() - birthDate.getTime()) / MS_PER_DAY / DAYS_PER_YEAR;
}

// Probability that someone alive on `from` is still alive on `to`.
export function survivalProbability(
  model: MortalityModel,
  birthDate: Date,
  from: Date,
  to: Date
): number {
  if (to < from) throw new Error('The end date is before the start date');
  const hazardFrom = model.cumulativeHazard(ageInYears(birthDate, from));
  const hazardTo = model.cumulativeHazard(ageInYears(birthDate, to));
  if (hazardTo === Infinity) return 0;
  return Math.exp(hazardFrom - hazardTo);
}

// Age as people count it: it goes up on the birthday.
export function completedYears(birthDate: Date, date: Date): number {
  const years = date.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = date.getUTCMonth() - birthDate.getUTCMonth();
  const beforeBirthday =
    monthDiff < 0 ||
    (monthDiff === 0 && date.getUTCDate() < birthDate.getUTCDate());
  return beforeBirthday ? years - 1 : years;
}
