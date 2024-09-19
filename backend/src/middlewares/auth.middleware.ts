import { Context, HonoRequest, Next } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { getCookie } from "hono/cookie";

// interface CustomRequest extends HonoRequest {
//   user?: {
//     id: string;
//     email: string;
//     FullName: string;
//     avatar:string | null;
//   };
// }

//  type AppContext = Context<{
//   Bindings: { DATABASE_URL: string; JWT_SECRET: string };
// }> & { req: CustomRequest };

// const verifyJWT = async (c: AppContext, next: Next) => {

//   now this is another approach of setting a custom key value pair to context by defining custom 
//   request and then custom AppContext but if this is the approach that you want to use , u need to export this AppContext and use it everywhere 
//   you want to use this c.req.user otherwise best is to use the get function on the context object 

type jwtPayload = {
  id: string;
  email: string;
};

const verifyJWT = async (c: Context, next: Next) => {
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
      avatar:true
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
  const User= {
    id:user.id,
    FullName: user.FullName,
    email:user.email,
    avatar:user.avatar
  }
  c.set('user' , User)

  await next();
};


export{
    verifyJWT
}