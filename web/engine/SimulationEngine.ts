// 역할 : 시뮬레이션 전체 흐름 제어
/* 해야할 일
 - SimulationContext 생성
 - 날짜 루프 실행(while)
 - DailySimulationSerivce 호출
 - 결과 수집
 - 종료 조건 판단(날짜)
 */
/* 
- 시뮬레이션 전체 실행 엔진
- 하루 단위로 루프 실행
- 각 Service는 직접 호출하지 않고 DailySimulationService 통해 실행

FLOW:
1. context 생성
2. while (날짜 <= 종료일)
3. DailySimulationService.run(context)
4. LevelService 적용 결과 반영
5. ResultBuilder로 결과 저장
6. date +1
 */
