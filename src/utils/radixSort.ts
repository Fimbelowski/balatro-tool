function getNthDigit(num: number, n: number) {
  return Math.floor(num / 10 ** n) % 10;
}

export default function radixSort(nums: number[]) {
  let max = -Infinity;

  for (const num of nums) {
    if (num > max) {
      max = num;
    }
  }

  const maxDigits = Math.floor(Math.log10(max)) + 1;

  let sortedNums = [...nums];

  for (let i = 0; i < maxDigits; i++) {
    const buckets: number[][] = [];

    for (let j = 0; j < 10; j++) {
      buckets.push([]);
    }

    for (const num of sortedNums) {
      const ithDigit = getNthDigit(num, i);
      buckets[ithDigit].push(num);
    }

    sortedNums = Array.prototype.concat(...buckets);
  }

  return sortedNums;
}
