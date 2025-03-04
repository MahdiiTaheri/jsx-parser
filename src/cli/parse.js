import { Command } from "commander";
import fs from "fs";
import path from "path";
import os from "os";
import chokidar from "chokidar";
import { parseJSXToJSON } from "../parser/index.js";

const parseCommand = new Command("parse");

function ensureOutputDirectory(outputDir) {
  try {
    if (!fs.existsSync(outputDir)) {
      console.log(`📂 Creating output directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (os.platform() === "linux") {
      const stats = fs.statSync(outputDir);
      if (!(stats.mode & 0o222)) {
        console.log(`🔧 Fixing permissions for ${outputDir}...`);
        fs.chmodSync(outputDir, stats.mode | 0o222);
        console.log(`✅ Permissions fixed for ${outputDir}`);
      }
    }
  } catch (error) {
    console.error(
      `❌ Failed to create or fix permissions for output directory: ${error.message}`
    );
  }
}

function ensureExecutablePermissions(filePath) {
  if (os.platform() !== "linux") return;

  try {
    const stats = fs.statSync(filePath);
    if (!(stats.mode & 0o111)) {
      console.log(`🔧 Fixing permissions for ${filePath}...`);
      fs.chmodSync(filePath, stats.mode | 0o111);
      console.log(`✅ Permissions fixed for ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Failed to fix permissions: ${error.message}`);
  }
}

function processFile(filePath, outputDir, layout) {
  try {
    if (![".tsx", ".jsx"].some((ext) => filePath.endsWith(ext)))
      throw new Error(`Unsupported file type: ${filePath}`);

    const code = fs.readFileSync(filePath, "utf8");
    const jsonResult = parseJSXToJSON(code, layout);

    const baseName = path.basename(filePath, path.extname(filePath));
    const outputPath = path.join(outputDir, `${baseName}.json`);

    fs.writeFileSync(outputPath, JSON.stringify(jsonResult, null, 2));
    console.log(`✅ Successfully wrote to ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

function processDirectory(dirPath, outputDir, layout) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, outputDir, layout);
    } else if ([".tsx", ".jsx"].some((ext) => file.endsWith(ext))) {
      processFile(fullPath, outputDir, layout);
    }
  });
}

parseCommand
  .argument("<input>", "Path to a TSX/JSX file or directory")
  .option("-o, --output <dir>", "Output directory", "./outputs")
  .option("-l, --layout <type>", "Set layout type", "default")
  .option("-w, --watch", "Watch for changes")
  .action((inputPath, options) => {
    const outputDir = options.output;
    const layout = options.layout;
    ensureOutputDirectory(outputDir);
    ensureExecutablePermissions(process.argv[1]);

    if (fs.statSync(inputPath).isDirectory())
      processDirectory(inputPath, outputDir, layout);
    else processFile(inputPath, outputDir, layout);

    if (options.watch) {
      const watcher = chokidar.watch(inputPath, {
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
