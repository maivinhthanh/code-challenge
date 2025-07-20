// use loop
function sum_to_n(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// use formula
function sum_to_n(n) {
  return (n * (n + 1)) / 2;
}

//use recursion
function sum_to_n(n) {
  if (n <= 1) return n;
  return n + sum_to_n(n - 1);
}