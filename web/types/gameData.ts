export type Level = number;
export type Exp = number;
export type Percent = number;
export type DateString = string;

export interface LevelExpEntry {
  "필요경험치": Exp;
  "누적경험치": Exp;
}

export type LevelExpTable = Record<string, LevelExpEntry>;

export interface GrandisMapIndexRegion {
  file: string;
  count: number;
}

export interface GrandisMapIndex {
  note: string;
  regions: Record<string, GrandisMapIndexRegion>;
}

export interface HuntingMap {
  region: string;
  name: string;
  level: Level;
  monsterCount: number;
  monsters: string[];
  monsterExp: Exp;
  totalExp: Exp;
}

export interface HuntingMapFile {
  region: string;
  note: string;
  maps: HuntingMap[];
}

export interface LevelDiffMultiplierRule {
  range: string;
  multiplier: number | string;
  note: string | null;
}

export interface LevelDiffMultiplierTable {
  note: string;
  levelDiffMultiplier: LevelDiffMultiplierRule[];
}

export interface ExpDopingEntry {
  "구분": string;
  "항목": string;
  "효과(%)": string;
  "입력방식": string;
}

export type ExpDopingSummary = ExpDopingEntry[];

export interface DailyContent {
  "지역": string;
  "경험치": Exp;
  "레벨": string;
}

export type DailyContentTable = DailyContent[];

export type ExtremeMonsterParkBaseExpTable = Record<string, Exp>;

export type EpicDungeonRewardStep = "기본보상" | "1단계" | "2단계";

export interface EpicDungeon {
  "단계라벨": string[];
  "데이터": Record<string, Record<EpicDungeonRewardStep, Exp>>;
}

export type EpicDungeonTable = Record<string, EpicDungeon>;

export type LevelExpValueTable = Record<string, Exp>;

export type GrowthPotionTable = Record<string, LevelExpValueTable>;

export interface ExpCouponTable {
  "상급_EXP쿠폰_개당상승절대값": LevelExpValueTable;
  "EXP쿠폰_개당상승절대값": LevelExpValueTable;
}

export interface BerryTicketTable {
  "블루베리_260~299_상승절대값": LevelExpValueTable;
  "블루베리_290+_상승퍼센트": LevelExpValueTable;
  "메카베리_280~299_상승절대값": LevelExpValueTable;
}

export interface GameData {
  levelExpTable: LevelExpTable;
  hunting: {
    expDopingSummary: ExpDopingSummary;
    levelDiffMultiplier: LevelDiffMultiplierTable;
    grandisMapIndex: GrandisMapIndex;
    mapsByRegion: Record<string, HuntingMapFile>;
  };
  routine: {
    dailyQuest: DailyContentTable;
    monsterPark: DailyContentTable;
    epicDungeon: EpicDungeonTable;
    extremeMonsterParkBaseExp: ExtremeMonsterParkBaseExpTable;
  };
  items: {
    growthPotionDelta: GrowthPotionTable;
    expCoupon: ExpCouponTable;
    berryTicket: BerryTicketTable;
  };
}
