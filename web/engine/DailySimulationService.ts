// 역할: 하루 실행 오케스트레이션
/* 해야할 일
- 오늘이 주간 초기화일인지 체크
- 일일 루틴 실행
- 주간 루틴 실행
- 각 Service 호출 순서 관리
*/
/*
- 하루 단위 실행 컨트롤러
FLOW:
1. weekly reset 체크 (목요일)
2. ContentService (daily)
3. HuntingService 실행
4. ItemService 적용
5. ContentService (weekly if applicable)
6. 총 exp 반환 */
