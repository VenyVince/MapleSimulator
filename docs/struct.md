
## 1. 실질 구현 설계

1. SimulationContext
- 현재 시뮬레이션의 상태를 모두 가짐
2. DailySimulationService
- 하루 루틴 처리 서비스(호출만 - 직접 계산 X - )
3. HuntingService
- 사냥 처리 서비스
- 입력: 사냥터, 현재 레벨 및 경험치, 시간, 도핑, 마릿수
- 출력: 사냥 경험치 합계
4. ContentService
- 컨텐츠 계산 전담(몬파, 일퀘, 익몬, 에픽던전)
5. ItemService
- 아이템 처리(성장의 비약, EXP쿠폰, 베리티켓)
6. ExpService
- 순수 경험치 계산(절대값 및 퍼센트 변환 및 현재 경험치 + 얻을 경험치)
7. LevelService
- 레벨업 처리 (버닝또한 여기서 처리(현재 경험치 확인 -> 필요 경험치 이상인지 확인 -> 레벨 증가 -> 남은 경험치 계산 -> 반복)
8. ResultBuilder
- 결과 생성(date, level, expPrecent, gainedExp)

## 2. 실행 흐름

``` text
SimulationEngine

→ Context 생성

→ while (date <= end)

    → DailySimulationService

        → ContentService
        → HuntingService
        → ItemService

    → LevelService

    → ResultBuilder

    → nextDay 
```

## 3. 구현 우선순위

1. ExpService
2. LevelService
3. HuntingService
4. ContentService
5. ItemService
6. DailySimulationService
7. ResultBuilder
8. SimulationContext