// Idea : Start by assuming the entire first string is the prefix.
// Then, for each subsequent string, reduce the prefix character by character until it matches the start of the current string.
// If at any point the prefix becomes empty, return "" immediately.
// Time Complexity : O(n*m)
// Ṣpace Complexity: O(1)
var commonPrefix = (str1, str2) => {
  let longestCommonPrefix = "";
  if (str1.length > str2.length) {
    [str1, str2] = [str2, str1];
  }
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] === str2[i]) {
      longestCommonPrefix += str1[i];
    } else {
      return longestCommonPrefix;
    }
  }
  return longestCommonPrefix;
};
var longestCommonPrefix = function (strs) {
  let longestCommonPrefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    if (longestCommonPrefix === "") {
      return longestCommonPrefix;
    }
    longestCommonPrefix = commonPrefix(strs[i], longestCommonPrefix);
  }
  return longestCommonPrefix;
};

const strs = ["flower", "flow", "flight"];
console.log(longestCommonPrefix(strs));
