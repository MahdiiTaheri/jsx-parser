#!/usr/bin/env node

import { Command } from "commander";
import { parseJSXToJSON } from "./index.js";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";

const program = new Command();

program
  .name("tsx-parser")
  .description("CLI for converting TSX/JSX components to JSON")
  .version("1.0.0");

program
  .command("parse <input>")
  .description("Parse a single TSX/JSX file or all files in a directory")
  .option("-o, --output <dir>", "Output directory", "./outputs")
  .option("-l, --layout <type>", "Set layout type", "default")
  .option("-w, --watch", "Watch for changes")
  .action((inputPath, options) => {
    const outputDir = options.output || "./outputs";

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const processFile = (filePath) => {
      try {
        if (![".tsx", ".jsx"].some((ext) => filePath.endsWith(ext)))
          throw new Error(`Unsupported file type: ${filePath}`);

        const code = fs.readFileSync(filePath, "utf8");
        const jsonResult = parseJSXToJSON(code, options.layout);

        const baseName = path.basename(filePath, path.extname(filePath));
        const outputPath = path.join(outputDir, `${baseName}.json`);

        fs.writeFileSync(outputPath, JSON.stringify(jsonResult, null, 2));
        console.log(`✅ Successfully wrote to ${outputPath}`);
      } catch (error) {
        console.error(`❌ Error processing ${filePath}: ${error.message}`);
      }
    };

    const processDirectory = (dirPath) => {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          processDirectory(fullPath);
        } else if ([".tsx", ".jsx"].some((ext) => file.endsWith(ext))) {
          processFile(fullPath);
        }
      });
    };

    if (fs.statSync(inputPath).isDirectory()) processDirectory(inputPath);
    else processFile(inputPath);

    if (options.watch) {
      const watcher = chokidar.watch(inputPath, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: true,
      });

      watcher.on("change", (filePath) => {
        console.log(`\n🔄 Detected changes in ${filePath}`);
        processFile(filePath);
      });
    }
  });

program.parse();
