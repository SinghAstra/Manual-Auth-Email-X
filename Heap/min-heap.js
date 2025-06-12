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
  hasParentNode(index) {
    return this.getParentIndex(index) >= 0;
  }
  printHeap() {
    let output = "[ ";
    this.heap.forEach((elem) => {
      output += `${elem} `;
    });
    output += "]";
    console.log(output);
  }
  getHeap() {
    return this.heap;
  }

  insert(value) {
    this.heap.push(value);
    this.heapifyUp();
  }
  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  // Heapify Up (also called "sift up" or "bubble up") is an operation used after inserting a new element into a heap.
  // When you add an element to the end of the heap (typically represented as an array),
  // it may violate the heap property.
  // Heapify up restores the heap property by repeatedly swapping the new element
  // with its parent until the correct position is found.

  // Process:
  // Start at the newly inserted node (the last index).
  // While the node has a parent and the heap property is violated (e.g., in a min-heap, the child is less than the parent), swap the node with its parent.
  // Move up to the parent and repeat until the heap property is restored or the root is reached.
  heapifyUp() {
    let currentIndex = this.heap.length - 1;
    while (
      this.hasParentNode(currentIndex) &&
      this.heap[this.getParentIndex(currentIndex)] > this.heap[currentIndex]
    ) {
      this.swap(this.getParentIndex(currentIndex), currentIndex);
      currentIndex = this.getParentIndex(currentIndex);
    }
  }
  removeMin() {
    if (this.heap.length === 0) {
      return "Empty Array";
    }
    this.heap.pop();
    this.heapifyDown();
  }

  // Heapify Down is used after removing the root element from a heap.
  // When we remove the root, the right element to the root position becomes root, which may violate the heap property.
  // Heapify down restores the heap property by moving this element down the tree.
  // Process:

  // Start at the root node (index 0).

  // While the node has at least one child, compare it with its children.
  // If the heap property is violated (e.g., in a min-heap, the node is greater than either child), swap it with the smaller child.
  // Move down to the swapped child and repeat until the heap property is restored or a leaf is reached.
  heapifyDown() {
    let currentIndex = 0;
    while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
      const smallerIndex = this.getLeftChildIndex(currentIndex);
      if (
        this.getRightChildIndex < this.heap.length &&
        this.heap[smallerIndex] >
          this.heap[this.getRightChildIndex(currentIndex)]
      ) {
        smallerIndex = this.getRightChildIndex(currentIndex);
      }
      if (this.heap[currentIndex] > this.heap[smallerIndex]) {
        this.swap(currentIndex, smallerIndex);
        currentIndex = smallerIndex;
      } else {
        break;
      }
    }
  }
}

function checkIfArrayIsHeap(nums) {
  const len = nums.length;
  if (len === 0) {
    return "Empty Array";
  }
  for (let i = 0; i < len; i++) {
    const leftChildIndex = 2 * i + 1;
    const rightChildIndex = 2 * i + 2;
    if (leftChildIndex < len) {
      if (nums[leftChildIndex] < nums[i]) {
        return false;
      }
    }
    if (rightChildIndex < len) {
      if (nums[rightChildIndex] < nums[i]) {
        return false;
      }
    }
  }
  return true;
}
