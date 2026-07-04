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
