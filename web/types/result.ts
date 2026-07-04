import type { DateString, Exp, Level, Percent } from "./gameData";

export interface SimulationDayResult {
  date: DateString;
  level: Level;
  currentExp: Exp;
  requiredExp: Exp;
  expPercent: Percent;
  gainedExp: Exp;
  totalGainedExp: Exp;
}

export interface SimulationResult {
  startDate: DateString;
  endDate: DateString;
  initialLevel: Level;
  finalLevel: Level;
  finalExp: Exp;
  finalExpPercent: Percent;
  totalGainedExp: Exp;
  days: SimulationDayResult[];
}
