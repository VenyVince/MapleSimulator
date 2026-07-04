import type { Exp, GameData, HuntingMap, Level } from "../../types/gameData";
import type { HuntingRoutine } from "../../types/routine";

// 역할: 사냥 경험치 계산
/* 해야할 일
- 사냥터 입력 처리
- 몬스터 경험치 계산
- 레벨 차 보정 적용
- 도핑 적용
- 시간*마릿수 계산
*/
/*
- 사냥 경험치 계산 전담 서비스

INPUT:
- 사냥터
- 사냥 시간
- 마릿수
- 도핑
- 현재 레벨

PROCESS:
1. map_monster 데이터 로드
2. monster base exp 계산
3. level difference multiplier 적용
4. exp doping 적용 (합연산)
5. total exp = exp * killCount * time

OUTPUT:
- 획득 경험치
 */

export interface HuntingExpInput {
  currentLevel: Level;
  routine?: HuntingRoutine;
}

export class HuntingService {
  constructor(private readonly gameData: GameData) {}

  calculate(input: HuntingExpInput): Exp {
    const routine = input.routine;

    if (!routine?.enabled) {
      return 0;
    }

    const huntingMap = this.findMap(routine.mapRegion, routine.mapName);
    const killsPerSixMinutes =
      routine.killsPerSixMinutes ?? huntingMap.monsterCount;
    const huntingUnits = Math.max(0, routine.huntingMinutes) / 6;
    const levelMultiplier = this.getLevelDiffMultiplier(
      input.currentLevel,
      huntingMap.level,
    );
    const bonusMultiplier = 1 + this.getBonusRate(routine) / 100;

    return Math.floor(
      huntingMap.monsterExp *
        levelMultiplier *
        bonusMultiplier *
        Math.max(0, killsPerSixMinutes) *
        huntingUnits,
    );
  }

  findMap(mapRegion: string, mapName: string): HuntingMap {
    const mapFile = this.gameData.hunting.mapsByRegion[mapRegion];

    if (!mapFile) {
      throw new Error(`Missing hunting map region: ${mapRegion}.`);
    }

    const huntingMap = mapFile.maps.find((map) => map.name === mapName);

    if (!huntingMap) {
      throw new Error(`Missing hunting map: ${mapRegion}/${mapName}.`);
    }

    return huntingMap;
  }

  getLevelDiffMultiplier(characterLevel: Level, monsterLevel: Level): number {
    const diff = characterLevel - monsterLevel;

    if (diff >= 40) {
      return 0.7;
    }

    if (diff >= 21) {
      return 0.7 + (40 - diff) * 0.01;
    }

    if (diff >= 19) {
      return 0.95;
    }

    if (diff >= 17) {
      return 0.96;
    }

    if (diff >= 15) {
      return 0.97;
    }

    if (diff >= 13) {
      return 0.98;
    }

    if (diff >= 11) {
      return 0.99;
    }

    if (diff === 10) {
      return 1;
    }

    if (diff >= 5) {
      return 1.05;
    }

    if (diff >= 2) {
      return 1.1;
    }

    if (diff >= -1) {
      return 1.2;
    }

    if (diff >= -4) {
      return 1.1;
    }

    if (diff >= -9) {
      return 1.05;
    }

    if (diff >= -20) {
      return 1 - Math.abs(diff + 10) * 0.01;
    }

    if (diff >= -35) {
      return 0.7 - Math.abs(diff + 21) * 0.04;
    }

    return 0.1;
  }

  private getBonusRate(routine: HuntingRoutine): number {
    return (
      this.sumNumericDopingRates(routine.dopingIds) +
      (routine.directDopingBonusRate ?? 0) +
      (routine.burningFieldRate ?? 0)
    );
  }

  private sumNumericDopingRates(dopingIds: string[]): number {
    return dopingIds.reduce((total, dopingId) => {
      const numericRate = Number(dopingId);

      return Number.isFinite(numericRate) ? total + numericRate : total;
    }, 0);
  }
}
