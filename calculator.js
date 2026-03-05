class Calculator {
  async isPrime(number) {
    let divider = number - 1;
    let prime = true;

    while (divider >= 2) {
      if (number % divider === 0) {
        prime = false;
      }

      divider = divider - 1;
    }

    return prime;
  }
}

export default Calculator;
