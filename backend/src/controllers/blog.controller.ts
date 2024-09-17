import { createPostSchema, updatePostSchema } from "@prash766/common-app";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

const newBlog = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  let body = await c.req.json<{
    title: string;
    content: string;
    published: boolean;
    authorId: string;
  }>();
  body = createPostSchema.parse(body);

  const [blog, user] = await Promise.all([
    prisma.post.create({
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
    }),
    prisma.user.findUnique({
      where: {
        id: body.authorId,
      },
      select: {
        FullName: true,
      },
    }),
  ]);

  return c.json(
    {
      success: true,
      message: "New post created",
      blog: {
        ...blog,
        author: user,
      },
    },
    200
  );
};

const getAllBlogs = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blog = await prisma.post.findMany({
    include:{
      author:{
        select:{
          id:true,
          FullName:true,
          email:true
        }
      }
    }
  });

  return c.json({
    success: true,
    message: "All the blogs fetched",
    blog: blog,
  });
};

const updateBlog = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const { id } = c.req.param();
    const body = await c.req.json<{
      title?: string;
      content?: string;
      published?: boolean;
    }>();

    const { title, content, published } = updatePostSchema.parse(body);

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
  } catch (error: any) {
    return c.json({
      message: error.errors[0].message || "Blog wasnt updated",
    });
  }
};

const getBlog = async (c: Context) => {
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
};

export { newBlog, getAllBlogs, updateBlog, getBlog };
