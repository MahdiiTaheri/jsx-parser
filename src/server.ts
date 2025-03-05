import { Hono } from "hono";
import { logger } from "hono/logger";
import { parseJSXToJSON } from "./parser/index";
import { convertJSONToJSX } from "./parser/reverse";

const app = new Hono();

app.use(logger());

app.post("/jsx-to-json", async (c) => {
  try {
    const body = await c.req.text();
    const jsonResult = parseJSXToJSON(body);
    return c.json(jsonResult, 200);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Unknown error" }, 400);
  }
});

app.post("/json-to-jsx", async (c) => {
  try {
    const body = await c.req.json();
    const jsxResult = convertJSONToJSX(body);
    return c.text(jsxResult);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Unknown error" }, 400);
  }
});

export default app;
