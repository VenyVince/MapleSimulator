<template>
  <main class="app-shell">
    <NuxtRouteAnnouncer />

    <section class="hero-section" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">Maple Level Simulator</p>
        <h1 id="page-title">레벨 성장 계획을 한 화면에서 정리하세요.</h1>
        <p class="hero-description">
          시작 레벨, 일일 루틴, 주간 컨텐츠, 이벤트 아이템을 조합해 목표 기간의
          성장 흐름을 계산하는 시뮬레이터입니다.
        </p>
      </div>

      <div class="summary-panel" aria-label="Simulation summary preview">
        <div>
          <span class="metric-label">예상 최종 레벨</span>
          <strong>Lv. 272</strong>
        </div>
        <div>
          <span class="metric-label">누적 경험치</span>
          <strong>18.4T</strong>
        </div>
        <div>
          <span class="metric-label">기간</span>
          <strong>30일</strong>
        </div>
      </div>
    </section>

    <section class="workspace" aria-label="Simulator workspace">
      <form class="control-panel">
        <div class="panel-header">
          <p class="eyebrow">Inputs</p>
          <h2>시뮬레이션 조건</h2>
        </div>

        <fieldset class="input-group">
          <legend>캐릭터</legend>
          <label>
            시작 레벨
            <input type="number" value="260" min="1" max="300" />
          </label>
          <label>
            현재 경험치
            <div class="inline-input">
              <input type="number" value="12.5" min="0" max="100" />
              <span>%</span>
            </div>
          </label>
          <label>
            시작 날짜
            <input type="date" value="2026-07-04" />
          </label>
          <label>
            종료 날짜
            <input type="date" value="2026-08-03" />
          </label>
        </fieldset>

        <fieldset class="input-group">
          <legend>일간 루틴</legend>
          <label class="toggle-row">
            <span>일일 퀘스트</span>
            <input type="checkbox" checked />
          </label>
          <label class="toggle-row">
            <span>몬스터 파크</span>
            <input type="checkbox" checked />
          </label>
          <label>
            사냥 시간
            <div class="inline-input">
              <input type="number" value="60" min="0" />
              <span>분</span>
            </div>
          </label>
          <label>
            사냥터
            <select>
              <option>도원경 - 봄의 들판</option>
              <option>아르테리아 - 최하층 통로</option>
              <option>카르시온 - 휘감기는 숲</option>
            </select>
          </label>
        </fieldset>

        <fieldset class="input-group">
          <legend>주간 및 아이템</legend>
          <label class="toggle-row">
            <span>익스트림 몬스터 파크</span>
            <input type="checkbox" />
          </label>
          <label class="toggle-row">
            <span>에픽 던전</span>
            <input type="checkbox" />
          </label>
          <label>
            이벤트 아이템
            <select>
              <option>성장의 비약</option>
              <option>EXP 쿠폰</option>
              <option>블루베리 티켓</option>
            </select>
          </label>
        </fieldset>

        <button type="button" class="primary-action">시뮬레이션 준비</button>
      </form>

      <section class="results-panel" aria-label="Simulation results preview">
        <div class="panel-header">
          <p class="eyebrow">Results</p>
          <h2>결과 미리보기</h2>
        </div>

        <div class="progress-card">
          <div class="progress-copy">
            <span>현재 목표 진행률</span>
            <strong>68.2%</strong>
          </div>
          <div class="progress-track" aria-hidden="true">
            <span></span>
          </div>
        </div>

        <div class="result-grid">
          <article>
            <span>오늘 획득</span>
            <strong>642.1B</strong>
          </article>
          <article>
            <span>레벨 상승</span>
            <strong>+3</strong>
          </article>
          <article>
            <span>남은 경험치</span>
            <strong>31.8%</strong>
          </article>
        </div>

        <div class="timeline">
          <div class="timeline-row">
            <span>Day 1</span>
            <strong>Lv. 260 · 24.8%</strong>
          </div>
          <div class="timeline-row">
            <span>Day 7</span>
            <strong>Lv. 263 · 11.4%</strong>
          </div>
          <div class="timeline-row">
            <span>Day 30</span>
            <strong>Lv. 272 · 68.2%</strong>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style>
:root {
  color: #1d1d1f;
  background: #f5f5f7;
  font-family:
    Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background:
    linear-gradient(180deg, #ffffff 0%, #f5f5f7 46%, #eef2f5 100%);
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  width: min(1180px, calc(100% - 40px));
  min-height: 100vh;
  margin: 0 auto;
  padding: 56px 0;
}

.hero-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: end;
  margin-bottom: 28px;
}

.hero-copy h1 {
  max-width: 760px;
  margin: 8px 0 14px;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.03;
  letter-spacing: 0;
}

.hero-description {
  max-width: 660px;
  margin: 0;
  color: #5f6368;
  font-size: 18px;
  line-height: 1.65;
}

.eyebrow {
  margin: 0;
  color: #2570ff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.summary-panel,
.control-panel,
.results-panel {
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(24px);
}

.summary-panel {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.summary-panel div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.summary-panel strong {
  font-size: 24px;
}

.metric-label {
  color: #6e6e73;
  font-size: 14px;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(360px, 440px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.control-panel,
.results-panel {
  padding: 24px;
}

.panel-header {
  margin-bottom: 22px;
}

.panel-header h2 {
  margin: 6px 0 0;
  font-size: 24px;
  letter-spacing: 0;
}

.input-group {
  display: grid;
  gap: 14px;
  margin: 0 0 18px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.input-group legend {
  padding: 0 6px;
  color: #111827;
  font-weight: 700;
}

label {
  display: grid;
  gap: 8px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
}

input,
select {
  width: 100%;
  height: 44px;
  border: 1px solid #d9dde3;
  border-radius: 8px;
  padding: 0 12px;
  background: #ffffff;
  color: #1d1d1f;
  outline: none;
}

input:focus,
select:focus {
  border-color: #2570ff;
  box-shadow: 0 0 0 4px rgba(37, 112, 255, 0.14);
}

.inline-input {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
}

.inline-input span {
  color: #6e6e73;
  font-weight: 700;
}

.toggle-row {
  grid-template-columns: 1fr auto;
  align-items: center;
  min-height: 36px;
}

.toggle-row input {
  width: 20px;
  height: 20px;
  accent-color: #2570ff;
}

.primary-action {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
}

.results-panel {
  min-height: 620px;
}

.progress-card {
  display: grid;
  gap: 18px;
  margin-bottom: 18px;
  padding: 24px;
  border-radius: 8px;
  background: #111827;
  color: #ffffff;
}

.progress-copy {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
}

.progress-copy span {
  color: #c7d2fe;
}

.progress-copy strong {
  font-size: 48px;
  line-height: 1;
}

.progress-track {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.progress-track span {
  display: block;
  width: 68.2%;
  height: 100%;
  border-radius: inherit;
  background: #61dafb;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.result-grid article,
.timeline {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.result-grid article {
  display: grid;
  gap: 10px;
  padding: 18px;
}

.result-grid span,
.timeline-row span {
  color: #6e6e73;
  font-size: 13px;
  font-weight: 700;
}

.result-grid strong {
  font-size: 24px;
}

.timeline {
  overflow: hidden;
}

.timeline-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
}

.timeline-row + .timeline-row {
  border-top: 1px solid #edf0f3;
}

@media (max-width: 900px) {
  .app-shell {
    width: min(100% - 28px, 680px);
    padding: 32px 0;
  }

  .hero-section,
  .workspace {
    grid-template-columns: 1fr;
  }

  .summary-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .summary-panel div {
    display: grid;
    gap: 6px;
  }
}

@media (max-width: 620px) {
  .hero-copy h1 {
    font-size: 38px;
  }

  .summary-panel,
  .result-grid {
    grid-template-columns: 1fr;
  }

  .progress-copy,
  .timeline-row {
    align-items: start;
    flex-direction: column;
  }

  .control-panel,
  .results-panel {
    padding: 18px;
  }
}
</style>
