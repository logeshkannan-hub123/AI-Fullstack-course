function greet(name) {
  if (!name) {
    throw new Error("name is required");
  }
  return `Hi, ${name}!`;
}

module.exports = { greet };
