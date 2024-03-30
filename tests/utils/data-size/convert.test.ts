import { DataSizeUtil } from "@root/utils/data-size.util";
import { MemoryUnit } from "@root/constants/unit.const";

describe("Test Data Size Converter", () => {
  it("converts bytes to kilobytes", () => {
    const result = DataSizeUtil.convert(1024, MemoryUnit.B, MemoryUnit.KiB);
    expect(result).toBe(1);
  });

  it("converts kilobytes to bytes", () => {
    const result = DataSizeUtil.convert(1, MemoryUnit.KiB, MemoryUnit.B);
    expect(result).toBe(1024);
  });

  it("converts megabytes to kilobytes", () => {
    const result = DataSizeUtil.convert(1, MemoryUnit.MiB, MemoryUnit.KiB);
    expect(result).toBe(1024);
  });

  it("converts kilobytes to megabytes", () => {
    const result = DataSizeUtil.convert(1, MemoryUnit.MiB, MemoryUnit.KiB);
    expect(result).toBe(1024);
  });

  it("Invalid memory units", () => {
    const convertWithInvalidUnit = () => {
      DataSizeUtil.convert(1, "invalidUnit" as MemoryUnit, MemoryUnit.KiB);
    };
    expect(convertWithInvalidUnit).toThrow("Invalid memory unit");
  });

  it("Invalid memory value", () => {
    const convertWithInvalidUnit = () => {
      DataSizeUtil.convert(-1, MemoryUnit.B, MemoryUnit.KiB);
    };
    expect(convertWithInvalidUnit).toThrow("Negative memory value");
  });
});
