
## 1. 실질 구현 설계

1. SimulationContext
- 현재 시뮬레이션의 상태를 모두 가짐
- 현재 날짜, 현재 레벨, 현재 절대 경험치, 누적 획득 경험치, 일간/주간 루틴, 날짜별 아이템 사용 계획을 가진다.
- 경험치는 퍼센트가 아니라 절대값을 기준으로 보관한다.
2. DailySimulationService
- 하루 루틴 처리 서비스(호출만 - 직접 계산 X - )
- 현재 날짜에 실행할 일간 루틴, 선택된 주간 루틴, 선택된 아이템 사용 계획을 각 서비스에 위임한다.
3. HuntingService
- 사냥 처리 서비스
- 입력: 사냥터, 현재 레벨 및 경험치, 시간, 도핑, 마릿수
- 출력: 사냥 경험치 합계
- 사냥 루틴은 단일 사냥터만 지원한다.
- 사냥 루틴은 매일 반복한다.
- 도핑은 사냥 루틴에만 포함되며 사냥 경험치에만 적용한다.
4. ContentService
- 컨텐츠 계산 전담(몬파, 일퀘, 익몬, 에픽던전)
- 몬스터파크, 일일 퀘스트, 익스트림 몬스터파크, 에픽던전을 처리한다.
- 각 컨텐츠는 기본 경험치에 비례한 이벤트 추가 경험치 입력값을 받을 수 있다.
- 주간 컨텐츠는 사용자가 선택한 날짜에만 계산한다.
5. ItemService
- 아이템 처리(성장의 비약, EXP쿠폰, 베리티켓)
- 아이템은 사용자가 설정한 날짜에만 계산한다.
- 성장의 비약은 `jsonData/other/growth_potion_delta.json`의 현재 레벨 기준 경험치 획득량을 사용한다.
6. ExpService
- 순수 경험치 계산(절대값 및 퍼센트 변환 및 현재 경험치 + 얻을 경험치)
- 경험치 100% 초과 입력은 잘못된 입력으로 처리하고, 내부값은 해당 레벨 필요 경험치 - 1로 보정한다.
- 경험치 100% 초과 입력의 화면 표기는 99.9%로 처리한다.
7. LevelService
- 레벨업 처리 (버닝또한 여기서 처리(현재 경험치 확인 -> 필요 경험치 이상인지 확인 -> 레벨 증가 -> 남은 경험치 계산 -> 반복)
- 레벨업 후 남는 경험치는 다음 레벨로 이월한다.
- 버닝으로 여러 레벨업이 발생해도 잔여 경험치는 최종 레벨로 이월한다.
- 사냥, 컨텐츠, 아이템으로 얻은 경험치는 모두 레벨업 이전 절대 경험치에 더한 뒤 레벨업을 처리한다.
8. ResultBuilder
- 결과 생성(date, level, expPrecent, gainedExp)
- 결과 생성(date, level, expPercent, currentExp, requiredExp, gainedExp, totalGainedExp)

## 2. 입력 모델

```text
SimulationInput
- startDate
- endDate
- initialLevel
- initialExp
- initialExpInputType(percent | absolute)
- burningOption
- dailyRoutine
- weeklyRoutineSelections
- itemUsageByDate

DailyRoutine
- hunting
- monsterPark
- dailyQuest

HuntingRoutine
- enabled
- mapId
- huntingMinutes
- killsPerSixMinutes
- dopingIds
- burningFieldRate

ContentRoutine
- enabled
- contentId
- clearCount
- eventBonusRate

WeeklyRoutineSelection
- date
- type(epicDungeon | extremeMonsterPark)
- contentId
- eventBonusRate

ItemUsage
- date
- itemType(growthPotion | expCoupon | berryTicket | other)
- itemId
- count
```

## 3. 날짜 및 반복 정책

- 시뮬레이션은 시작 날짜부터 종료 날짜까지 하루 단위로 계산한다.
- 일간 루틴은 매일 반복한다.
- 주간 컨텐츠 횟수는 매주 목요일에 초기화된다.
- 주간 컨텐츠는 사용자가 선택한 날짜에만 반영한다.
- 시작 주의 주간 컨텐츠 수행 여부는 자동 추정하지 않는다.
- 아이템은 사용자가 선택한 날짜에만 반영한다.

## 4. 실행 흐름

``` text
SimulationEngine

→ Context 생성

→ while (date <= end)

    → DailySimulationService

        → HuntingService
        → ContentService
        → ItemService

    → LevelService

    → ResultBuilder

    → nextDay 
```

## 5. jsonData 구조

```text
jsonData
├── level_exp_table.json
├── hunting
│   ├── exp_doping_summary.json
│   ├── level_diff_multiplier.json
│   └── map_monster
│       ├── grindas_maps_index.json
│       ├── grindas_maps_arteria.json
│       ├── grindas_maps_cernium_1.json
│       ├── grindas_maps_cernium_2.json
│       ├── grindas_maps_dowonkyung.json
│       ├── grindas_maps_geardrak.json
│       ├── grindas_maps_hotel_arcus.json
│       ├── grindas_maps_odium.json
│       └── grindas_maps_talahart.json
├── routine
│   ├── daily
│   │   ├── daily_quest.json
│   │   └── monster_park.json
│   └── weekly
│       ├── epic_dungeon.json
│       └── extreme_monster_park_base_exp.json
└── other
    ├── berry_ticket.json
    ├── exp_coupon.json
    └── growth_potion_delta.json
```

## 6. 구현 순서
```text
1. web/types
   ├── gameData.ts
   ├── routine.ts
   ├── simulation.ts
   └── result.ts

2. jsonData
   ├── level_exp_table.json
   ├── hunting/*
   ├── routine/*
   └── other/*

3. web/engine/services
   ├── ExpService.ts
   ├── LevelService.ts
   ├── HuntingService.ts
   ├── ContentService.ts
   └── ItemService.ts

4. web/engine/SimulationContext.ts

5. web/engine/DailySimulationService.ts

6. web/engine/ResultBuilder.ts

7. web/engine/SimulationEngine.ts
```

## 7. 검증 및 테스트 기준

### ExpService

- 퍼센트 입력을 절대 경험치로 변환한다.
- 절대 경험치를 퍼센트로 변환한다.
- 100% 초과 입력 시 해당 레벨 필요 경험치 - 1로 보정한다.
- 100% 초과 입력 시 표시 퍼센트는 99.9%로 반환한다.

### LevelService

- 획득 경험치가 필요 경험치보다 작으면 레벨이 유지된다.
- 획득 경험치가 필요 경험치와 같으면 레벨업하고 잔여 경험치는 0이 된다.
- 획득 경험치가 필요 경험치를 초과하면 레벨업 후 잔여 경험치를 다음 레벨로 이월한다.
- 여러 번 레벨업 가능한 경험치를 받으면 반복 처리한다.
- 버닝 레벨업 시 최종 표시 레벨에 잔여 경험치를 이월한다.

### HuntingService

- 몬스터 기본 경험치, 레벨 차이 보정, 도핑 합연산, 6분당 처치 수, 사냥 시간이 모두 반영된다.
- 도핑은 사냥 경험치에만 적용된다.
- 사용자가 처치 수를 수정하면 기본 최대 마릿수 대신 수정값을 사용한다.

### ContentService

- 일간 컨텐츠는 매일 반영된다.
- 주간 컨텐츠는 선택된 날짜에만 반영된다.
- 주간 초기화 기준은 목요일이다.
- 이벤트 추가 경험치 비율이 기본 경험치에 비례해 반영된다.

### ItemService

- 아이템은 선택된 날짜에만 반영된다.
- 성장의 비약은 현재 레벨 기준 `growth_potion_delta.json` 값을 사용한다.
- 아이템 경험치로 레벨업하는 경우 잔여 경험치를 이월한다.

### SimulationEngine

- 시작 날짜부터 종료 날짜까지 결과가 하루 단위로 생성된다.
- 같은 입력은 항상 같은 결과를 반환한다.
- 누적 획득 경험치가 날짜별 획득 경험치 합계와 일치한다.
- 사냥, 컨텐츠, 아이템이 같은 날짜에 있을 때 모두 합산 후 레벨업 처리된다.
