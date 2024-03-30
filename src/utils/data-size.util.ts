import { ErrorMessage } from "@root/constants/message.const";
import { MEMORY_UNITS, MemoryUnit } from "@root/constants/unit.const";

export class DataSizeUtil {
  static convert(value: number, from: MemoryUnit, to: MemoryUnit): number {
    if (value < 0) {
      throw new Error(ErrorMessage.NEGATIVE_MEMORY_VALUE);
    }

    const fromIndex: number = MEMORY_UNITS.indexOf(from);
    const toIndex: number = MEMORY_UNITS.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) {
      throw new Error(ErrorMessage.INVALID_MEMORY_UNIT);
    }

    const multiplier: number = 1024 ** (fromIndex - toIndex);
    return value * multiplier;
  }
}
