#!/usr/bin/env node

import { Command } from "commander";
import parseCommand from "./parse.js";
import serverCommand from "./server.js";
import reverseCommand from "./reverse.js";

const program = new Command();

program
  .name("tsx-parser")
  .description("CLI for converting TSX/JSX components to JSON")
  .version("1.2.0");

program.addCommand(parseCommand);
program.addCommand(serverCommand);
program.addCommand(reverseCommand);

program.parse();
