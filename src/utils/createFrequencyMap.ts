import mapGetValueOrThrow from './mapGetValueOrThrow';

export default function createFrequencyMap<T, V>(
  items: T[],
  callback: (item: T) => V,
): Map<V, number> {
  const frequencyMap = new Map<V, number>();

  items.forEach((item) => {
    const value = callback(item);

    if (!frequencyMap.has(value)) {
      frequencyMap.set(value, 0);
    }

    const frequency = mapGetValueOrThrow(
      frequencyMap,
      value,
      `Frequency of ${value} not found.`,
    );

    frequencyMap.set(value, frequency + 1);
  });

  return frequencyMap;
}
