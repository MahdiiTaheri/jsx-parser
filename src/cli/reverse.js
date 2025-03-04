#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { convertJSONToJSX } from "../parser/reverse.js";

const reverseCommand = new Command("jsonToJsx");

reverseCommand
  .argument("<input>", "Path to a JSON file to convert to JSX/TSX")
  .option("-o, --output <dir>", "Output directory", "./jsx")
  .option("-e, --extension <ext>", "Output file extension (jsx or tsx)", "tsx")
  .action((inputPath, options) => {
    try {
      const jsonData = JSON.parse(fs.readFileSync(inputPath, "utf8"));
      const jsxCode = convertJSONToJSX(jsonData);

      const baseName = path.basename(inputPath, path.extname(inputPath));
      const outputFile = path.join(
        options.output,
        `${baseName}.${options.extension}`
      );

      fs.mkdirSync(options.output, { recursive: true });
      fs.writeFileSync(outputFile, jsxCode, "utf8");
      console.log(`✅ Successfully wrote JSX to ${outputFile}`);
    } catch (error) {
      console.error(`❌ Error converting JSON to JSX: ${error.message}`);
    }
  });

export default reverseCommand;
