const nums = [1, 1, 2];
// Approach 1 : Brute Force Approach
// Store Unique Elements in temp array
// Use temp array to update original array
// Time Complexity : O(n)
// Space Complexity : O(n)
var removeDuplicatesBruteForce = function (nums) {
  const temp = [];
  for (let i = 0; i < nums.length; i++) {
    if (temp.length > 0) {
      if (temp[temp.length - 1] !== nums[i]) {
        temp.push(nums[i]);
      }
    } else {
      temp.push(nums[i]);
    }
  }
  for (let i = 0; i < temp.length; i++) {
    nums[i] = temp[i];
  }
  return temp.length;
};

function logNums() {
  let output = "[ ";
  for (let i = 0; i < nums.length; i++) {
    output += `${nums[i]} `;
  }
  output += "]";
  console.log(output);
}

// Approach 2 : Two Pointer Approach
// Since the array is already sorted, all duplicates are adjacent.
// We use the two-pointer technique:
// One pointer tracks the position to place the next unique element.
// Second pointer (j) scans through the array.

// How it works:
// Start with i = 0 (first element is always unique).
// For each j from 1 to end:
// If nums[j] is different from nums[i], increment i and set nums[i] = nums[j].
// At the end, the first i + 1 elements are unique.
// Time Complexity : O(n)
// Space Complexity : O(1)
var removeDuplicatesTwoPointer = function (nums) {
  let firstPointer = 0;
  let secondPointer = 1;
  while (secondPointer < nums.length) {
    if (nums[secondPointer] !== nums[firstPointer]) {
      firstPointer++;
      nums[firstPointer] = nums[secondPointer];
    }
    secondPointer++;
  }
  return firstPointer + 1;
};
removeDuplicatesTwoPointer(nums);

logNums();
