// Approach 1 : Brute Force Approach
// Idea: For each element in nums1,
// check if it exists in nums2 and if it hasn't already been added to the result.
// Time Complexity : O(n2)
// Space Complexity : O(1)
var intersectionBruteForce = function (nums1, nums2) {
  const result = [];
  for (let i = 0; i < nums1.length; i++) {
    if (nums2.includes(nums1[i]) && !result.includes(nums1[i])) {
      result.push(nums1[i]);
    }
  }
  return result;
};

// Approach 2 : Using Set
// Idea: Convert both arrays to sets to remove duplicates, then find the intersection efficiently.
// Time Complexity : O(m+n)
// Space Complexity : O(m+n)
var intersection = (nums1, nums2) => {
  let set1 = new Set(nums1);
  let set2 = new Set(nums2);
  let result = [];
  if (set1.size > set2.size) [set1, set2] = [set2, set1];
  for (const elem of set1) {
    if (set2.has(elem)) {
      result.push(elem);
    }
  }
  return result;
};

function logNums(nums) {
  let output = "[ ";
  for (let i = 0; i < nums.length; i++) {
    output += `${nums[i]} `;
  }
  output += "]";
  console.log(output);
}

const nums1 = [1, 2, 2, 1];
const nums2 = [2, 2];
const result = intersection(nums1, nums2);
logNums(result);
