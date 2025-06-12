const nums = [3, 2, 1, 5, 6, 4];
const k = 2;

// Approach 1 : Brute Force Approach
// The Brute Force Approach is to Sort the array and find the Kth Largest Element
// This is manual Selection Sort Better Approach would be in built sort()
// Time Complexity : O(n2)
// Space Complexity : O(1)
var findKthLargestBrute = function (nums, k) {
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    let minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (nums[j] < nums[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      let temp = nums[minIndex];
      nums[minIndex] = nums[i];
      nums[i] = temp;
    }
  }
  return nums[len - k];
};

console.log(findKthLargestBrute(nums, k));

// Approach 2 : In built sort() Approach
// array.sort((a, b) => a - b), sort method uses function to decide the order of any two elements, a and b.
// If a - b is negative (meaning a is less than b), a will come before b.
// If a - b is positive (meaning a is greater than b), b will come before a.
// If a - b is zero, their order doesn't change.
// The sort() method in JavaScript alters the original array
// Time Complexity : O(nlogn)
// Space Complexity : O(1)
var findKthLargestInBuiltSort = function (nums, k) {
  const len = nums.length;
  nums.sort((a, b) => a - b);
  return nums[len - k];
};
console.log(findKthLargestInBuiltSort(nums, k));
