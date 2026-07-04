import type { Exp, Level, LevelExpTable } from "../../types/gameData";
import type { BurningOption } from "../../types/simulation";

// 역할: 레벨업 처리
/*
해야할 일
- 레벨업 판단
- 필요 경험치 조회
- 경험치 이월
- 버닝 적용
*/
/*
- 레벨업 처리 전담

FLOW:
1. current exp >= required exp?
2. level +1
3. 남는 경험치 다음 레벨로 이월
4. 반복
5. 버닝 이벤트 적용 (multi level up)

DATA:
- level_exp_table.json

OUTPUT:
- 변경된 레벨
- 변경된 경험치
*/

export interface LevelApplyInput {
  level: Level;
  exp: Exp;
  burningOption?: BurningOption;
  maxLevel?: Level;
}

export interface LevelApplyResult {
  level: Level;
  exp: Exp;
  leveledUp: boolean;
  gainedLevels: number;
}

export class LevelService {
  constructor(private readonly levelExpTable: LevelExpTable) {}

  apply(input: LevelApplyInput): LevelApplyResult {
    const maxLevel = input.maxLevel ?? 300;
    let level = input.level;
    let exp = Math.max(0, input.exp);
    let gainedLevels = 0;

    while (level < maxLevel) {
      const requiredExp = this.getRequiredExp(level);

      if (exp < requiredExp) {
        break;
      }

      exp -= requiredExp;

      const levelIncrement = this.getLevelIncrement(
        level,
        input.burningOption ?? "none",
        maxLevel,
      );

      level += levelIncrement;
      gainedLevels += levelIncrement;
    }

    if (level >= maxLevel) {
      level = maxLevel;
      exp = 0;
    }

    return {
      level,
      exp,
      leveledUp: gainedLevels > 0,
      gainedLevels,
    };
  }

  canLevelUp(level: Level, exp: Exp, maxLevel: Level = 300): boolean {
    return level < maxLevel && exp >= this.getRequiredExp(level);
  }

  getRequiredExp(level: Level): Exp {
    const entry = this.levelExpTable[String(level)];

    if (!entry) {
      throw new Error(`Missing required exp data for level ${level}.`);
    }

    return entry["필요경험치"];
  }

  private getLevelIncrement(
    level: Level,
    burningOption: BurningOption,
    maxLevel: Level,
  ): number {
    const baseIncrement = this.getBurningIncrement(level, burningOption);

    return Math.min(baseIncrement, maxLevel - level);
  }

  private getBurningIncrement(
    level: Level,
    burningOption: BurningOption,
  ): number {
    if (burningOption === "none") {
      return 1;
    }

    if (burningOption === "hyperBurning") {
      return level < 260 ? 3 : 1;
    }

    if (burningOption === "teraBurning") {
      return level < 200 ? 3 : 1;
    }

    return level < 150 ? 3 : 1;
  }
}
