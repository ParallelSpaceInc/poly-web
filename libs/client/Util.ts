export function AddUnit(number?: string | number | null): string | null {
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

export const Categories: string[] = [
  "Misc",
  "Furniture",
  "Architecture",
  "Animals",
  "Food",
  "Characters",
  "Nature",
  "Vehicles",
  "Scenes",
  "Accessories",
  "Health",
  "Instruments",
  "Plants",
  "Weapons",
  "Technology",
];

// export const Categories: string[] = [
//   "Animals & Pets",
//   "Architecture",
//   "Art & Abstract",
//   "Cars & Vehicles",
//   "Cultural Heritage & History",
//   "Electronics & Gadgets",
//   "Fashion & Style",
//   "Food & Drink",
//   "Furniture & Home",
//   "Music",
//   "Nature & Plants",
//   "News & Politics",
//   "People",
//   "Places & Travel",
//   "Science & Technology",
//   "Sports & Fitness",
//   "Weapons & Military",
// ];
