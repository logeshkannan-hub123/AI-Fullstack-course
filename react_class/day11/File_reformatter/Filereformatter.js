import { readFile, writeFile } from "node:fs/promises";

async function sortNames() {
  try {
    // Read the input file
    const fileData = await readFile("input.txt", "utf8");

    // Check if the file is empty
    if (fileData.trim() === "") {
      console.log("input.txt is empty.");

      await writeFile("output.txt", "", "utf8");

      console.log("Created an empty output.txt");
      return;
    }

    // Split into lines, remove empty lines, trim spaces
    const names = fileData
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    // Check if no valid names exist
    if (names.length === 0) {
      console.log("No valid names found in input.txt.");

      await writeFile("output.txt", "", "utf8");

      return;
    }

    // Sort alphabetically
    names.sort((a, b) => a.localeCompare(b));

    // Convert array back to string
    const outputData = names.join("\n");

    // Write to output file
    await writeFile("output.txt", outputData, "utf8");

    console.log("Names sorted successfully.");
    console.log(`Total names: ${names.length}`);
    console.log("Sorted names written to output.txt");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Error: input.txt was not found.");
    } else if (error.code === "EACCES") {
      console.log("Error: Permission denied.");
    } else {
      console.log("Unexpected Error:", error.message);
    }
  }
}

sortNames();
