function filterEvenNumbersInArray(arr) {
  if (!Array.isArray(arr)) {
    return "Error: Input must be an array";
  }
  let evenNumbers = [];
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== "number" || !Number.isFinite(arr[i])) {
      return "Error: All elements in the array must be valid numbers";
    } else if (arr[i] % 2 === 0) {
      evenNumbers.push(arr[i]);
    }
  }
  let lengthofEvenNumbers = evenNumbers.length;
  console.log("Even numbers in the array:", evenNumbers);
  console.log("Length of original array:", arr.length);
  return lengthofEvenNumbers;
}

let numbersArray = [7, 3, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 19, 20];
const evenNumbers = filterEvenNumbersInArray(numbersArray);
console.log("Original array:", numbersArray);
console.log("Even numbers in the array length:", evenNumbers);
console.log("Original array after filtering:", numbersArray);
