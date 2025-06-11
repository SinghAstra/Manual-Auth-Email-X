// 1. Brute Force Solution
// Time Complexity : O(n2)
// Space Complexity : O(1)

var twoSum = function (nums, target) {
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
};

// 2. Using Hash Map
// Time Complexity : O(n)
// Space Complexity : O(n)
var twoSum = function (nums, target) {
  const len = nums.length;
  const recordObj = {};
  for (let i = 0; i < len; i++) {
    const complementNumber = target - nums[i];
    if (recordObj[complementNumber] !== undefined) {
      return [recordObj[complementNumber], i];
    }
    recordObj[nums[i]] = i;
  }
  return [-1, -1];
};
