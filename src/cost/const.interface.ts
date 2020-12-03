export interface ParamsCost {
  from: string;
  to: string;
  time: number;
  plan: string;
}

export interface FinalCost {
  cost: number;
}

export interface ComparedCost {
  costWithPlan: string;
  costWithoutPlan: string;
}

export interface Tariff {
  from: string;
  to: string;
  cost: number;
}

export interface PlanMinutes {
  plan: string;
  minutes: number;
}
