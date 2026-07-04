# Implementation TODO

This file is a working checklist for implementing the simulator engine.

## Phase 1. Types

- [x] Define game data types in `web/types/gameData.ts`.
- [x] Define routine input types in `web/types/routine.ts`.
- [x] Define simulation input/state types in `web/types/simulation.ts`.
- [x] Define result output types in `web/types/result.ts`.
- [x] Align item data path naming with the actual `jsonData/items/*` structure.

Done when:

- Type files export real TypeScript types/interfaces.
- Engine files can import the shared types without circular dependencies.
- JSON data fields used by services are represented in `gameData.ts`.

## Phase 2. SimulationContext

- [x] Implement `SimulationContext`.
- [x] Store current date, current level, current absolute exp, routines, game data, and accumulated exp.
- [x] Keep context as a state container only.

Done when:

- Context can be created from `SimulationInput`.
- Context does not perform calculations.
- All mutable simulation state has one clear home.

## Phase 3. ExpService

- [x] Implement percent-to-absolute exp conversion.
- [x] Implement absolute-to-percent exp conversion.
- [x] Implement exp addition.
- [x] Implement exp normalization rules.
- [x] Clamp invalid over-100% initial exp to required exp minus 1.

Done when:

- ExpService does not import or call LevelService.
- Percent and absolute exp conversions are deterministic.
- Over-100% input display can be represented as 99.9%.

## Phase 4. LevelService

- [x] Implement required exp lookup.
- [x] Implement level-up check.
- [x] Implement overflow carryover.
- [x] Implement repeated level-up handling.
- [x] Implement burning level-up behavior.

Done when:

- LevelService returns updated level and exp.
- Remaining exp is carried to the final level.
- LevelService does not calculate content, hunting, or item exp.

## Phase 5. HuntingService

- [x] Load or receive hunting map data.
- [x] Apply monster base exp.
- [x] Apply level difference multiplier.
- [x] Apply hunting-only doping modifiers.
- [x] Apply kills per 6 minutes and hunting duration.

Done when:

- HuntingService returns only gained hunting exp.
- Doping affects hunting exp only.
- Custom kill count overrides map default count.

## Phase 6. ContentService

- [x] Implement daily quest exp calculation.
- [x] Implement monster park exp calculation.
- [x] Implement epic dungeon exp calculation.
- [x] Implement extreme monster park exp calculation.
- [x] Apply content event bonus rate to base content exp.

Done when:

- Daily content can be calculated for every simulated day.
- Weekly content is calculated only on selected dates.
- ContentService returns only gained content exp.

## Phase 7. ItemService

- [x] Implement growth potion exp calculation.
- [x] Implement EXP coupon exp calculation.
- [x] Implement berry ticket exp calculation.
- [x] Support future item types without changing the daily flow.

Done when:

- Items are applied only on selected dates.
- ItemService returns only gained item exp.
- Level-up is still handled by LevelService, not ItemService.

## Phase 8. DailySimulationService

- [ ] Identify routines for the current date.
- [ ] Call ContentService.
- [ ] Call HuntingService.
- [ ] Call ItemService.
- [ ] Sum all gained exp for the day.
- [ ] Call ExpService.
- [ ] Call LevelService.
- [ ] Update SimulationContext.
- [ ] Return daily calculation data for ResultBuilder.

Done when:

- DailySimulationService controls flow but does not perform calculations.
- ExpService and LevelService are called sequentially by DailySimulationService.
- Same-day hunting, content, and item exp are summed before level-up.

## Phase 9. ResultBuilder

- [ ] Build daily UI result snapshots.
- [ ] Include date, level, current exp, required exp, exp percent, gained exp, and total gained exp.
- [ ] Keep formatting logic separate from calculation logic.

Done when:

- ResultBuilder can build one day result from context and daily gained exp.
- Result shape matches `SimulationDayResult`.
- UI does not need to inspect internal engine state.

## Phase 10. SimulationEngine

- [ ] Create SimulationContext from input.
- [ ] Loop from start date to end date.
- [ ] Call DailySimulationService for each day.
- [ ] Call ResultBuilder after each day.
- [ ] Advance date.
- [ ] Stop at the end condition.

Done when:

- Engine returns a complete `SimulationResult`.
- Engine does not directly calculate exp.
- Same input returns the same result.

## Phase 11. UI Integration

- [ ] Replace Nuxt welcome screen with simulator UI.
- [ ] Add initial character input.
- [ ] Add daily routine input.
- [ ] Add weekly routine date selection.
- [ ] Add item usage by date.
- [ ] Display daily simulation results.

Done when:

- User can run a basic simulation from the browser.
- UI calls the engine through a typed input object.
- Result display uses `SimulationResult`.

## Phase 12. Verification

- [ ] Add focused unit tests for ExpService.
- [ ] Add focused unit tests for LevelService.
- [ ] Add service-level checks for HuntingService.
- [ ] Add service-level checks for ContentService.
- [ ] Add service-level checks for ItemService.
- [ ] Add one end-to-end engine scenario.

Done when:

- Core exp and level-up rules are covered.
- A full simulation from input to result is reproducible.
- `npm --prefix web run build` passes.

## Known Cleanup

- [ ] Update older docs that still mention `jsonData/other/*`.
- [ ] Confirm exact JSON schemas before implementing services.
- [ ] Decide whether JSON data is imported statically or loaded through a data adapter.
- [ ] Decide max supported level and behavior at max level.
- [ ] Decide date handling strategy and timezone assumptions.
