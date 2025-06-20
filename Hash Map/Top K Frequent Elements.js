var topKFrequent = function (nums, k) {
  let count = {};
  for (let num of nums) {
    if (!count[num]) {
      count[num] = 0;
    }
    count[num]++;
  }
  const parsedCount = Object.fromEntries(
    Object.entries(count)
      .sort(([, a], [, b]) => b - a)
      .slice(0, k)
  );
  return Object.keys(parsedCount).map((num) => Number(num));
};

const nums = [1, 1, 1, 2, 2, 3];
const k = 2;
console.log(topKFrequent(nums, k));
