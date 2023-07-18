export interface ProphetPredictionType {
  candidates: CandidateType[];
  actuarialLifeTable: ActuarialLifeTableType;
  returnGraphData: () => graphDataType[];
}

export interface CandidateType {
  id: string;
  name: string;
  birthDate: Date;
  ageYears: number;
  ageDays: number;
  ordinationDate: Date;
  seniorApostles: string[];
  dailyLifeExpectancies: DailyRatesType;
  dailyProphetProbabilities: dailyProphetProbabilitiesType;
  calculateDailyLifeExpectancies: (actuarialLifeTable: DailyRatesType) => void;
}

export interface ActuarialLifeTableRawEntryType {
  probabilityDead: number;
}
export interface ActuarialLifeTableRawType {
  [key: number]: ActuarialLifeTableRawEntryType;
}

export interface DailyRatesType {
  [key: number]: DailyRateType;
}

export interface DailyRateType {
  probabilityDead: number;
  probabilityLiving: number;
}

export interface CandidateRawType {
  name: string;
  dob: string;
  ordinationDate: string;
}

export interface ActuarialLifeTableType {
  raw: ActuarialLifeTableRawType;
  dailyRates: DailyRatesType;
}

export interface dailyProphetProbabilitiesType {
  [key: number]: dailyProphetProbabilityType;
}

export interface dailyProphetProbabilityType {
  probabilityProphet: number;
}

export interface graphDataType {
  id: string;
  ordinationDate: Date;
  data: {
    x: string;
    y: number;
  }[];
}
