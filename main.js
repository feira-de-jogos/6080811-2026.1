import Calculator from "./calculator.js";

const calculator = new Calculator();

setTimeout(() => {
  console.log("1 segundo...");
}, 1000);

setTimeout(() => {
  console.log("2 segundos...");
}, 2000);

calculator.isPrime(1000).then((prime) => {
  if (prime) {
    console.log("1000 é primo.");
  } else {
    console.log("1000 não é primo.");
  }
});
