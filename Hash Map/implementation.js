class HashTable {
  constructor(size = 10) {
    this.table = new Array(size);
    this.size = size;
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  set(key, value) {
    const index = this.hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }
    for (let pair of this.table[index]) {
      if (pair[0] === key) {
        pair[1] = [value];
        return;
      }
    }
    this.table[index].push([key, [value]]);
  }

  get(key) {
    const index = this.hash(key);
    if (!this.table[index]) return undefined;
    for (const [k, v] of this.table[index]) {
      if (k === key) return v;
    }
    return undefined;
  }

  push(key, value) {
    const index = this.hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }
    for (const pair of this.table[index]) {
      if (pair[0] === key) {
        pair[1].push(value);
        return;
      }
    }
    this.table[index].push([key, [value]]);
  }
}
