export function AddUnit(number: string | number | undefined): string | null {
  if (!number) return null;
  const parsedNumber = typeof number === "string" ? +number : number;
  if (parsedNumber === NaN) return null;
  const numberUnitPair: [number, string][] = [
    [1 << 30, "G"],
    [1 << 20, "M"],
    [1 << 10, "K"],
  ];
  for (const [limit, Unit] of numberUnitPair) {
    if (parsedNumber >= limit)
      return Math.floor(parsedNumber / limit).toString() + Unit;
  }
  return parsedNumber.toString();
}
