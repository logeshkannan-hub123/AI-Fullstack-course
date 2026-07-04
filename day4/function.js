// function square(num) {
//   return num * num;
// }

// let number=5;
// const result = square(number);
// console.log(result);

// function greet(name, timeOfDay) {
//   return `Good ${timeOfDay}, ${name}!`;
// }

// const result2 = greet("John", "Morning");
// console.log(result2);

function countWordsInString(str) {
  let count = 0;
  let isWord = false;
  for (let i = 0; i < str.length; i++) {
    if (
      str[i] !== " " &&
      str[i] !== "." &&
      str[i] !== "," &&
      str[i] !== "!" &&
      str[i] !== "?" &&
      str[i] !== "\t" &&
      str[i] !== "\n" &&
      str[i] !== "`" &&
      str[i] !== "'" &&
      str[i] !== '"' &&
      str[i] !== "(" &&
      str[i] !== ")" &&
      str[i] !== ":" &&
      str[i] !== ";" &&
      str[i] !== "-" &&
      str[i] !== "_" &&
      str[i] !== "{" &&
      str[i] !== "}" &&
      str[i] !== "[" &&
      str[i] !== "]" &&
      str[i] !== "/" &&
      str[i] !== "\\" &&
      str[i] !== "|" &&
      str[i] !== "@" &&
      str[i] !== "#" &&
      str[i] !== "$" &&
      str[i] !== "%" &&
      str[i] !== "^" &&
      str[i] !== "&" &&
      str[i] !== "*" &&
      str[i] !== "+" &&
      str[i] !== "=" &&
      str[i] !== "<" &&
      str[i] !== ">" &&
      str[i] !== "~"
    ) {
      // console.log("str[i]:", str[i]);
      if (!isWord) {
        count++;
        // console.log("count:", count);
        isWord = true;
        // console.log("if - isWord:", isWord);
      }
    } else {
      isWord = false;
      //   console.log("else - isWord:", isWord);
    }
  }
  return count;
}

// let string = "Hi! i am learning fullstack with using Claude AI.";
// const result3 = countWordsInString(string);
// console.log("Total words in the string:", result3);

// let string2 = " Hi! i am learning fullstack with using Claude AI. ";
// console.log("Total words in the string2`:", countWordsInString(string2));

// let string3 = "";
// console.log("Total words in the string3:", countWordsInString(string3));

// let string4 = " ";
// console.log("Total words in the string4:", countWordsInString(string4));

let string4 =
  "hi,i am      logesh ` jdkfj \n sdfj sdfj \t sdfj` kjdfklsd?ndfklds dshfjsd-dsffsd";
console.log("Total words in the string4:", countWordsInString(string4));
