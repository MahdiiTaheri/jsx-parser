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
import { basename, join, extname, resolve, relative } from "path";
import { platform } from "os";
import { watch } from "chokidar";
import { parseJSXToJSON } from "../parser/index";

const parseCommand = new Command("jsxToJson");

// Helper function to check if 'child' is within 'parent' directory.
function isPathInside(child: string, parent: string): boolean {
  const relativePath = relative(parent, child);
  // If the relative path starts with ".." or is absolute, it's outside of 'parent'.
  return !!relativePath && !relativePath.startsWith("..") && !resolve(relativePath).startsWith("..");
}

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

function ensureExecutablePermissions(filePath: string, safeBase: string = process.cwd()) {
  // Resolve the file path to an absolute path.
  const resolvedPath = resolve(filePath);
  
  // Check that the resolved path is within the safe base directory.
  if (!isPathInside(resolvedPath, resolve(safeBase))) {
    console.error(`❌ Unsafe file path: ${resolvedPath} is outside of allowed directory ${safeBase}`);
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
