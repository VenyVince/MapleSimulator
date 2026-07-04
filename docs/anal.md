# 프로젝트 분석 정리

## 1. 현재 프로젝트 상태

이 프로젝트는 메이플 레벨 시뮬레이터 MVP를 목표로 하는 Nuxt + TypeScript 기반 웹 프로젝트다.

현재 구현은 실제 계산 로직보다 구조 설계와 데이터 준비가 먼저 진행된 상태다.

```text
web
├── app
│   └── app.vue
├── engine
│   ├── SimulationContext.ts
│   ├── SimulationEngine.ts
│   ├── DailySimulationService.ts
│   ├── ResultBuilder.ts
│   └── services
│       ├── ContentService.ts
│       ├── ExpService.ts
│       ├── HuntingService.ts
│       ├── ItemService.ts
│       └── LevelService.ts
└── types
    ├── gameData.ts
    ├── result.ts
    ├── routine.ts
    └── simulation.ts
```

```text
jsonData
├── level_exp_table.json
├── hunting
├── items
└── routine
```

## 2. 기술 스택 분석

현재 `web/package.json` 기준 프론트엔드 스택은 다음과 같다.

```text
- Nuxt 4
- Vue 3
- TypeScript
```

현재 `app.vue`는 Nuxt 기본 Welcome 화면만 렌더링하고 있다. 따라서 UI 구현은 아직 시작 전 단계로 보는 것이 맞다.

## 3. 문서 상태

### docs/plan.md

MVP 기획안 역할을 한다.

포함 내용:

- 프로젝트 목적
- MVP 범위
- V2 제외 범위
- 일간/주간 루틴 정책
- 이벤트 재화 정책
- 사냥 계산식
- 화면 구성 초안
- 개발 우선순위

다만 일부 경로가 현재 실제 폴더와 다르다.

```text
문서: jsonData/other/*
현재: jsonData/items/*
```

### docs/struct.md

최종 엔진 아키텍처 문서 역할을 한다.

현재 확정된 구조는 다음과 같다.

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

핵심 설계 원칙은 다음과 같다.

```text
SimulationEngine: 언제 하루를 실행할지만 안다.
DailySimulationService: 하루를 어떻게 진행할지만 안다.
Service: 자신의 계산만 한다.
SimulationContext: 현재 상태만 가진다.
```

## 4. 엔진 구조 분석

### SimulationEngine

현재 역할은 시뮬레이션 시작점으로 정의되어 있다.

담당해야 하는 일:

- `SimulationContext` 생성
- 날짜 반복
- `DailySimulationService` 호출
- `ResultBuilder` 호출
- 날짜 증가
- 종료 조건 확인

중요한 제약:

- 계산 로직을 가지면 안 된다.
- 개별 계산 서비스에 직접 깊게 의존하지 않는 것이 좋다.

### SimulationContext

현재 시뮬레이션 상태 저장소로 정의되어 있다.

보관해야 하는 상태:

- 현재 날짜
- 현재 레벨
- 현재 경험치
- 루틴 정보
- 게임 데이터 참조
- 누적 획득 경험치 등 기타 상태

중요한 제약:

- 비즈니스 로직을 가지면 안 된다.
- 상태 컨테이너 역할에 집중해야 한다.

### DailySimulationService

하루 시뮬레이션의 오케스트레이터다.

담당해야 하는 흐름:

```text
1. 오늘 실행할 루틴 확인
2. ContentService 호출
3. HuntingService 호출
4. ItemService 호출
5. ExpService 호출
6. LevelService 호출
7. SimulationContext 갱신
8. 하루 결과 반환
```

이 서비스는 계산을 직접 수행하면 안 되고, 호출 순서와 데이터 전달만 관리해야 한다.

### ExpService와 LevelService 관계

현재 설계에서 가장 중요한 경계다.

`ExpService`가 `LevelService`를 직접 호출하지 않는다.

```text
획득 경험치 계산
      ↓
ExpService.addExp(...)
      ↓
LevelService.apply(...)
```

이 흐름은 `DailySimulationService`가 조율한다.

장점:

- 경험치 계산과 레벨업 처리가 분리된다.
- 두 서비스 간 순환 의존 가능성이 줄어든다.
- 테스트 단위가 명확해진다.

## 5. 데이터 분석

현재 JSON 데이터는 MVP 계산에 필요한 주요 데이터가 대부분 준비되어 있다.

### 레벨 데이터

```text
jsonData/level_exp_table.json
```

레벨별 필요 경험치 계산의 기준 데이터다.

### 사냥 데이터

```text
jsonData/hunting/exp_doping_summary.json
jsonData/hunting/level_diff_multiplier.json
jsonData/hunting/map_monster/grandis/*.json
```

사냥 계산에 필요한 데이터가 분리되어 있다.

계산 요소:

- 몬스터 기본 경험치
- 캐릭터와 몬스터 레벨 차이 보정
- 도핑 경험치 증가율
- 사냥 시간
- 6분당 처치 수

### 컨텐츠 데이터

```text
jsonData/routine/daily/daily_quest.json
jsonData/routine/daily/monster_park.json
jsonData/routine/weekly/epic_dungeon.json
jsonData/routine/weekly/extreme_monster_park_base_exp.json
```

일간/주간 컨텐츠 데이터가 분리되어 있다.

일간:

- 몬스터파크
- 일일 퀘스트

주간:

- 에픽던전
- 익스트림 몬스터파크

### 아이템 데이터

```text
jsonData/items/growth_potion_delta.json
jsonData/items/exp_coupon.json
jsonData/items/berry_ticket.json
```

문서의 `other` 경로와 실제 `items` 경로가 다르므로 이후 문서나 코드에서 `items` 기준으로 통일하는 것이 좋다.

## 6. 타입 정의 상태

현재 `web/types` 파일들은 주석만 있는 상태다.

```text
gameData.ts
- LevelExpTable
- Monster
- Map
- DailyContent
- WeeklyContent
- GrowthPotion
- ExpCoupon
- BerryTicket

routine.ts
- DailyRoutine
- WeeklyRoutine
- HuntingRoutine
- ItemRoutine

simulation.ts
- SimulationInput
- SimulationOptions
- SimulationState
- SimulationContextState

result.ts
- SimulationDayResult
- SimulationResult
```

따라서 다음 구현 단계에서는 타입을 먼저 확정해야 한다.

타입이 먼저 정리되어야 하는 이유:

- JSON 데이터 파싱 기준이 생긴다.
- 서비스 입출력 계약이 명확해진다.
- `SimulationContext`의 상태 구조가 고정된다.
- UI 입력 모델과 엔진 입력 모델을 분리할 수 있다.

## 7. 현재 구현 공백

현재 engine 파일들은 책임 주석 중심이며 실제 로직은 아직 구현되지 않았다.

구현이 필요한 영역:

```text
1. TypeScript 타입 정의
2. JSON 데이터 로더 또는 import 방식 결정
3. SimulationContext 클래스/팩토리 구현
4. ExpService 구현
5. LevelService 구현
6. HuntingService 구현
7. ContentService 구현
8. ItemService 구현
9. DailySimulationService 구현
10. ResultBuilder 구현
11. SimulationEngine 구현
12. UI 입력/결과 화면 구현
```

## 8. 주요 리스크

### 1. JSON 스키마 미확정

JSON 파일은 준비되어 있지만 타입이 아직 정의되지 않았다.

리스크:

- 서비스 구현 중 필드명을 잘못 참조할 수 있다.
- 데이터 구조 변경 시 영향 범위를 추적하기 어렵다.

대응:

- `web/types/gameData.ts`를 먼저 구현한다.
- 대표 JSON 파일 1개씩을 기준으로 타입을 맞춘다.

### 2. 경험치 단위 혼재

입력은 퍼센트 또는 절대값을 받을 수 있고, 내부 계산은 절대값 기준이어야 한다.

리스크:

- 퍼센트와 절대값이 섞이면 레벨업 계산이 틀어질 수 있다.

대응:

- `SimulationContext.currentExp`는 절대값만 저장한다.
- 퍼센트 변환은 `ExpService`에서만 처리한다.

### 3. 레벨업 처리 위치

사냥, 컨텐츠, 아이템 각각에서 레벨업을 처리하면 결과가 달라질 수 있다.

리스크:

- 같은 날짜의 획득 경험치 합산 순서에 따라 레벨 결과가 달라진다.

대응:

- 하루 획득 경험치를 모두 합산한 뒤 한 번에 `LevelService`를 적용한다.
- 이 흐름은 `DailySimulationService`에서만 관리한다.

### 4. 주간 컨텐츠 초기화 정책

주간 컨텐츠는 목요일 초기화 정책이 있다.

리스크:

- 시작 날짜가 주 중간일 때 자동 추정 로직이 들어가면 사용자 의도와 다를 수 있다.

대응:

- 선택된 날짜의 주간 컨텐츠만 반영한다.
- 시작 주의 남은 횟수는 자동 추정하지 않는다.

### 5. V2 확장성

V2에서는 NestJS, 로그인, 캐릭터 저장, 루틴 저장이 예정되어 있다.

리스크:

- MVP에서 UI 상태와 엔진 상태가 강하게 결합되면 서버 이전이 어려워진다.

대응:

- 엔진은 순수 TypeScript 모듈처럼 유지한다.
- `SimulationInput`과 `SimulationResult`를 서버 API DTO로 재사용 가능한 형태로 설계한다.

## 9. 권장 구현 순서

현재 상태에서는 `docs/struct.md`의 구현 우선순위를 그대로 따르는 것이 적절하다.

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

세부적으로는 다음 순서를 추천한다.

```text
1. gameData 타입 작성
2. routine/result/simulation 타입 작성
3. ExpService 단위 테스트 가능한 형태로 구현
4. LevelService 단위 테스트 가능한 형태로 구현
5. HuntingService에서 JSON 기반 계산 구현
6. ContentService와 ItemService 구현
7. DailySimulationService에서 하루 흐름 결합
8. SimulationEngine에서 날짜 루프 구현
9. 최소 UI에서 입력과 결과 연결
```

## 10. 결론

현재 프로젝트는 데이터와 아키텍처 방향은 잡혀 있고, 실제 구현은 시작 직전 단계다.

가장 먼저 해결해야 할 것은 타입 정의다. 타입이 확정되면 `SimulationContext`, `ExpService`, `LevelService`를 안정적으로 구현할 수 있고, 이후 사냥/컨텐츠/아이템 계산 서비스를 병렬적으로 확장하기 쉬워진다.

특히 `ExpService`와 `LevelService`를 직접 연결하지 않고 `DailySimulationService`가 흐름을 조율하는 구조는 V2 서버 확장에도 적합하다.
