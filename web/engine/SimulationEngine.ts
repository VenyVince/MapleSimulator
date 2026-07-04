import type { DateString, Exp } from "../types/gameData";
import type { SimulationResult } from "../types/result";
import type { SimulationInput, SimulationOptions } from "../types/simulation";
import { DailySimulationService } from "./DailySimulationService";
import { ResultBuilder } from "./ResultBuilder";
import { SimulationContext } from "./SimulationContext";
import { ContentService } from "./services/ContentService";
import { ExpService } from "./services/ExpService";
import { HuntingService } from "./services/HuntingService";
import { ItemService } from "./services/ItemService";
import { LevelService } from "./services/LevelService";

// 역할: 시뮬레이션 시작점
/*
해야 할 일
- SimulationContext 생성
- 날짜 루프 실행
- DailySimulationService 호출
- ResultBuilder 호출
- 날짜 증가
- 종료 조건 확인
*/
/*
RULE:
- "언제 하루를 실행할지"만 안다.
- 계산은 하지 않는다.
- 하루 진행 방식은 DailySimulationService에 위임한다.

FLOW:
1. context 생성
2. while (종료 조건 전까지)
3. DailySimulationService.run(context)
4. ResultBuilder로 UI 결과 생성
5. date +1
*/

export class SimulationEngine {
  run(input: SimulationInput, options: SimulationOptions = {}): SimulationResult {
    this.assertValidDateRange(input.startDate, input.endDate);

    const expService = new ExpService(input.gameData.levelExpTable);
    const levelService = new LevelService(input.gameData.levelExpTable);
    const contentService = new ContentService(input.gameData);
    const huntingService = new HuntingService(input.gameData);
    const itemService = new ItemService(input.gameData, expService);
    const dailySimulationService = new DailySimulationService(
      contentService,
      huntingService,
      itemService,
      expService,
      levelService,
    );
    const resultBuilder = new ResultBuilder(expService);
    const initialCurrentExp = this.resolveInitialExp(input, options, expService);
    const context = SimulationContext.create(input, options, initialCurrentExp);
    const days = [];

    while (this.compareDate(context.currentDate, input.endDate) <= 0) {
      const dailyResult = dailySimulationService.run(context);
      days.push(resultBuilder.buildDay(context, dailyResult));
      context.currentDate = this.addDays(context.currentDate, 1);
    }

    return {
      startDate: input.startDate,
      endDate: input.endDate,
      initialLevel: input.initialLevel,
      finalLevel: context.currentLevel,
      finalExp: context.currentExp,
      finalExpPercent: expService.expToPercent(
        context.currentLevel,
        context.currentExp,
      ),
      totalGainedExp: context.totalGainedExp,
      days,
    };
  }

  private resolveInitialExp(
    input: SimulationInput,
    options: SimulationOptions,
    expService: ExpService,
  ): Exp {
    const displayInvalidInitialExpAs =
      options.displayInvalidInitialExpAs ?? 99.9;

    if (options.clampInvalidInitialExp === false) {
      return input.initialExpInputType === "percent"
        ? expService.percentToExp(input.initialLevel, input.initialExp)
        : input.initialExp;
    }

    return expService.normalizeInitialExp(
      input.initialLevel,
      input.initialExp,
      input.initialExpInputType,
      displayInvalidInitialExpAs,
    ).exp;
  }

  private assertValidDateRange(startDate: DateString, endDate: DateString): void {
    if (this.compareDate(startDate, endDate) > 0) {
      throw new Error(`Invalid simulation date range: ${startDate} > ${endDate}.`);
    }
  }

  private compareDate(left: DateString, right: DateString): number {
    return this.parseDate(left).getTime() - this.parseDate(right).getTime();
  }

  private addDays(date: DateString, days: number): DateString {
    const parsed = this.parseDate(date);
    parsed.setUTCDate(parsed.getUTCDate() + days);

    return parsed.toISOString().slice(0, 10);
  }

  private parseDate(date: DateString): Date {
    const parsed = new Date(`${date}T00:00:00.000Z`);

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid date: ${date}.`);
    }

    return parsed;
  }
}
