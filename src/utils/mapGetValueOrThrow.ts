export default function mapGetValueOrThrow<K, V>(
  map: Map<K, V>,
  key: K,
  errorMessage: string,
): V {
  const value = map.get(key);

  if (value === undefined) {
    throw Error(errorMessage);
  }

  return value;
}
