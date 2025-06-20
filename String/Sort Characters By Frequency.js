// Approach 1 : Brute Force Approach
// Count Frequencies:
// Loop through the string and count the frequency of each character using an object (hash map).
// Sort Characters:
// Convert the object to an array of [character, frequency] pairs. Sort this array in descending order by frequency.
// Build Result:
// For each pair, repeat the character by its frequency and concatenate to the result string.
// Time Complexity : O(n + klogk)
// Space Complexity : O(k)
var frequencySortBruteForce = function (s) {
  let frequencyCount = {};
  const splitString = s.split("");
  for (let char of splitString) {
    if (!frequencyCount[char]) {
      frequencyCount[char] = 1;
    } else {
      frequencyCount[char]++;
    }
  }
  const sortedEntries = Object.entries(frequencyCount).sort(
    ([, a], [, b]) => b - a
  );
  let result = "";
  for (let i = 0; i < sortedEntries.length; i++) {
    let count = sortedEntries[i][1];
    while (count > 0) {
      result += sortedEntries[i][0];
      count--;
    }
  }
  return result;
};

// Approach 2 : Bucket Sort
// Count Frequencies:
// Use an object (hash map) to count the frequency of each character.
// Bucket Sort:
// Create an array of buckets, where the index represents the frequency. For each character, put it in the bucket corresponding to its frequency.
// Build Result:
// Iterate from the highest frequency bucket to the lowest, and for each character in a bucket, append it freq times to the result string.
// Time Complexity : O(n)
// Space Complexity : O(n)
var frequencySortBucketSort = function (s) {
  const splitString = s.split("");
  let frequencyCount = {};
  for (let char of splitString) {
    if (!frequencyCount[char]) {
      frequencyCount[char] = 1;
    } else {
      frequencyCount[char]++;
    }
  }
  let resArray = [];
  Object.entries(frequencyCount).map(([key, value]) => {
    if (!resArray[value]) {
      resArray[value] = [key];
    } else {
      resArray[value].push(key);
    }
  });
  let result = "";
  for (let i = resArray.length - 1; i > 0; i--) {
    if (resArray[i] !== undefined) {
      for (let elem of resArray[i]) {
        let count = i;
        while (count > 0) {
          result += elem;
          count--;
        }
      }
    }
  }
  return result;
};
let s = "tree";
console.log(frequencySortBucketSort(s));
