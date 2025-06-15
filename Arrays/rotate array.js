// Approach 1 : Brute Force Approach With Extra Space
// Create a new array where you first put the last k elements,
// then the rest, and finally copy this back into the original array.
// Time Complexity : O(n)
// Space Complexity : O(n)
const rotateArrayBruteForceWithExtraSpace = (nums, k) => {
  const numsLen = nums.length;
  k = k % numsLen;
  const backNums = [];
  const result = [];
  for (let i = numsLen - k; i < numsLen; i++) {
    backNums.push(nums[i]);
  }
  for (let i = 0; i < backNums.length; i++) {
    result.push(backNums[i]);
  }
  for (let i = 0; i < numsLen - k; i++) {
    result.push(nums[i]);
  }

  for (let i = 0; i < numsLen; i++) {
    nums[i] = result[i];
  }
};

// Approach 2 : Brute Force Approach With Constant Space
// This approach rotates the array to the right by k steps by
// repeatedly shifting all elements one position to the right,
// k times, using only a temporary variable for swapping.
// Time Complexity : O(n2)
// Space Complexity : O(1)
const rotateArrayBruteForceWithConstantSpace = (nums, k) => {
  const numsLen = nums.length;
  k = k % numsLen;
  for (let i = 0; i < k; i++) {
    let elem = nums[numsLen - 1];
    for (let j = numsLen - 1; j > 0; j--) {
      nums[j] = nums[j - 1];
    }
    nums[0] = elem;
  }
};

// Approach 3 : Optimal Approach: Array Reversal (In-Place, O(n) Time, O(1) Space)
// This method uses the fact that rotating the array right by k steps is equivalent to:
// Reversing the whole array.
// Reversing the first k elements.
// Reversing the remaining n - k elements.

const reverseArray = (nums, startIndex, endIndex) => {
  while (startIndex < endIndex) {
    let temp = nums[startIndex];
    nums[startIndex] = nums[endIndex];
    nums[endIndex] = temp;
    startIndex++;
    endIndex--;
  }
};

const rotateArrayByArrayReversal = (nums, k) => {
  const numsLen = nums.length;
  k = k % numsLen;
  reverseArray(nums, 0, numsLen - 1);
  reverseArray(nums, 0, k - 1);
  reverseArray(nums, k, numsLen - 1);
};

function logNums(nums) {
  let output = "[ ";
  for (let i = 0; i < nums.length; i++) {
    output += `${nums[i]} `;
  }
  output += "]";
  console.log(output);
}

const nums = [-1];
const k = 2;
rotateArrayByArrayReversal(nums, k);
logNums(nums);
