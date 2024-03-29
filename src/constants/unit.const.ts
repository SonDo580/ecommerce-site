enum MemoryUnit {
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

const MEMORY_UNITS: MemoryUnit[] = [
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

export { MemoryUnit, MEMORY_UNITS };
