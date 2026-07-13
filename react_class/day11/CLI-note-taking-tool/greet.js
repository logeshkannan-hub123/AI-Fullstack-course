import { writeFile } from "node:fs/promises";

async function CLINoteTakingTool() {
  try {
    const name = process.argv.slice(2).join(" ").trim();
    console.log("name", name);

    if (!name) {
      console.log("Usage: node file.js <name>");
      return;
    }

    console.log(`Hello, ${name}!`);

    await writeFile("output.txt", `Hello, ${name}`, "utf8");

    console.log("Written to output.txt");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

process.on("SIGINT", () => {
  console.log("\nProgram cancelled.");
  process.exit(0);
});

CLINoteTakingTool();
