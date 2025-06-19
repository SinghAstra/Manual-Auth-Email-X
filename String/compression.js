var compress = function (chars) {
  let result = "";
  let sum = 0;
  let currentChar = chars[0];
  let currentCount = 1;
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === currentChar) {
      currentCount++;
    } else {
      if (currentCount > 1) {
        result += currentChar + currentCount;
        sum += currentCount;
      } else {
        result += currentChar;
        sum += currentCount;
      }
      currentChar = chars[i];
      currentCount = 1;
    }
  }
  if (currentCount > 1) {
    result += currentChar + currentCount;
    sum += currentCount;
  } else {
    result += currentChar;
    sum += currentCount;
  }

  const resArray = result.split("");
  for (let i = 0; i < resArray.length; i++) {
    chars[i] = resArray[i];
  }

  return sum;
};

function logNums(nums) {
  let output = "[ ";
  for (let i = 0; i < nums.length; i++) {
    output += `${nums[i]} `;
  }
  output += "]";
  console.log(output);
}

const chars = ["a"];
compress(chars);
