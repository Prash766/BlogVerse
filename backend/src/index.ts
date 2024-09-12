import { Context, Hono } from "hono";

import blogRouter from "./routes/blog.routes";
import userRouter from "./routes/user.routes";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { JWTPayload } from "hono/utils/jwt/types";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

type jwtPayload = {
  id: string;
  email: string;
};
interface CustomRequest {
  user?: {
    id: string;
    email: string;
    FullName: string;
  };
}

type AppContext = Context<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}> & { req: CustomRequest };

app.use("/api/v1/blog/*", async (c: AppContext, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const token = c.req.header("token") || "";
  const deodedToken = (await verify(token, c.env.JWT_SECRET)) as jwtPayload;
  const user = await prisma.user.findUnique({
    where: {
      id: deodedToken.id,
    },
    select: {
      email: true,
      FullName: true,
      id: true,
    },
  });

  if (!user) {
    return c.json(
      {
        success: "user not authorized",
      },
      400
    );
  }
  c.req.user = {
    id: user.id,
    email: user.email,
    FullName: user.FullName,
  };

  await next();
});

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
