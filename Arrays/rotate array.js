// Approach 1 : Brute Force Approach With Extra Space
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

function logNums(nums) {
  let output = "[ ";
  for (let i = 0; i < nums.length; i++) {
    output += `${nums[i]} `;
  }
  output += "]";
  console.log(output);
}

const nums = [1, 2, 3, 4, 5, 6, 7];
const k = 3;
rotateArrayBruteForceWithExtraSpace(nums, k);
logNums(nums);
