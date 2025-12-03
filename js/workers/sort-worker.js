/**
 * 排序 Worker
 * Phase 6.4
 */

self.onmessage = function(e) {
  const { array, algorithm } = e.data;
  const startTime = performance.now();

  let sortedArray;

  switch (algorithm) {
    case 'quick':
      sortedArray = quickSort([...array]);
      break;
    case 'merge':
      sortedArray = mergeSort([...array]);
      break;
    case 'heap':
      sortedArray = heapSort([...array]);
      break;
    default:
      sortedArray = [...array].sort((a, b) => a - b);
  }

  const endTime = performance.now();

  self.postMessage({
    type: 'result',
    sortedArray,
    duration: endTime - startTime,
    algorithm
  });
};

// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 合併排序
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let l = 0, r = 0;

  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) {
      result.push(left[l++]);
    } else {
      result.push(right[r++]);
    }
  }

  return [...result, ...left.slice(l), ...right.slice(r)];
}

// 堆排序
function heapSort(arr) {
  const n = arr.length;

  // 建立最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 逐個取出元素
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
