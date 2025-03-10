#!/usr/bin/env bun
import { Command } from "commander";
import {
  existsSync,
  mkdirSync,
  statSync,
  chmodSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from "fs";
import { basename, join, extname } from "path";
import { platform } from "os";
import { watch } from "chokidar";
import { parseJSXToJSON } from "../parser/index";

const parseCommand = new Command("jsxToJson");

function ensureOutputDirectory(outputDir: string) {
  try {
    if (!existsSync(outputDir)) {
      console.log(`📂 Creating output directory: ${outputDir}`);
      mkdirSync(outputDir, { recursive: true });
    }

    if (platform() === "linux") {
      const stats = statSync(outputDir);
      if (!(stats.mode & 0o222)) {
        console.log(`🔧 Fixing permissions for ${outputDir}...`);
        chmodSync(outputDir, stats.mode | 0o222);
        console.log(`✅ Permissions fixed for ${outputDir}`);
      }
    }
  } catch (error) {
    if (error instanceof Error)
      console.error(
        `❌ Failed to create or fix permissions for output directory: ${error.message}`
      );
  }
}

function ensureExecutablePermissions(filePath: string) {
  if (platform() !== "linux") return;

  try {
    const stats = statSync(filePath);
    if (!(stats.mode & 0o111)) {
      console.log(`🔧 Fixing permissions for ${filePath}...`);
      chmodSync(filePath, stats.mode | 0o111);
      console.log(`✅ Permissions fixed for ${filePath}`);
    }
  } catch (error) {
    if (error instanceof Error)
      console.error(`❌ Failed to fix permissions: ${error.message}`);
  }
}

function processFile(filePath: string, outputDir: string, layout: string) {
  try {
    if (![".tsx", ".jsx"].some((ext) => filePath.endsWith(ext)))
      throw new Error(`Unsupported file type: ${filePath}`);

    const code = readFileSync(filePath, "utf8");
    const jsonResult = parseJSXToJSON(code, layout);

    const baseName = basename(filePath, extname(filePath));
    const outputPath = join(outputDir, `${baseName}.json`);

    writeFileSync(outputPath, JSON.stringify(jsonResult, null, 2));
    console.log(`✅ Successfully wrote to ${outputPath}`);
  } catch (error) {
    if (error instanceof Error)
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

function processDirectory(dirPath: string, outputDir: string, layout: string) {
  const files = readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, outputDir, layout);
    } else if ([".tsx", ".jsx"].some((ext) => file.endsWith(ext))) {
      processFile(fullPath, outputDir, layout);
    }
  });
}

parseCommand
  .argument("<input>", "Path to a TSX/JSX file or directory")
  .option("-o, --output <dir>", "Output directory", "result/json-output")
  .option("-l, --layout <type>", "Set layout type", "default")
  .option("-w, --watch", "Watch for changes")
  .action((inputPath: string, options) => {
    const outputDir = options.output;
    const layout = options.layout;
    ensureOutputDirectory(outputDir);
    ensureExecutablePermissions(process.argv[1]);

    if (statSync(inputPath).isDirectory())
      processDirectory(inputPath, outputDir, layout);
    else processFile(inputPath, outputDir, layout);

    if (options.watch) {
      const watcher = watch(inputPath, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: true,
      });

      watcher.on("change", (filePath) => {
        console.log(`\n🔄 Detected changes in ${filePath}`);
        processFile(filePath, outputDir, layout);
      });
    }
  });

export default parseCommand;
