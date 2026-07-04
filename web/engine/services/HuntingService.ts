// 역할: 사냥 경험치 계산
/* 해야할 일
- 사냥터 입력 처리
- 몬스터 경험치 계산
- 레벨 차 보정 적용
- 도핑 적용
- 시간*마릿수 계산
*/
/*
- 사냥 경험치 계산 전담 서비스

INPUT:
- 사냥터
- 사냥 시간
- 마릿수
- 도핑
- 현재 레벨

PROCESS:
1. map_monster 데이터 로드
2. monster base exp 계산
3. level difference multiplier 적용
4. exp doping 적용 (합연산)
5. total exp = exp * killCount * time

OUTPUT:
- 획득 경험치
 */
