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
import {
  basename,
  join,
  extname,
  resolve,
  relative,
  isAbsolute,
  sep,
} from "path";
import { platform } from "os";
import { watch } from "chokidar";
import { parseJSXToJSON } from "../parser/index";

const parseCommand = new Command("jsxToJson");
const SAFE_BASE_DIR = resolve(process.cwd()); // Ensure absolute path

// Unified path validation function
function validateSafePath(userPath: string, context: string = "path") {
  const resolvedPath = resolve(userPath);

  if (!isPathInside(resolvedPath, SAFE_BASE_DIR)) {
    console.error(
      `❌ Unsafe ${context}: ${resolvedPath} is outside allowed directory`
    );
    process.exit(1);
  }

  return resolvedPath;
}

// Enhanced path containment check
function isPathInside(child: string, parent: string): boolean {
  const relativePath = relative(parent, child);
  return Boolean(
    relativePath &&
      !relativePath.startsWith(`..${sep}`) &&
      !isAbsolute(relativePath)
  );
}

function ensureOutputDirectory(outputDir: string) {
  const validatedDir = validateSafePath(outputDir, "output directory");

  if (!existsSync(validatedDir))
    mkdirSync(validatedDir, { recursive: true, mode: 0o755 });

  if (platform() === "linux") chmodSync(validatedDir, 0o755);
}

// Updated processing functions with path validation
function processFile(filePath: string, outputDir: string, layout: string) {
  const validatedPath = validateSafePath(filePath, "input file");

  if (![".tsx", ".jsx"].includes(extname(validatedPath))) return;

  try {
    const code = readFileSync(validatedPath, "utf8");
    const jsonResult = parseJSXToJSON(code, layout);
    const outputName = `${basename(
      validatedPath,
      extname(validatedPath)
    )}.json`;
    const outputPath = join(outputDir, outputName);

    validateSafePath(outputPath, "output file");
    writeFileSync(outputPath, JSON.stringify(jsonResult, null, 2));
    console.log(`✅ Wrote ${outputPath}`);
  } catch (error) {
    if (error instanceof Error)
      console.error(`❌ Error processing ${validatedPath}: ${error.message}`);
  }
}

function processDirectory(dirPath: string, outputDir: string, layout: string) {
  const validatedDir = validateSafePath(dirPath, "input directory");

  readdirSync(validatedDir, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = join(validatedDir, dirent.name);

    if (dirent.isDirectory()) {
      processDirectory(fullPath, outputDir, layout);
    } else if (
      dirent.isFile() &&
      [".tsx", ".jsx"].includes(extname(fullPath))
    ) {
      processFile(fullPath, outputDir, layout);
    }
  });
}

parseCommand
  .argument("<input>", "Path to TSX/JSX file or directory")
  .option("-o, --output <dir>", "Output directory", "result/json-output")
  .option("-l, --layout <type>", "Set layout type", "default")
  .option("-w, --watch", "Watch for changes")
  .action((inputPath: string, options) => {
    const validatedInput = validateSafePath(inputPath, "input");

    ensureOutputDirectory(options.output);

    if (statSync(validatedInput).isDirectory())
      processDirectory(validatedInput, options.output, options.layout);
    else processFile(validatedInput, options.output, options.layout);

    if (options.watch) {
      const watcher = watch(validatedInput, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: true,
        followSymlinks: false,
      });

      watcher.on("change", (changedPath) => {
        validateSafePath(changedPath, "watched file");
        processFile(changedPath, options.output, options.layout);
      });
    }
  });

export default parseCommand;
