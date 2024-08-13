export type ValuationFunction<T> = (item: T) => number;

export default function nestedSort<T>(items: T[], valuationFunctions: Array<ValuationFunction<T>>): T[] {
  const valuationFunction = valuationFunctions.shift();

  if(valuationFunction === undefined) {
    return items;
  }

  const sortedItems = items.sort((a, b) => valuationFunction(a) - valuationFunction(b));

  return sortedItems.reduce((accumulator, currentValue) => {
    const previousValue = accumulator[accumulator.length - 1];

    if (previousValue === undefined || valuationFunction(currentValue) !== valuationFunction(previousValue[0])) {
      accumulator.push([currentValue]);
    } else {
      previousValue.push(currentValue);
    }

    return accumulator;
  }, [] as T[][]).map((sortedGroup) => nestedSort(sortedGroup, valuationFunctions)).flat();
}