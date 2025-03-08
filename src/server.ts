import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { parseJSXToJSON } from "./parser/index";
import { convertJSONToJSX } from "./parser/reverse";

const app = new Hono();

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

export default app;
