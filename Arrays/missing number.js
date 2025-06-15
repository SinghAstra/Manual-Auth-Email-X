// Approach 1 : Brute Force Approach
// Look For Every Element One By One
// Time Complexity : O(n2)
// Space Complexity : O(1)
var missingNumberBruteForce = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    let numberIsFound = false;
    for (let j = 0; j < nums.length; j++) {
      if (i === nums[j]) {
        numberIsFound = true;
        console.log("Found", i);
        break;
      }
    }
    if (!numberIsFound) {
      return i;
    }
  }
  return nums.length;
};

// Approach 2 : Find Total Sum
// Time Complexity : O(n)
// Space Complexity : O(1)
var missingNumberBruteForce = function (nums) {
  let len = nums.length;
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += nums[i];
  }
  return (len * (len + 1)) / 2 - sum;
};

const nums = [0, 1, 3];
console.log(missingNumberBruteForce(nums));
