import { DataSizeUtil } from "@root/utils/data-size.util";
import {
  MEMORY_CONVERSION_FACTOR,
  MemoryUnit,
} from "@root/constants/unit.const";
import { ErrorMessage } from "@root/constants/message.const";

describe("Test Data Size Converter", () => {
  it("converts bytes to kilobytes", () => {
    const result = DataSizeUtil.convert(
      MEMORY_CONVERSION_FACTOR,
      MemoryUnit.B,
      MemoryUnit.KiB
    );
    expect(result).toBe(1);
  });

  it("converts kilobytes to bytes", () => {
    const result = DataSizeUtil.convert(1, MemoryUnit.KiB, MemoryUnit.B);
    expect(result).toBe(MEMORY_CONVERSION_FACTOR);
  });

  it("converts kilobytes to megabytes", () => {
    const result = DataSizeUtil.convert(
      MEMORY_CONVERSION_FACTOR,
      MemoryUnit.KiB,
      MemoryUnit.MiB
    );
    expect(result).toBe(1);
  });

  it("converts megabytes to kilobytes", () => {
    const result = DataSizeUtil.convert(1, MemoryUnit.MiB, MemoryUnit.KiB);
    expect(result).toBe(MEMORY_CONVERSION_FACTOR);
  });

  it("Invalid memory units", () => {
    const convertWithInvalidUnit = () => {
      DataSizeUtil.convert(1, "invalidUnit" as MemoryUnit, MemoryUnit.KiB);
    };
    expect(convertWithInvalidUnit).toThrow(ErrorMessage.INVALID_MEMORY_UNIT);
  });

  it("Invalid memory value", () => {
    const convertWithInvalidUnit = () => {
      DataSizeUtil.convert(-1, MemoryUnit.B, MemoryUnit.KiB);
    };
    expect(convertWithInvalidUnit).toThrow(ErrorMessage.NEGATIVE_MEMORY_VALUE);
  });
});
