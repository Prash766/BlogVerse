import { Context, Hono } from "hono";

import blogRouter from "./routes/blog.routes";
import userRouter from "./routes/user.routes";
import { errorMiddleware } from "./middlewares/error";
import { verifyJWT } from "./middlewares/auth.middleware";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("/api/v1/blog/*", verifyJWT);

app.get("/", (c: Context) => c.text("hello this is the main route"));
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/user", userRouter);

app.onError(errorMiddleware);

export default app; 
