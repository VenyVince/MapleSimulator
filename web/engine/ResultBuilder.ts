import type { SimulationDayResult } from "../types/result";
import type { DailySimulationResult } from "../types/simulation";
import { SimulationContext } from "./SimulationContext";
import { ExpService } from "./services/ExpService";

// 역할: 결과 데이터 생성
/*
해야 할 일
- UI에 표시할 결과 생성
- 날짜 기록
- 레벨 기록
- 현재 경험치 기록
- 경험치 퍼센트 기록
- 획득 경험치 기록
*/
/*
- 시뮬레이션 결과 생성기

OUTPUT:
{
  date,
  level,
  currentExp,
  requiredExp,
  expPercent,
  gainedExp,
  totalGainedExp
}

RULE:
- SimulationContext를 UI용 데이터 포맷으로 변환
- UI용 데이터 포맷 변환
*/

export class ResultBuilder {
  constructor(private readonly expService: ExpService) {}

  buildDay(
    context: SimulationContext,
    dailyResult: DailySimulationResult,
  ): SimulationDayResult {
    const level = context.currentLevel;
    const currentExp = context.currentExp;

    return {
      date: dailyResult.date,
      level,
      currentExp,
      requiredExp: this.expService.getRequiredExp(level),
      expPercent: this.expService.expToPercent(level, currentExp),
      gainedExp: dailyResult.gains.totalExp,
      totalGainedExp: context.totalGainedExp,
    };
  }
}
