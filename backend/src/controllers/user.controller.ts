import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { signinUserSchema, signupInputSchema } from "@prash766/common-app";

const userSignup = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    let body = await c.req.json<{
      email: string;
      password: string;
      FullName: string;
    }>();
    body = signupInputSchema.parse(body);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        FullName: body.FullName,
      },
    });
    const token = await sign(
      {
        id: user.id,
        email: user.email,
      },
      c.env.JWT_SECRET
    );

    setCookie(c, "token", token);
    return c.json(
      {
        token: token,
        message: "User created successfully",
        user: user,
      },
      201
    );
  } catch (error: any) {
    console.log(error);
    return c.json(
      {
        success: false,
        message: error.errors[0].message || "Error occurred",
      },
      400
    );
  } finally {
    await prisma.$disconnect();
  }
};

const loginUser = async (c: Context) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    let body = await c.req.json<{
      email: string;
      password: string;
    }>();
    const { email, password } = signinUserSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (password !== user?.password)
      return c.json({
        message: "invalid Password",
      });
    const token = await sign(
      {
        id: user.id,
        email: user.email,
      },
      c.env.JWT_SECRET
    );

    setCookie(c, "token", token);
    return c.json(
      {
        success: true,
        message: "User logged in",
      },
      200
    );
  } catch (e) {
    console.log("eerorrrr");
    console.log(e);
    throw new HTTPException(400, {
      message: "Wrong Email or password",
    });
  }
};

export { userSignup, loginUser };
