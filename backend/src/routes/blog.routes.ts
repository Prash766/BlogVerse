import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { Context } from "hono";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRouter.get("/blog", async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blog = await prisma.post.findMany({});

  return c.json({
    success: true,
    message: "All the blogs fetched",
    blog: blog,
  });
});
blogRouter.post("/newBlog", async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json<{
    title: string;
    content: string;
    published: true;
    authorId: string;
  }>();
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      published: body.published,
      author: {
        connect: {
          id: body.authorId,
        },
      },
    },
  });

  return c.json(
    {
      success: true,
      message: "New post created",
    },
    200
  );
});

blogRouter.put("/blog/:id", async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { id } = c.req.param();
  const { title, content, published } = await c.req.json<{
    title?: string;
    content?: string;
    published?: boolean;
  }>();

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (published !== undefined) updateData.published = published;

  const blog = await prisma.post.update({
    where: {
      id: id,
    },
    data: updateData,
  });

  return c.json(
    {
      success: true,
      message: "Blog upated successfully",
      blog: blog,
    },
    200
  );
});

blogRouter.get("/blog/:id", async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { id } = c.req.param();

  const blog = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  return c.json({
    success: true,
    blog: blog,
  });
});

export default blogRouter;
