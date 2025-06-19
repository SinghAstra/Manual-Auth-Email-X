var hasMatch = function (s, p) {
  let [sub1, sub2] = p.split("*");

  const isSub1 = sub1 !== "";
  const isSub2 = sub2 !== "";
  const index1 = s.indexOf(sub1);
  const index2 = s.lastIndexOf(sub2);

  if (isSub1 && index1 === -1) {
    return false;
  }

  if (isSub2 && index2 === -1) {
    return false;
  }

  if (isSub1 && isSub2 && index1 + isSub1.length - 1 >= index2) {
    return false;
  }
  return true;
};

let s = "ckckkk";
let p = "ck*kc";
console.log(hasMatch(s, p));
