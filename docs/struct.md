# Simulation Engine 구조

## 1. 최종 아키텍처

```text
SimulationEngine
        │
        ▼
DailySimulationService
        │
        ├── HuntingService
        ├── ContentService
        ├── ItemService
        ├── ExpService
        ├── LevelService
        └── ResultBuilder
                │
                ▼
        SimulationContext
```

## 2. 핵심 원칙

### SimulationEngine

- "언제 하루를 실행할지"만 안다.
- 시뮬레이션 시작점이다.
- 날짜 반복과 종료 조건 확인을 담당한다.
- 계산은 하지 않는다.

### DailySimulationService

- "하루를 어떻게 진행할지"만 안다.
- 하루 시뮬레이션의 오케스트레이터다.
- 각 서비스 호출 순서만 관리한다.
- 계산은 하지 않는다.

### Service

- "자신의 계산"만 한다.
- 다른 서비스의 흐름을 직접 조율하지 않는다.

### SimulationContext

- "현재 상태"만 가진다.
- 상태 저장소이며 비즈니스 로직을 가지지 않는다.

## 3. 클래스별 역할

### SimulationEngine

역할:

- 시뮬레이션 시작점
- 날짜 반복
- 종료 조건 확인

책임:

```text
1. SimulationContext 생성
2. DailySimulationService 호출
3. ResultBuilder 호출
4. 날짜 증가
5. 종료 조건 확인
```

### SimulationContext

역할:

- 현재 시뮬레이션 상태 저장

책임:

```text
- 현재 날짜
- 현재 레벨
- 현재 경험치
- 루틴 정보
- 게임 데이터(JSON)
- 기타 시뮬레이션 상태
```

### DailySimulationService

역할:

- 하루 시뮬레이션의 오케스트레이터

책임:

```text
1. 오늘 실행할 루틴 확인
2. ContentService 호출
3. HuntingService 호출
4. ItemService 호출
5. ExpService 호출
6. LevelService 호출
7. 하루 결과 반환
```

### HuntingService

역할:

- 사냥 경험치 계산

입력:

```text
- 사냥터
- 사냥 시간
- 마릿수
- 도핑
- 현재 레벨
```

출력:

```text
획득 경험치
```

### ContentService

역할:

- 컨텐츠 경험치 계산

대상:

```text
일간
- 몬스터파크
- 일일퀘스트

주간
- 에픽던전
- 익스트림 몬스터파크
```

출력:

```text
획득 경험치
```

### ItemService

역할:

- 이벤트 재화 처리

대상:

```text
- 성장의 비약
- 상급 EXP 쿠폰
- 베리 티켓
- 기타
```

출력:

```text
획득 경험치
```

### ExpService

역할:

- 경험치 계산 전담

책임:

```text
- 경험치 추가
- 퍼센트 ↔ 절대값 변환
- 경험치 정규화
```

출력:

```text
변경된 경험치
```

### LevelService

역할:

- 레벨업 처리

책임:

```text
- 레벨업 여부 확인
- 경험치 이월
- 버닝 이벤트 적용
```

출력:

```text
변경된 레벨
변경된 경험치
```

### ResultBuilder

역할:

- UI에 표시할 결과 생성

책임:

```text
- 날짜
- 레벨
- 경험치
- 경험치 %
- 획득 경험치
```

## 4. 전체 실행 흐름

```text
SimulationEngine
      │
      ▼
while(종료조건)
      │
      ▼
DailySimulationService
      │
      ├──────────────┐
      ▼              ▼
ContentService   HuntingService
      │              │
      └──────┬───────┘
             ▼
        ItemService
             ▼
        ExpService
             ▼
       LevelService
             ▼
     SimulationContext 갱신
             ▼
      ResultBuilder
             ▼
      다음 날짜
```

## 5. ExpService와 LevelService 관계

`ExpService`는 `LevelService`를 직접 호출하지 않는다.

```text
ContentService / HuntingService / ItemService
      ↓
ExpService.addExp(...)
      ↓
LevelService.apply(...)
```

두 서비스는 서로 의존하지 않고, `DailySimulationService`가 호출 순서를 조율한다.

## 6. 입력 모델

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

## 7. 날짜 및 반복 정책

- 시뮬레이션은 시작 날짜부터 종료 날짜까지 하루 단위로 계산한다.
- 일간 루틴은 매일 반복한다.
- 주간 컨텐츠 횟수는 매주 목요일에 초기화된다.
- 주간 컨텐츠는 사용자가 선택한 날짜에만 반영한다.
- 시작 주의 주간 컨텐츠 수행 여부는 자동 추정하지 않는다.
- 아이템은 사용자가 선택한 날짜에만 반영한다.

## 8. jsonData 구조

```text
jsonData
├── level_exp_table.json
├── hunting
│   ├── exp_doping_summary.json
│   ├── level_diff_multiplier.json
│   └── map_monster
│       └── grandis
│           ├── _grandis_maps_index.json
│           ├── grandis_maps_arteria.json
│           ├── grandis_maps_cernium_1.json
│           ├── grandis_maps_cernium_2.json
│           ├── grandis_maps_dowonkyung.json
│           ├── grandis_maps_geardrak.json
│           ├── grandis_maps_hotel_arcus.json
│           ├── grandis_maps_odium.json
│           └── grandis_maps_talahart.json
├── routine
│   ├── daily
│   │   ├── daily_quest.json
│   │   └── monster_park.json
│   └── weekly
│       ├── epic_dungeon.json
│       └── extreme_monster_park_base_exp.json
└── items
    ├── berry_ticket.json
    ├── exp_coupon.json
    └── growth_potion_delta.json
```

## 9. 구현 우선순위

```text
1. types
2. SimulationContext
3. ExpService
4. LevelService
5. HuntingService
6. ContentService
7. ItemService
8. DailySimulationService
9. ResultBuilder
10. SimulationEngine
```

## 10. 검증 및 테스트 기준

### ExpService

- 퍼센트 입력을 절대 경험치로 변환한다.
- 절대 경험치를 퍼센트로 변환한다.
- 경험치를 더한다.
- 경험치를 정규화한다.
- LevelService를 직접 호출하지 않는다.

### LevelService

- 획득 경험치가 필요 경험치보다 작으면 레벨이 유지된다.
- 획득 경험치가 필요 경험치와 같으면 레벨업하고 잔여 경험치는 0이 된다.
- 획득 경험치가 필요 경험치를 초과하면 레벨업 후 잔여 경험치를 다음 레벨로 이월한다.
- 여러 번 레벨업 가능한 경험치를 받으면 반복 처리한다.
- 버닝 레벨업 시 최종 표시 레벨에 잔여 경험치를 이월한다.

### HuntingService

- 몬스터 기본 경험치, 레벨 차이 보정, 도핑, 6분당 처치 수, 사냥 시간이 모두 반영된다.
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
- 아이템 경험치는 획득 경험치로 반환하고 레벨업은 처리하지 않는다.

### DailySimulationService

- 오늘 실행할 루틴을 확인한다.
- ContentService, HuntingService, ItemService를 호출해 획득 경험치를 모은다.
- ExpService 호출 후 LevelService를 호출한다.
- 계산은 각 서비스에 위임하고 실행 순서만 관리한다.

### SimulationEngine

- 시작 날짜부터 종료 날짜까지 결과가 하루 단위로 생성된다.
- 같은 입력은 항상 같은 결과를 반환한다.
- 누적 획득 경험치가 날짜별 획득 경험치 합계와 일치한다.
- 사냥, 컨텐츠, 아이템이 같은 날짜에 있을 때 모두 합산 후 레벨업 처리된다.
