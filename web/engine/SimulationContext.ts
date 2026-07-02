// 역할: 현재 게임 상태 저장소
/* 해야할 일
- 현재 레벨
- 현재 경험치
- 날짜
- 루틴
- 게임 데이터 참조
*/
/*- 시뮬레이션 상태 저장 객체
- 모든 Service가 공유하는 단일 상태

CONTAINS:
- currentLevel
- currentExp
- currentDate
- routine (daily/weekly)
- gameData (jsonData reference)

RULE:
- 로직 없음 (pure state container)
- Service만 상태 변경 가능
*/
