import Decimal from "decimal.js";

export class NumberUtil {
  static round(val: number, decimal: number = 0): number {
    return new Decimal(val).toDecimalPlaces(decimal).toNumber();
  }
}
