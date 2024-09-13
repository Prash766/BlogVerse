import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { getCookie } from "hono/cookie";

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

type jwtPayload = {
  id: string;
  email: string;
};

const verifyJWT = async (c: AppContext, next: Next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const token = getCookie(c, "token") || "";
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
};


export{
    verifyJWT
}