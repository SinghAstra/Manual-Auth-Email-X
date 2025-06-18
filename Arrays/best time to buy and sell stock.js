// Approach 1 : Brute Force
// Idea: For every day, try buying on that day and selling on every possible future day,
// calculating the profit each time. Keep track of the maximum profit found.
// Time Complexity : O(n2)
// Space Complexity : O(1)
var maxProfitBruteForce = function (prices) {
  let maxProfit = Number.MIN_SAFE_INTEGER;
  let len = prices.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const profit = prices[j] - prices[i];
      maxProfit = Math.max(maxProfit, profit);
    }
  }
  return maxProfit > 0 ? maxProfit : 0;
};

// Approach 2 : Optimal (Single Pass)
// Idea: As you walk through the array,
// keep track of the minimum price seen so far
// (the best day to buy up to that point).
// For each day, calculate the profit if you sold on that day
// (current price - min price so far) and keep track of the maximum profit.
// Time Complexity : O(n)
// Space Complexity : O(1)
var maxProfit = function (prices) {
  let maxProfit = Number.MIN_SAFE_INTEGER;
  let minPrice = prices[0];
  for (let i = 1; i < prices.length; i++) {
    const currentProfit = prices[i] - minPrice;
    minPrice = Math.min(minPrice, prices[i]);
    maxProfit = Math.max(currentProfit, maxProfit);
  }
  return maxProfit > 0 ? maxProfit : 0;
};
const nums = [7, 1, 5, 3, 6, 4];
console.log(maxProfit(nums));
