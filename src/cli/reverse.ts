#!/usr/bin/env bun
import { Command } from "commander";
import {
  existsSync,
  statSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "fs";
import { basename, join, extname } from "path";
import { convertJSONToJSX } from "../parser/reverse";

const reverseCommand = new Command("jsonToJsx");

function ensureOutputDirectory(outputDir: string) {
  try {
    if (!existsSync(outputDir)) {
      console.log(`📂 Creating output directory: ${outputDir}`);
      mkdirSync(outputDir, { recursive: true });
    }
  } catch (error) {
    if (error instanceof Error)
      console.error(`❌ Failed to create output directory: ${error.message}`);
  }
}

async function processFile(
  inputPath: string,
  outputDir: string,
  extension: string
) {
  try {
    if (!inputPath.endsWith(".json"))
      throw new Error(`Invalid file type: ${inputPath} must be a .json file`);

    const data = readFileSync(inputPath, "utf8");
    const jsx = await convertJSONToJSX(JSON.parse(data));

    const baseName = basename(inputPath, extname(inputPath));
    const outputPath = join(outputDir, `${baseName}.${extension}`);

    writeFileSync(outputPath, jsx, "utf8");
    console.log(`✅ Wrote JSX to ${outputPath}`);
  } catch (error) {
    if (error instanceof Error)
      console.error(`❌ Failed to process ${inputPath}: ${error.message}`);
  }
}

function processDirectory(
  dirPath: string,
  outputDir: string,
  extension: string
) {
  readdirSync(dirPath).forEach((file) => {
    const fullPath = join(dirPath, file);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) processDirectory(fullPath, outputDir, extension);
    else if (file.endsWith(".json"))
      processFile(fullPath, outputDir, extension);
  });
}

reverseCommand
  .argument("<input>", "Path to JSON file or directory of JSON files")
  .option("-o, --output <dir>", "Output directory", "results/jsx-output")
  .option("-e, --extension <ext>", "Output extension (jsx/tsx)", "tsx")
  .action((inputPath: string, options) => {
    const outputDir = options.output;
    const extension = options.extension;

    ensureOutputDirectory(outputDir);

    try {
      const stats = statSync(inputPath);

      if (stats.isFile()) processFile(inputPath, outputDir, extension);
      else if (stats.isDirectory())
        processDirectory(inputPath, outputDir, extension);
      else throw new Error(`Invalid input type: ${inputPath}`);
    } catch (error) {
      if (error instanceof Error) console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

export default reverseCommand;
