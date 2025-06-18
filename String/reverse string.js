// Approach 1 : Two Pointer Approach
// Idea: Use two pointers, one at the start and one at the end, \
// and swap their elements, moving towards the center until they meet.
// Time Complexity: O(n) (each element is swapped once)
// Space Complexity: O(1) (no extra space except a temp variable for swapping)
var reverseString = function (s) {
  let firstPointer = 0;
  let secondPointer = s.length - 1;
  while (firstPointer < secondPointer) {
    [s[firstPointer], s[secondPointer]] = [s[secondPointer], s[firstPointer]];
    firstPointer++;
    secondPointer--;
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
const s = ["h", "e", "l", "l", "o"];
reverseString(s);
logNums(s);
