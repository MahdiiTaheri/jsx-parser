import { Hono } from "hono";
import { serve } from '@hono/node-server'
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { parseJSXToJSON } from "./parser/index";
import { convertJSONToJSX } from "./parser/reverse";
import * as dotenv from "dotenv";

const app = new Hono();
dotenv.config();
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || "3001", 10);

app.use("*", cors()); // Allow all origins by default
app.use(logger());

app.post("/jsx-to-json", async (c) => {
  try {
    const body = await c.req.text();
    const jsonResult = parseJSXToJSON(body);
    return c.json(jsonResult, 200);
  } catch (error) {
    console.log(error);
    return c.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      400
    );
  }
});

app.post("/json-to-jsx", async (c) => {
  try {
    const body = await c.req.json();
    const jsxResult = convertJSONToJSX(body);
    return c.text(jsxResult);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      400
    );
  }
});

serve({
  fetch: app.fetch,
  port: BACKEND_PORT,
})

// export default app;
