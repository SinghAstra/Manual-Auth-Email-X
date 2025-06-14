// Approach 1 : Brute Force Approach
// Explanation:
// Idea: Iterate through the array. For every zero encountered,
// shift all subsequent elements left by one position.
// Steps:
// Track the effective array length (n) to ignore processed zeros at the end.
// For each zero found at index i, shift elements from i+1 to n-1 left by one.
// Decrement n to skip reprocessing the newly added zero at the end.
// Time Complexity: O(n²) (worst case for all zeros, e.g., ``).
// Space Complexity: O(1) (in-place).
var moveZeroesBruteForce = function (nums) {
  let len = nums.length;
  for (let i = 0; i < len; ) {
    if (nums[i] === 0) {
      for (let j = i + 1; j < len; j++) {
        nums[j - 1] = nums[j];
      }
      nums[len - 1] = 0;
      len = len - 1;
    } else {
      i++;
    }
  }
};

// Optimal Approach (Two-Pointer)
// Explanation:
// Idea: Use two pointers to separate non-zero and zero elements in a single pass. Maintain relative order by placing non-zeros at the earliest possible positions.
// Steps:
// Pointer writePointer: Tracks the position for the next non-zero element.
// Pointer readPointer: Scans the entire array.
// Swap non-zero elements with writePointer positions and increment writePointer.
// Time Complexity: O(n) (single pass).
// Space Complexity: O(1) (in-place).
var moveZeroesTwoPointer = function (nums) {
  let len = nums.length;
  let writePointer = 0;
  for (let readPointer = 0; readPointer < len; readPointer++) {
    if (nums[readPointer] !== 0) {
      let temp = nums[writePointer];
      nums[writePointer] = nums[readPointer];
      nums[readPointer] = temp;
      writePointer++;
    }
  }
};
function logNums() {
  let output = "[ ";
  for (let i = 0; i < nums.length; i++) {
    output += `${nums[i]} `;
  }
  output += "]";
  console.log(output);
}

const nums = [0, 0, 1];
moveZeroesTwoPointer(nums);
logNums(nums);
