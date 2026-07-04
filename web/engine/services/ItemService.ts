import type { Exp, GameData, Level, Percent } from "../../types/gameData";
import type { ItemUsage } from "../../types/routine";
import { ExpService } from "./ExpService";

// 역할: 이벤트 재화 처리
/*
해야할 일
- 성장의 비약
- 상급 EXP 쿠폰
- 베리 티켓
- 기타 아이템
 */
/*
- 아이템 기반 경험치 계산

INPUT:
- 현재 레벨
- 현재 경험치
- item list

PROCESS:
1. growth potion 적용
2. exp coupon 적용
3. berry ticket 적용

RULE:
- 아이템 경험치만 계산하고 레벨업은 처리하지 않는다.

OUTPUT:
- 획득 경험치
*/

export interface ItemExpInput {
  currentLevel: Level;
  currentExp: Exp;
  items?: ItemUsage[];
}

export interface ItemExpBreakdown {
  growthPotionExp: Exp;
  expCouponExp: Exp;
  berryTicketExp: Exp;
  otherExp: Exp;
  totalExp: Exp;
}

export class ItemService {
  constructor(
    private readonly gameData: GameData,
    private readonly expService: ExpService,
  ) {}

  calculate(input: ItemExpInput): ItemExpBreakdown {
    const items = input.items ?? [];

    let growthPotionExp = 0;
    let expCouponExp = 0;
    let berryTicketExp = 0;
    let otherExp = 0;

    for (const item of items) {
      const count = Math.max(0, item.count);

      if (count === 0) {
        continue;
      }

      const gainedExp = this.calculateItemExp(
        input.currentLevel,
        input.currentExp,
        item,
      );

      if (gainedExp <= 0) {
        continue;
      }

      switch (item.itemType) {
        case "growthPotion":
          growthPotionExp += gainedExp;
          break;
        case "expCoupon":
        case "advancedExpCoupon":
          expCouponExp += gainedExp;
          break;
        case "blueberryTicket":
        case "mechaBerryTicket":
          berryTicketExp += gainedExp;
          break;
        default:
          otherExp += gainedExp;
          break;
      }
    }

    return {
      growthPotionExp,
      expCouponExp,
      berryTicketExp,
      otherExp,
      totalExp:
        growthPotionExp + expCouponExp + berryTicketExp + otherExp,
    };
  }

  calculateItemExp(
    currentLevel: Level,
    currentExp: Exp,
    item: ItemUsage,
  ): Exp {
    const count = Math.max(0, item.count);

    if (count === 0) {
      return 0;
    }

    if (typeof item.expValue === "number") {
      return Math.floor(item.expValue * count);
    }

    if (typeof item.expPercent === "number") {
      return Math.floor(
        this.expService.percentToExp(currentLevel, item.expPercent) * count,
      );
    }

    switch (item.itemType) {
      case "growthPotion":
        return this.calculateGrowthPotionExp(currentLevel, item.itemId, count);
      case "expCoupon":
        return this.calculateExpCouponExp(currentLevel, item.itemId, count);
      case "advancedExpCoupon":
        return this.calculateAdvancedExpCouponExp(currentLevel, item.itemId, count);
      case "blueberryTicket":
      case "mechaBerryTicket":
        return this.calculateBerryTicketExp(
          currentLevel,
          currentExp,
          item.itemId,
          count,
        );
      default:
        return 0;
    }
  }

  calculateGrowthPotionExp(
    currentLevel: Level,
    itemId: string,
    count: number,
  ): Exp {
    const table = this.resolveLevelTable(this.gameData.items.growthPotionDelta, itemId, currentLevel);
    const value = this.lookupLevelValue(table, currentLevel);

    return Math.floor(value * count);
  }

  calculateExpCouponExp(
    currentLevel: Level,
    itemId: string,
    count: number,
  ): Exp {
    const table = this.gameData.items.expCoupon;
    const value = this.lookupLevelValue(
      this.resolveCouponTable(table, itemId),
      currentLevel,
    );

    return Math.floor(value * count);
  }

  calculateAdvancedExpCouponExp(
    currentLevel: Level,
    itemId: string,
    count: number,
  ): Exp {
    const table = this.gameData.items.expCoupon;
    const value = this.lookupLevelValue(
      this.resolveCouponTable(table, itemId),
      currentLevel,
    );

    return Math.floor(value * count);
  }

  calculateBerryTicketExp(
    currentLevel: Level,
    currentExp: Exp,
    itemId: string,
    count: number,
  ): Exp {
    const table = this.gameData.items.berryTicket;
    const selectedTable = this.resolveBerryTable(table, itemId);
    const value = this.lookupLevelValue(selectedTable, currentLevel);

    return Math.floor(value * count);
  }

  private resolveLevelTable(
    tables: Record<string, Record<string, Exp>>,
    itemId: string,
    currentLevel: Level,
  ): Record<string, Exp> {
    if (tables[itemId]) {
      return tables[itemId];
    }

    const exactMatch = Object.values(tables).find(
      (table) => table[String(currentLevel)] !== undefined,
    );

    if (exactMatch) {
      return exactMatch;
    }

    throw new Error(`Missing growth potion data for ${itemId} at level ${currentLevel}.`);
  }

  private resolveCouponTable(
    table: {
      "상급_EXP쿠폰_개당상승절대값": Record<string, Exp>;
      "EXP쿠폰_개당상승절대값": Record<string, Exp>;
    },
    itemId: string,
  ): Record<string, Exp> {
    if (table[itemId as keyof typeof table]) {
      return table[itemId as keyof typeof table];
    }

    if (itemId.includes("상급")) {
      return table["상급_EXP쿠폰_개당상승절대값"];
    }

    return table["EXP쿠폰_개당상승절대값"];
  }

  private resolveBerryTable(
    table: {
      "블루베리_260~299_상승절대값": Record<string, Exp>;
      "블루베리_290+_상승퍼센트": Record<string, Exp>;
      "메카베리_280~299_상승절대값": Record<string, Exp>;
    },
    itemId: string,
  ): Record<string, Exp> {
    if (table[itemId as keyof typeof table]) {
      return table[itemId as keyof typeof table];
    }

    if (itemId.includes("메카")) {
      return table["메카베리_280~299_상승절대값"];
    }

    if (itemId.includes("290") || itemId.includes("퍼센트")) {
      return table["블루베리_290+_상승퍼센트"];
    }

    return table["블루베리_260~299_상승절대값"];
  }

  private lookupLevelValue(table: Record<string, Exp>, currentLevel: Level): Exp {
    const exact = table[String(currentLevel)];

    if (typeof exact === "number") {
      return exact;
    }

    const levelKeys = Object.keys(table)
      .map((key) => Number(key))
      .filter((key) => Number.isFinite(key))
      .sort((a, b) => a - b);

    const fallbackKey = levelKeys.find((key) => key >= currentLevel);

    if (fallbackKey !== undefined) {
      return table[String(fallbackKey)];
    }

    throw new Error(`Missing item value for level ${currentLevel}.`);
  }
}
