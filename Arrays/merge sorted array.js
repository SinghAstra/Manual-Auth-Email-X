// Approach 1 : Brute Force Approach
// Copy all elements from nums2 into the empty slots at the end of nums1.
// Then, sort the entire nums1 array.
// Time Complexity : O(nlogn)
// Space Complexity : O(1)
var mergeSortedArrayBruteForce = function (nums1, m, nums2, n) {
  for (let i = m; i < m + n; i++) {
    nums1[i] = nums2[i - m];
  }
  nums1.sort((a, b) => a - b);
};

// Approach 2 : Three Pointer
// Since both arrays are sorted, we can merge from the end of nums1 to avoid overwriting elements.
// Use three pointers:
// p1 at the end of the valid part of nums1 (m - 1)
// p2 at the end of nums2 (n - 1)
// p at the end of nums1 (m + n - 1)
// Compare elements from the end and place the larger one at the end of nums1.
var mergeSortedArrayThreePointer = function (nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;
  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
      p--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
      p--;
    }
  }

  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p--;
    p2--;
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

const nums1 = [1, 2, 3, 0, 0, 0];
const m = 3;
const nums2 = [2, 5, 6];
const n = 3;
mergeSortedArrayThreePointer(nums1, m, nums2, n);
logNums(nums1);
