// Approach 1 : Brute Force Approach
// Form all the substring keep track of substring with maxLen  and with no repeating Char
// Time Complexity : O(n2)
// Space Complexity : O(1)
var lengthOfLongestSubstringBruteForce = function (s) {
  let maxLen = 0;
  for (let i = 0; i < s.length; s++) {
    let currentStr = "";
    for (let j = i; j < s.length; j++) {
      if (currentStr.includes(s[j])) {
        const index = currentStr.indexOf(s[j]);
        currentStr = currentStr.slice(index + 1);
      }
      currentStr += s[j];
      maxLen = Math.max(maxLen, currentStr.length);
    }
  }
  return maxLen;
};

// Approach 2 : Single Pass Approach
// Time Complexity : O(n)
// Space Complexity : O(1)
var lengthOfLongestSubstring = function (s) {
  let maxLen = 0;
  let currentStr = "";
  for (let i = 0; i < s.length; i++) {
    if (currentStr.includes(s[i])) {
      let index = currentStr.indexOf(s[i]);
      currentStr = currentStr.slice(index + 1);
    }
    currentStr += s[i];
    maxLen = Math.max(maxLen, currentStr.length);
  }
  return maxLen;
};

const s = "aabaab!bb";
console.log(lengthOfLongestSubstring(s));
