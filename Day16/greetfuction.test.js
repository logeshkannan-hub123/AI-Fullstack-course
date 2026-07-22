const { greet } = require("./greet.js");

describe("greet", () => {
  it("Greet function should return the provided name", () => {
    const name = "Logesh";
    const greetMessage = "Hi, Logesh!";
    expect(greet(name)).toBe(greetMessage);
  });

  it("should throw an error if name is not provided", () => {
    expect(() => greet()).toThrow("name is required");
  });
});
