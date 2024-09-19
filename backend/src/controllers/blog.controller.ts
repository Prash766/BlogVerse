import {
  createPostSchema,
  updatePost,
  updatePostSchema,
} from "@prash766/common-app";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { encodeBase64 } from "hono/utils/encode";

interface UpdateProfile {
  FullName: string;
  userId: string;
  avatar: File;
}

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
      cursor: blog.id,
    },
    200
  );
};

const getAllBlogs = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Get the current user from the request
  const userInfo = c.get('user');
  if (!userInfo) {
    return c.json({ success: false, message: "User not authorized" }, 401);
  }

  let cursor = c.req.query("cursor") || null;
  const pageSize = 10;
  if (!cursor || cursor === "null" || cursor === "") {
    cursor = null;
  }

  // Fetch blogs and liked posts by the current user
  const [blogs, likedPosts] = await Promise.all([
    prisma.post.findMany({
      take: pageSize,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}), // Apply skip and cursor only when cursor exists
      orderBy: {
        createdAt: "desc", // Ensure latest blogs come first
      },
      include: {
        author: {
          select: {
            id: true,
            FullName: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.postLiked.findMany({
      where: {
        authorId: userInfo.id, // Fetch the posts liked by the current user
      },
      select: {
        postId: true,
        isLiked: true,
      },
     
    }),
  ]);

  const likedPostsMap = new Map(likedPosts.map(post => [post.postId, post.isLiked]));

  const blogsWithLikes = blogs.map((blog) => ({
    ...blog,
    isLiked: likedPostsMap.get(blog.id) ?? false,
  }));
  const nextCursor = blogs.length === pageSize ? blogs[blogs.length - 1].id : null;

  return c.json({
    success: true,
    message: "All the blogs fetched",
    blog: blogsWithLikes,
    cursor: nextCursor,
    currentBlogsLength: blogs.length,
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
        cursor: blog.id,
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

const increaseLike = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { blogId } = await c.req.json();
  const userInfo = c.get("user");

  try {
    console.log("CHECKING THE BLOG ID" , blogId)
    const existingLike = await prisma.postLiked.findUnique({
      where: {
        authorId_postId: {
          authorId: userInfo.id,
          postId: blogId,
        },
      },
    });
    console.log("here the liked before UPDATING",existingLike?.isLiked)
    if (existingLike && existingLike.isLiked) {
      const [updatedBlog, updatedBlogLike] = await Promise.all([
        prisma.post.update({
          where: {
            id: blogId,
          },
          data: {
            like: {
              decrement: 1,
            },
          },
        }),
        prisma.postLiked.update({
          where: {
            authorId_postId: {
              authorId: userInfo.id,
              postId: blogId,
            },
          },
          data: {
            isLiked: false,
          },
        }),
      ]);
      console.log("After update THE UPDATED BLOG LIKE",updatedBlogLike.isLiked)
      return c.json(
        {
          success: true,
          blog: updatedBlog,
          postLiked: updatedBlogLike,
        },
        200
      );
    } else {
      console.log("the else part where the value is false" , existingLike?.isLiked)
      const [updatedBlog, updatedBlogLiked] = await Promise.all([
        prisma.post.update({
          where: { id: blogId },
          data: { like: { increment: 1 } },
        }),
        prisma.postLiked.upsert({
          where: { authorId_postId: { authorId: userInfo.id, postId: blogId } },
          update: { isLiked: true },
          create: { authorId: userInfo.id, postId: blogId, isLiked: true },
        }),
      ]);
      console.log(" else part - AFTER UPDATING  the post " , updatedBlogLiked.isLiked)
      return c.json(
        {
          success: true,
          blog: updatedBlog,
          postLiked: updatedBlogLiked,
        },
        200
      );
    }
  } catch (error) {
    console.log(error);
  }
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

export {
  newBlog,
  getAllBlogs,
  updateBlog,
  getBlog,
  increaseLike,
  updateUserInfo,
};
