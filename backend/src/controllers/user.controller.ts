import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from 'hono'
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
PrismaClient

const userSignup= async (c: Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const body = await c.req.json<{
        email: string;
        password: string;
        FullName: string;
      }>();
  
     const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          FullName: body.FullName,
        },
      });
      const token = await sign({
          id:user.id,
          email:user.email
      }, 
      c.env.JWT_SECRET
  )
  
  setCookie(c , "token" , token)
      return c.json({
          token:token,
           message: "User created successfully",
           user:user
          
          }
           , 201);
    } catch (error) {
      return c.json(
        { error: "Failed to create user" },
        500
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  const loginUser = async (c: Context) => {
 
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
          }).$extends(withAccelerate());
      const { email, password } = await c.req.json<{
        email: string;
        password: string;
      }>();
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
        console.log("eerorrrr")
        console.log(e)
      throw new HTTPException(400, {
        message: "Wrong Email or password",
      });
    }
  }



export {
    userSignup,
    loginUser
}
