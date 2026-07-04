import type { DateString, Percent } from "./gameData";

export interface HuntingRoutine {
  enabled: boolean;
  mapRegion: string;
  mapName: string;
  huntingMinutes: number;
  killsPerSixMinutes?: number;
  dopingIds: string[];
  directDopingBonusRate?: Percent;
  burningFieldRate?: Percent;
}

export interface ContentRoutine {
  enabled: boolean;
  contentId: string;
  clearCount: number;
  eventBonusRate?: Percent;
}

export interface DailyRoutine {
  hunting?: HuntingRoutine;
  monsterPark?: ContentRoutine;
  dailyQuest?: ContentRoutine;
}

export type WeeklyRoutineType = "epicDungeon" | "extremeMonsterPark";

export interface WeeklyRoutineSelection {
  date: DateString;
  type: WeeklyRoutineType;
  contentId: string;
  clearCount?: number;
  eventBonusRate?: Percent;
  rewardStep?: string;
}

export type ItemUsageType =
  | "growthPotion"
  | "expCoupon"
  | "advancedExpCoupon"
  | "blueberryTicket"
  | "mechaBerryTicket"
  | "other";

export interface ItemUsage {
  date: DateString;
  itemType: ItemUsageType;
  itemId: string;
  count: number;
  expValue?: number;
  expPercent?: Percent;
}

export interface RoutinePlan {
  dailyRoutine: DailyRoutine;
  weeklyRoutineSelections: WeeklyRoutineSelection[];
  itemUsageByDate: Record<DateString, ItemUsage[]>;
}
