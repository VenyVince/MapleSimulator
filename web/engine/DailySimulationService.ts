// 역할: 하루 시뮬레이션 오케스트레이터
/*
해야 할 일
- 오늘 실행할 루틴 확인
- ContentService 호출
- HuntingService 호출
- ItemService 호출
- ExpService 호출
- LevelService 호출
- 하루 결과 반환
*/
/*
RULE:
- "하루를 어떻게 진행할지"만 안다.
- 계산은 하지 않고 실행 순서만 관리한다.
- ExpService와 LevelService는 서로 직접 의존하지 않는다.

FLOW:
1. 오늘 실행할 일간/주간/아이템 루틴 확인
2. ContentService로 컨텐츠 획득 경험치 계산
3. HuntingService로 사냥 획득 경험치 계산
4. ItemService로 아이템 획득 경험치 계산
5. ExpService.addExp(...)로 경험치 반영
6. LevelService.apply(...)로 레벨업 처리
7. SimulationContext 갱신 후 하루 결과 반환
*/
