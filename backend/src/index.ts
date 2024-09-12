import { Context, Hono } from "hono";

import blogRouter from "./routes/blog.routes";
import userRouter from "./routes/user.routes";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get("/", (c: Context) => c.text("hello this is the main route"));
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/user", userRouter);

app.onError((err, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: true,
        error: err,
      },
      400
    );
  }
  return c.json(
    {
      success: true,
      message: "Something went wrong",
    },
    500
  );
});

export default app;
