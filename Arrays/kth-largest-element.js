const nums = [3, 2, 3, 1, 2, 4, 5, 5, 6];
const k = 4;

// Approach 1 : Brute Force Approach
// The Brute Force Approach is to Sort the array and find the Kth Largest Element
// This is manual Selection Sort Better Approach would be in built sort()
// Time Complexity : O(n2)
// Space Complexity : O(1)
var findKthLargestBrute = function (nums, k) {
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    let minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (nums[j] < nums[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      let temp = nums[minIndex];
      nums[minIndex] = nums[i];
      nums[i] = temp;
    }
  }
  return nums[len - k];
};

// console.log(findKthLargestBrute(nums, k));

// Approach 2 : In built sort() Approach
// array.sort((a, b) => a - b), sort method uses function to decide the order of any two elements, a and b.
// If a - b is negative (meaning a is less than b), a will come before b.
// If a - b is positive (meaning a is greater than b), b will come before a.
// If a - b is zero, their order doesn't change.
// The sort() method in JavaScript alters the original array
// Time Complexity : O(nlogn)
// Space Complexity : O(1)
var findKthLargestInBuiltSort = function (nums, k) {
  const len = nums.length;
  nums.sort((a, b) => a - b);
  return nums[len - k];
};
// console.log(findKthLargestInBuiltSort(nums, k));

// Approach 3 : Min Heap
// Maintain an array which satisfies the heap property of size k
// if size becomes greater than k remove the top most element
// At the end the top most element is kth largest element
// Time Complexity : O(n logk)
// Space Complexity : O(k)

class MinHeap {
  constructor() {
    this.heap = [];
  }
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }
  getRightChildIndex(index) {
    return 2 * index + 2;
  }
  size() {
    return this.heap.length;
  }
  getRoot() {
    return this.heap[0];
  }
  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  logHeap() {
    let output = "[ ";
    this.heap.forEach((elem) => {
      output += `${elem} `;
    });
    output += "]";
    console.log(output);
  }

  insert(elem) {
    this.heap.push(elem);
    this.heapifyUp();
  }

  heapifyUp() {
    let currentIndex = this.heap.length - 1;
    while (
      this.getParentIndex(currentIndex) >= 0 &&
      this.heap[this.getParentIndex(currentIndex)] > this.heap[currentIndex]
    ) {
      this.swap(this.getParentIndex(currentIndex), currentIndex);
      currentIndex = this.getParentIndex(currentIndex);
    }
  }

  removeMin() {
    this.swap(0, this.size() - 1);
    this.heap.pop();
    this.heapifyDown();
  }

  heapifyDown() {
    let currentIndex = 0;
    // In heapify Down we check for existence of left child bcoz it is not possible that
    // left child does not exist but right child does
    while (this.getLeftChildIndex(currentIndex) < this.size()) {
      // We have to check if heap property is violated
      // so for that i need to check what child is actually smaller that is what i determine below
      let smallerIndex = this.getLeftChildIndex(currentIndex);

      if (
        this.getRightChildIndex(currentIndex) < this.size() &&
        this.heap[this.getRightChildIndex(currentIndex)] <
          this.heap[smallerIndex]
      ) {
        smallerIndex = this.getRightChildIndex(currentIndex);
      }
      // Now I check if heap property is violated swap happens currentIndex moves down to smaller child Index
      // and loop continues till leaf node occurs or heap property gets satisfied
      if (this.heap[currentIndex] > this.heap[smallerIndex]) {
        this.swap(smallerIndex, currentIndex);
        currentIndex = smallerIndex;
      } else {
        break;
      }
    }
  }

  isMinHeap() {
    for (let i = 0; i < this.size(); i++) {
      const leftChildIndex = this.getLeftChildIndex(i);
      const rightChildIndex = this.getRightChildIndex(i);
      if (
        leftChildIndex < this.size() &&
        this.heap[i] > this.heap[leftChildIndex]
      ) {
        return false;
      }
      if (
        rightChildIndex < this.size() &&
        this.heap[i] > this.heap[rightChildIndex]
      ) {
        return false;
      }
    }
    return true;
  }
}

var findKthLargest = function (nums, k) {
  const minHeap = new MinHeap();
  nums.forEach((num) => {
    minHeap.insert(num);
    if (minHeap.size() > k) {
      minHeap.removeMin();
    }
  });
  minHeap.logHeap();

  return minHeap.getRoot();
};
console.log(findKthLargest(nums, k));

var findKthLargest = function (nums, k) {
  const len = nums.length;
  nums.sort((a, b) => a - b);
  return nums[len - k];
};
