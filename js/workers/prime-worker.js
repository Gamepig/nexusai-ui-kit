/**
 * 質數計算 Worker
 * Phase 6.4
 */

self.onmessage = function(e) {
  const { max, reportProgress } = e.data;
  const startTime = performance.now();

  const primes = findPrimes(max, reportProgress);

  const endTime = performance.now();

  self.postMessage({
    type: 'result',
    primes,
    count: primes.length,
    duration: endTime - startTime
  });
};

function findPrimes(max, reportProgress) {
  const primes = [];
  const progressStep = Math.floor(max / 10);

  for (let num = 2; num <= max; num++) {
    if (isPrime(num)) {
      primes.push(num);
    }

    // 回報進度
    if (reportProgress && num % progressStep === 0) {
      self.postMessage({
        type: 'progress',
        percent: Math.floor((num / max) * 100)
      });
    }
  }

  return primes;
}

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }

  return true;
}
