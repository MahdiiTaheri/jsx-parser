import { Command } from "commander";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { parseJSXToJSON } from "../parser/index.js";

const serverCommand = new Command("server");

serverCommand
  .description("Start the HTTP server for remote parsing")
  .option("-p, --port <number>", "Port number", "3000")
  .action((options) => {
    const app = new Hono();

    app.post("/parse", async (c) => {
      try {
        const body = await c.req.text();
        const jsonResult = parseJSXToJSON(body);
        return c.json(jsonResult, 200);
      } catch (error) {
        return c.json({ error: error.message }, 400);
      }
    });

    const port = parseInt(options.port, 10);
    serve(
      {
        fetch: app.fetch,
        port,
      },
      (serverInfo) =>
        console.log(`🚀 Server running on port ${serverInfo.port}`)
    );
  });

export default serverCommand;
