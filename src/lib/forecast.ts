import {graphDataType} from '@/types';
import {Apostle} from '@/lib/roster';
import {
  MortalityModel,
  completedYears,
  survivalProbability,
} from '@/lib/mortality';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Stands for whoever presides once all of today's apostles have died.
export const FUTURE_APOSTLE = 'A future apostle';

// Takes each apostle's chance of being alive on a date, most senior first.
// The President is the most senior living apostle, so an apostle presides if
// they are alive and everyone senior to them has died. If all of them have
// died, the President is someone who is not an apostle yet. Deaths are taken
// to be independent, and the chances sum to 1.
export function presidingProbabilities(survival: readonly number[]): {
  apostles: number[];
  futureApostle: number;
} {
  let allSeniorsDead = 1;
  const apostles = survival.map((alive) => {
    const presiding = alive * allSeniorsDead;
    allSeniorsDead *= 1 - alive;
    return presiding;
  });
  return {apostles, futureApostle: allSeniorsDead};
}

export interface ForecastOptions {
  // Everyone in the roster is taken to be alive on this date.
  start: Date;
  years: number;
  stepDays: number;
  mortality: MortalityModel;
}

// One series per apostle, most senior first, then one for a future apostle,
// each giving the chance of presiding on dates `stepDays` apart.
export function buildForecast(
  apostles: readonly Apostle[],
  {start, years, stepDays, mortality}: ForecastOptions
): graphDataType[] {
  const series: graphDataType[] = [
    ...apostles.map((apostle) => ({
      id: apostle.name,
      seniority: apostle.seniority,
      data: [],
    })),
    {id: FUTURE_APOSTLE, seniority: null, data: []},
  ];

  const end = new Date(start.getTime());
  end.setUTCFullYear(start.getUTCFullYear() + years);
  const totalDays = (end.getTime() - start.getTime()) / MS_PER_DAY;

  for (let day = 0; day <= totalDays; day += stepDays) {
    const date = new Date(start.getTime() + day * MS_PER_DAY);
    const x = date.toISOString().slice(0, 10);
    const presiding = presidingProbabilities(
      apostles.map((apostle) =>
        survivalProbability(mortality, apostle.birthDate, start, date)
      )
    );
    apostles.forEach((apostle, index) => {
      series[index].data.push({
        x,
        y: presiding.apostles[index],
        age: completedYears(apostle.birthDate, date),
      });
    });
    series[apostles.length].data.push({
      x,
      y: presiding.futureApostle,
      age: null,
    });
  }

  return series;
}
