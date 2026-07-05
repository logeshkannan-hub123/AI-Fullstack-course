function celsiusToFahrenheit(celsius) {
  if (typeof celsius !== "number" || isNaN(celsius)) {
    throw new Error("Input must be a valid number");
  }
  return Math.round(((celsius * 9) / 5 + 32) * 100) / 100; // rounded to 2 decimals
}

console.log("Temperature Converter", celsiusToFahrenheit(36.5555));
