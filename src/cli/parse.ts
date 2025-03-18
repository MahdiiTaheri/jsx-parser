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
import { basename, join, extname, resolve, relative, isAbsolute } from "path";
import { platform } from "os";
import { watch } from "chokidar";
import { parseJSXToJSON } from "../parser/index";

const parseCommand = new Command("jsxToJson");

// Define a safe base directory (for example, the current working directory).
const SAFE_BASE_DIR = process.cwd();

// Helper function to check if 'child' is inside 'parent'
function isPathInside(child: string, parent: string): boolean {
  const relativePath = relative(parent, child);
  // If the relative path starts with ".." or is absolute, then it's outside.
  return !relativePath.startsWith("..") && !isAbsolute(relativePath);
}

function ensureOutputDirectory(
  outputDir: string,
  safeBase: string = SAFE_BASE_DIR
) {
  try {
    const resolvedOutputDir = resolve(outputDir);
    if (!isPathInside(resolvedOutputDir, resolve(safeBase))) {
      console.error(
        `❌ Unsafe output directory: ${resolvedOutputDir} is outside of allowed directory ${safeBase}`
      );
      process.exit(1);
    }

    if (!existsSync(resolvedOutputDir)) {
      console.log(`📂 Creating output directory: ${resolvedOutputDir}`);
      mkdirSync(resolvedOutputDir, { recursive: true });
    }

    if (platform() === "linux") {
      const stats = statSync(resolvedOutputDir);
      if (!(stats.mode & 0o222)) {
        console.log(`🔧 Fixing permissions for ${resolvedOutputDir}...`);
        chmodSync(resolvedOutputDir, stats.mode | 0o222);
        console.log(`✅ Permissions fixed for ${resolvedOutputDir}`);
      }
    }
  } catch (error) {
    if (error instanceof Error)
      console.error(
        `❌ Failed to create or fix permissions for output directory: ${error.message}`
      );
  }
}

function ensureExecutablePermissions(
  filePath: string,
  safeBase: string = SAFE_BASE_DIR
) {
  const resolvedPath = resolve(filePath);

  if (!isPathInside(resolvedPath, resolve(safeBase))) {
    console.error(
      `❌ Unsafe file path: ${resolvedPath} is outside of allowed directory ${safeBase}`
    );
    return;
  }

  if (platform() !== "linux") return;

  try {
    const stats = statSync(resolvedPath);
    if (!(stats.mode & 0o111)) {
      console.log(`🔧 Fixing permissions for ${resolvedPath}...`);
      chmodSync(resolvedPath, stats.mode | 0o111);
      console.log(`✅ Permissions fixed for ${resolvedPath}`);
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
