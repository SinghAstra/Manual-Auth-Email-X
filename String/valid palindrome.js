// Approach : Two Pointer Approach
// Time Complexity : O(n)
// Space Complexity : O(1)
var isPalindrome = function (s) {
  s = str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  console.log(s);
  let firstPointer = 0;
  let secondPointer = s.length - 1;
  while (firstPointer < secondPointer) {
    if (s[firstPointer] === s[secondPointer]) {
      firstPointer++;
      secondPointer--;
      continue;
    }
    return false;
  }
  return true;
};

const str = "A man, a plan, a canal: Panama";
console.log(isPalindrome(str));
