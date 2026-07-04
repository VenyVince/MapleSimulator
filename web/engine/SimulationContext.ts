import type { DateString, Exp, GameData, Level } from "../types/gameData";
import type {
  SimulationContextState,
  SimulationInput,
  SimulationOptions,
} from "../types/simulation";

// 역할: 현재 시뮬레이션 상태 저장소
/*
해야할 일
- 현재 레벨
- 현재 경험치
- 날짜
- 루틴
- 게임 데이터 참조
- 기타 시뮬레이션 상태
*/
/*
- 모든 Service가 공유하는 단일 상태

CONTAINS:
- currentLevel
- currentExp
- currentDate
- routine (daily/weekly)
- gameData (jsonData reference)

RULE:
- "현재 상태"만 가진다.
- 비즈니스 로직 없음
*/

const DEFAULT_OPTIONS: Required<SimulationOptions> = {
  maxLevel: 300,
  clampInvalidInitialExp: true,
  displayInvalidInitialExpAs: 99.9,
};

export class SimulationContext {
  private state: SimulationContextState;

  constructor(state: SimulationContextState) {
    this.state = state;
  }

  static create(
    input: SimulationInput,
    options: SimulationOptions = {},
    initialCurrentExp: Exp = Number(input.initialExp),
  ): SimulationContext {
    return new SimulationContext({
      currentDate: input.startDate,
      currentLevel: input.initialLevel,
      currentExp: initialCurrentExp,
      totalGainedExp: 0,
      input,
      options: {
        ...DEFAULT_OPTIONS,
        ...options,
      },
    });
  }

  get currentDate(): DateString {
    return this.state.currentDate;
  }

  set currentDate(value: DateString) {
    this.state.currentDate = value;
  }

  get currentLevel(): Level {
    return this.state.currentLevel;
  }

  set currentLevel(value: Level) {
    this.state.currentLevel = value;
  }

  get currentExp(): Exp {
    return this.state.currentExp;
  }

  set currentExp(value: Exp) {
    this.state.currentExp = value;
  }

  get totalGainedExp(): Exp {
    return this.state.totalGainedExp;
  }

  set totalGainedExp(value: Exp) {
    this.state.totalGainedExp = value;
  }

  get input(): SimulationInput {
    return this.state.input;
  }

  get options(): Required<SimulationOptions> {
    return this.state.options;
  }

  get gameData(): GameData {
    return this.state.input.gameData;
  }

  snapshot(): SimulationContextState {
    return {
      ...this.state,
      options: {
        ...this.state.options,
      },
    };
  }
}
