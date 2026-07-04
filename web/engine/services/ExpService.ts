import type { Exp, Level, LevelExpTable, Percent } from "../../types/gameData";
import type { ExpInputType } from "../../types/simulation";

// 역할: 경험치 계산 전담
/*
해야 할 일
- 경험치 추가
- 퍼센트 ↔ 절대값 변환
- 경험치 정규화
*/
/*
- LevelService를 직접 호출하지 않는 경험치 계산 서비스

FUNCTIONS:
1. addExp(current, gained)
2. percentToExp(level, percent)
3. expToPercent(level, exp)
4. normalizeExpOverflow

RULE:
- 변경된 경험치를 반환한다.
- 레벨업 처리는 DailySimulationService가 LevelService를 호출해 처리한다.
*/

export interface NormalizedExp {
  exp: Exp;
  wasClamped: boolean;
  displayPercent?: Percent;
}

export class ExpService {
  constructor(private readonly levelExpTable: LevelExpTable) {}

  addExp(current: Exp, gained: Exp): Exp {
    return Math.max(0, current + gained);
  }

  percentToExp(level: Level, percent: Percent): Exp {
    const requiredExp = this.getRequiredExp(level);
    const normalizedPercent = Math.max(0, percent);

    return Math.floor(requiredExp * (normalizedPercent / 100));
  }

  expToPercent(level: Level, exp: Exp): Percent {
    const requiredExp = this.getRequiredExp(level);

    if (requiredExp <= 0) {
      return 0;
    }

    return (Math.max(0, exp) / requiredExp) * 100;
  }

  normalizeExpOverflow(
    level: Level,
    exp: Exp,
    displayInvalidInitialExpAs: Percent = 99.9,
  ): NormalizedExp {
    const requiredExp = this.getRequiredExp(level);
    const normalizedExp = Math.max(0, exp);

    if (normalizedExp >= requiredExp) {
      return {
        exp: Math.max(0, requiredExp - 1),
        wasClamped: true,
        displayPercent: displayInvalidInitialExpAs,
      };
    }

    return {
      exp: normalizedExp,
      wasClamped: false,
    };
  }

  normalizeInitialExp(
    level: Level,
    value: Exp | Percent,
    inputType: ExpInputType,
    displayInvalidInitialExpAs: Percent = 99.9,
  ): NormalizedExp {
    const absoluteExp =
      inputType === "percent" ? this.percentToExp(level, value) : value;

    return this.normalizeExpOverflow(
      level,
      absoluteExp,
      displayInvalidInitialExpAs,
    );
  }

  getRequiredExp(level: Level): Exp {
    const entry = this.levelExpTable[String(level)];

    if (!entry) {
      throw new Error(`Missing required exp data for level ${level}.`);
    }

    return entry["필요경험치"];
  }
}
