// Approach 1 : Brute Force
// Idea: Check every possible subarray, calculate its sum, and keep track of the maximum sum found.
// Time Complexity : O(n2)
// Space Complexity : O(1)
var maxSubArrayBruteForce = function (nums) {
  let len = nums.length;
  let maxSum = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < len; i++) {
    let currentSum = 0;
    for (let j = i; j < len; j++) {
      currentSum += nums[j];
      if (currentSum > maxSum) {
        maxSum = currentSum;
      }
    }
  }
  return maxSum;
};

// Optimal Solution : Kadane's Algorithm
// Idea: As we traverse the array, at each step, \
// decide whether to extend the current subarray or start a new subarray
// at the current element. Keep track of the maximum sum seen so far.
// Time Complexity : O(n)
// Space Complexity : O(1)

var maxSubArray = function (nums) {
  let len = nums.length;
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < len; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(currentSum, maxSum);
  }
  return maxSum;
};

const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArray(nums));
