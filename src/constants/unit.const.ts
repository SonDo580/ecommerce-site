export const MEMORY_CONVERSION_FACTOR = 1024;

export enum MemoryUnit {
  B = "B",
  KiB = "KiB",
  MiB = "MiB",
  GiB = "GiB",
  TiB = "TiB",
  PiB = "PiB",
  EiB = "EiB",
  ZiB = "ZiB",
  YiB = "YiB",
}

export const MEMORY_UNITS: MemoryUnit[] = [
  MemoryUnit.B,
  MemoryUnit.KiB,
  MemoryUnit.MiB,
  MemoryUnit.GiB,
  MemoryUnit.TiB,
  MemoryUnit.PiB,
  MemoryUnit.EiB,
  MemoryUnit.ZiB,
  MemoryUnit.YiB,
];
