import type {
  DailyContent,
  Exp,
  EpicDungeon,
  GameData,
  Level,
  Percent,
} from "../../types/gameData";
import type {
  ContentRoutine,
  DailyRoutine,
  WeeklyRoutineSelection,
} from "../../types/routine";

// 역할: 일일/주간 컨텐츠 계산
/* 해야할 일
- 몬스터파크
- 일일퀘스트
- 익스트림 몬스터 파크
- 에픽 던전
 */
/*
- 컨텐츠 기반 경험치 계산

TYPES:
1. daily content
   - monster park
   - daily quest

2. weekly content
   - epic dungeon
   - extreme monster park

RULE:
- routine.json 기반 실행
- 컨텐츠 경험치만 계산하고 레벨업은 처리하지 않는다.

OUTPUT:
- 획득 경험치
 */

export interface ContentExpInput {
  currentLevel: Level;
  date: string;
  dailyRoutine?: DailyRoutine;
  weeklyRoutineSelections?: WeeklyRoutineSelection[];
}

export interface ContentExpBreakdown {
  dailyQuestExp: Exp;
  monsterParkExp: Exp;
  weeklyExp: Exp;
  totalExp: Exp;
}

export class ContentService {
  constructor(private readonly gameData: GameData) {}

  calculate(input: ContentExpInput): ContentExpBreakdown {
    const dailyQuestExp = this.calculateDailyContent(
      input.currentLevel,
      input.dailyRoutine?.dailyQuest,
      this.gameData.routine.dailyQuest,
    );
    const monsterParkExp = this.calculateDailyContent(
      input.currentLevel,
      input.dailyRoutine?.monsterPark,
      this.gameData.routine.monsterPark,
    );
    const weeklyExp = this.calculateWeeklyContent(
      input.currentLevel,
      input.date,
      input.weeklyRoutineSelections ?? [],
    );

    return {
      dailyQuestExp,
      monsterParkExp,
      weeklyExp,
      totalExp: dailyQuestExp + monsterParkExp + weeklyExp,
    };
  }

  calculateDailyContent(
    currentLevel: Level,
    routine: ContentRoutine | undefined,
    contentTable: DailyContent[],
  ): Exp {
    if (!routine?.enabled || routine.clearCount <= 0) {
      return 0;
    }

    const content = this.findDailyContent(
      contentTable,
      routine.contentId,
      currentLevel,
    );
    const eventBonusRate = routine.eventBonusRate ?? 0;

    return Math.floor(
      content["경험치"] * Math.max(0, routine.clearCount) * (1 + eventBonusRate / 100),
    );
  }

  calculateWeeklyContent(
    currentLevel: Level,
    date: string,
    selections: WeeklyRoutineSelection[],
  ): Exp {
    const selection = selections.find((item) => item.date === date);

    if (!selection) {
      return 0;
    }

    if (selection.type === "extremeMonsterPark") {
      return this.calculateExtremeMonsterPark(
        currentLevel,
        selection.contentId,
        selection.clearCount ?? 1,
        selection.eventBonusRate ?? 0,
      );
    }

    return this.calculateEpicDungeon(
      currentLevel,
      selection.contentId,
      selection.rewardStep,
      selection.eventBonusRate ?? 0,
    );
  }

  calculateEpicDungeon(
    currentLevel: Level,
    contentId: string,
    rewardStep: string | undefined,
    eventBonusRate: Percent,
  ): Exp {
    const dungeon = this.findEpicDungeon(contentId);
    const levelKey = this.findLevelKey(dungeon, currentLevel);
    const step = (rewardStep ?? "기본보상") as keyof EpicDungeon["데이터"][string];
    const exp = dungeon["데이터"][levelKey]?.[step];

    if (typeof exp !== "number") {
      throw new Error(
        `Missing epic dungeon exp data for ${contentId} at level ${currentLevel}.`,
      );
    }

    return Math.floor(exp * (1 + eventBonusRate / 100));
  }

  calculateExtremeMonsterPark(
    currentLevel: Level,
    contentId: string,
    clearCount: number,
    eventBonusRate: Percent,
  ): Exp {
    const baseExp = this.findExtremeMonsterParkBaseExp(contentId, currentLevel);

    return Math.floor(baseExp * Math.max(0, clearCount) * (1 + eventBonusRate / 100));
  }

  private findDailyContent(
    contentTable: DailyContent[],
    contentId: string,
    currentLevel: Level,
  ): DailyContent {
    const normalizedContentId = contentId.trim();
    const content = contentTable.find((item) => {
      const levelRange = this.parseLevelRange(item["레벨"]);

      return (
        item["지역"] === normalizedContentId &&
        currentLevel >= levelRange.min &&
        currentLevel <= levelRange.max
      );
    });

    if (!content) {
      throw new Error(`Missing daily content: ${contentId} for level ${currentLevel}.`);
    }

    return content;
  }

  private findEpicDungeon(contentId: string): EpicDungeon {
    const dungeon = this.gameData.routine.epicDungeon[contentId];

    if (!dungeon) {
      throw new Error(`Missing epic dungeon: ${contentId}.`);
    }

    return dungeon;
  }

  private findExtremeMonsterParkBaseExp(
    contentId: string,
    currentLevel: Level,
  ): Exp {
    const exp = this.gameData.routine.extremeMonsterParkBaseExp[contentId]?.[
      String(currentLevel)
    ];

    if (typeof exp !== "number") {
      throw new Error(
        `Missing extreme monster park exp data for ${contentId} at level ${currentLevel}.`,
      );
    }

    return exp;
  }

  private findLevelKey(dungeon: EpicDungeon, currentLevel: Level): string {
    const keys = Object.keys(dungeon["데이터"]);
    const exactMatch = keys.find((key) => Number(key) === currentLevel);

    if (exactMatch) {
      return exactMatch;
    }

    throw new Error(`Missing epic dungeon level data for level ${currentLevel}.`);
  }

  private parseLevelRange(value: string): { min: number; max: number } {
    const [minText, maxText] = value.split("~").map((part) => part.trim());
    const min = Number(minText);
    const max = Number(maxText);

    if (Number.isNaN(min) || Number.isNaN(max)) {
      throw new Error(`Invalid level range: ${value}.`);
    }

    return { min, max };
  }
}
