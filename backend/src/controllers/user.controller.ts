import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign, verify } from "hono/jwt";
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
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      },
      c.env.JWT_SECRET
    );

    setCookie(c, "token", token,{
      path:'/',
      httpOnly:true,
      secure:c.env.ENV==='PRODUCTION',
      sameSite:'none'
    })
      
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
      },400);
    const token = await sign(
      {
        id: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      },
      c.env.JWT_SECRET
    );

    setCookie(c, "token", token,{
      path:'/',
      httpOnly:true,
      secure:c.env.ENV==='PRODUCTION',
      sameSite:'none'
      
    });
    return c.json(
      {
        success: true,
        message: "User logged in",
        user: user,
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

const verifyUser = async (c: Context) => {
  const cookieHeader = c.req.header("Cookie") || "";
  const token = cookieHeader.split("token=")[1];
  if (!token) {
    return c.json(
      {
        success: false,
        message: "Token not found",
      },
      400
    );
  }
  type DecodedToken = {
    id: string;
    email: string;
    exp?: number; // Optional expiration claim
  };
  try {
    const decodedToken = (await verify(
      token,
      c.env.JWT_SECRET
    )) as DecodedToken;
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const user = await prisma.user.findUnique({
      where: {
        email: decodedToken.email,
      },
    });
    return c.json(
      {
        success: true,
        message: "User is Authenticated",
        user: user,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Invalid Token",
      },
      400
    );
  }
};

const logoutUser = async (c: Context) => {
  setCookie(c, "token", "");
  return c.json(
    {
      success: true,
      message: "user logged out successfully",
    },
    200
  );
};

const updateUserInfo = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.parseBody();
    console.log(body);
    const userId = body.id as string;
    const image = body.avatar as File;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "ml_default");

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        console.log(cloudinaryResponse);
        throw new Error(
          `Cloudinary upload failed: ${cloudinaryResponse.statusText}`
        );
      }

      const result: any = await cloudinaryResponse.json();
      console.log(result);

      const insertData: any = {};
      if (body.FullName) insertData.FullName = body.FullName;
      if (result.secure_url) insertData.avatar = result.secure_url;

      const user = await prisma.user.update({
        where: { id: userId },
        data: insertData,
      });

      return c.json(
        {
          success: true,
          message: "User profile Updated",
          user: user,
        },
        200
      );
    } else {
      return c.json({ error: "No image provided" }, 400);
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export { userSignup, loginUser, verifyUser, logoutUser, updateUserInfo };
