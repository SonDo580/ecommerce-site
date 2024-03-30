import { MEMORY_UNITS, MemoryUnit } from "@root/constants/unit.const";

export class DataSizeUtil {
  static convert(value: number, from: MemoryUnit, to: MemoryUnit): number {
    if (value < 0) {
      throw new Error("Negative memory value");
    }

    const fromIndex = MEMORY_UNITS.indexOf(from);
    const toIndex = MEMORY_UNITS.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) {
      throw new Error("Invalid memory unit");
    }

    const multiplier = 1024 ** (fromIndex - toIndex);
    return value * multiplier;
  }
}
