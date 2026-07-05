function calculate(a, b, operator) {
  if (
    typeof a !== "number" ||
    typeof b !== "number" ||
    !Number.isFinite(a) ||
    !Number.isFinite(b)
  ) {
    return "Error: Both operands must be numbers";
  } else if (typeof operator !== "string") {
    return "Error: Operator must be a string";
  } else if (!["+", "-", "*", "/"].includes(operator)) {
    return "Error: Invalid operator. Please use +, -, *, or /";
  } else if (operator === "/" && b === 0) {
    return "Error: Division by zero is not allowed";
  } else {
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
    }
  }
}

console.log("Sample calculator", calculate(5, 3, "+"));
console.log("Sample calculator", calculate(5, 3, "-"));
console.log("Sample calculator", calculate(5, 3, "*"));
console.log("Sample calculator", calculate(5, 3, "/"));
console.log("Sample calculator", calculate(5, "zero", "/"));
console.log("Sample calculator", calculate(5, 0, "&"));
console.log("Sample calculator", calculate(NaN, 5, "+"));
console.log("Sample calculator", calculate(Infinity, 1, "+"));
