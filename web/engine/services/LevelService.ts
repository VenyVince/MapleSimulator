// 역할: 레벨업 처리
/*
해야할 일
- 레벨업 판단
- 필요 경험치 조회
- 경험치 이월
- 버닝 적용
*/
/*
- 레벨업 처리 전담

FLOW:
1. current exp >= required exp?
2. level +1
3. 남는 경험치 다음 레벨로 이월
4. 반복
5. 버닝 이벤트 적용 (multi level up)

DATA:
- level_exp_table.json

OUTPUT:
- 변경된 레벨
- 변경된 경험치
*/
