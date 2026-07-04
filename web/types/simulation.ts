import type { DateString, Exp, GameData, Level, Percent } from "./gameData";
import type {
  DailyRoutine,
  ItemUsage,
  WeeklyRoutineSelection,
} from "./routine";

export type ExpInputType = "percent" | "absolute";
export type BurningOption = "none" | "burning" | "teraBurning" | "hyperBurning";

export interface SimulationInput {
  startDate: DateString;
  endDate: DateString;
  initialLevel: Level;
  initialExp: Exp | Percent;
  initialExpInputType: ExpInputType;
  burningOption: BurningOption;
  dailyRoutine: DailyRoutine;
  weeklyRoutineSelections: WeeklyRoutineSelection[];
  itemUsageByDate: Record<DateString, ItemUsage[]>;
  gameData: GameData;
}

export interface SimulationOptions {
  maxLevel?: Level;
  clampInvalidInitialExp?: boolean;
  displayInvalidInitialExpAs?: Percent;
}

export interface SimulationContextState {
  currentDate: DateString;
  currentLevel: Level;
  currentExp: Exp;
  totalGainedExp: Exp;
  input: SimulationInput;
  options: Required<SimulationOptions>;
}

export interface DailySimulationGains {
  contentExp: Exp;
  huntingExp: Exp;
  itemExp: Exp;
  totalExp: Exp;
}

export interface DailySimulationResult {
  date: DateString;
  beforeLevel: Level;
  beforeExp: Exp;
  afterLevel: Level;
  afterExp: Exp;
  gains: DailySimulationGains;
}
