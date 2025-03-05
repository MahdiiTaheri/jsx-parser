#!/usr/bin/env bun
import { Command } from "commander";
import parseCommand from "./parse";
import reverseCommand from "./reverse";

const program = new Command();

program
  .name("tsx-parser")
  .description("CLI for converting TSX/JSX components to JSON")
  .version("1.3.0");

program.addCommand(parseCommand);
program.addCommand(reverseCommand);

program.parse();
