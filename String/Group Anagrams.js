var groupAnagrams = function (strs) {
  let result = {};
  for (const str of strs) {
    const sortedStr = str.split("").sort().join("");
    if (result[sortedStr]) {
      result[sortedStr].push(str);
    } else {
      result[sortedStr] = [str];
    }
  }
  return Object.values(result);
};

const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
groupAnagrams(strs);
