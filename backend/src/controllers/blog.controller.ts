import {
  updatePostSchema,
} from "@prash766/common-app";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import axios from "axios";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import * as cheerio from "cheerio";

interface UpdateProfile {
  FullName: string;
  userId: string;
  avatar: File;
}

const newBlog = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.parseBody();
  const image = body.postImage as File;
  const description = body.description as string;
  const content = body.content as string;
  const title = body.title as string;
  const authorId = body.authorId as string;
  let blogCoverImage = "";

  if (image) {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!res.ok) {
      console.log(res);
      throw new HTTPException(400, {
        message: `Image upload Failed ${res.statusText}`,
      });
    }
    const result: any = await res.json();
    console.log(result);
    blogCoverImage = result.secure_url;
  }

  const [blog, user] = await Promise.all([
    prisma.post.create({
      data: {
        title: title,
        content: content,
        published: true,
        description: description,
        postImage: blogCoverImage,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    }),
    prisma.user.findUnique({
      where: {
        id: authorId,
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

  const userInfo = c.get("user");
  if (!userInfo) {
    return c.json({ success: false, message: "User not authorized" }, 401);
  }

  let cursor = c.req.query("cursor") || null;
  const pageSize = 10;
  if (!cursor || cursor === "null" || cursor === "") {
    cursor = null;
  }
  const [blogs, likedPosts] = await Promise.all([
    prisma.post.findMany({
      take: pageSize,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: {
        createdAt: "desc",
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
        authorId: userInfo.id,
      },
      select: {
        postId: true,
        isLiked: true,
      },
    }),
  ]);

  const likedPostsMap = new Map(
    likedPosts.map((post) => [post.postId, post.isLiked])
  );

  const blogsWithLikes = blogs.map((blog) => ({
    ...blog,
    isLiked: likedPostsMap.get(blog.id) ?? false,
  }));
  const nextCursor =
    blogs.length === pageSize ? blogs[blogs.length - 1].id : null;

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
      message: "Blog wasnt updated",
    });
  }
};

const getBlog = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { id } = c.req.param();
  const userId = c.get("user");

  const [blog, blogsLiked] = await Promise.all([
    prisma.post.findUnique({
      where: {
        id: id,
      },
    }),
    prisma.postLiked.findUnique({
      where: {
        authorId_postId: {
          authorId: userId.id,
          postId: id,
        },
      },
    }),
  ]);
  const isBlogLiked = blogsLiked ? blogsLiked.isLiked : false
  return c.json({
    success: true,
    blog: blog,
    blogsLiked,
    isBlogLiked
    
  });
};

const increaseLike = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { blogId } = await c.req.json();
  const userInfo = c.get("user");

  try {
    const existingLike = await prisma.postLiked.findUnique({
      where: {
        authorId_postId: {
          authorId: userInfo.id,
          postId: blogId,
        },
      },
    });

    if (existingLike && existingLike.isLiked) {
      const [updatedBlog, updatedBlogLike] = await Promise.all([
        prisma.post.update({
          where: { id: blogId },
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

      // Ensure like count doesn't go negative
      if (updatedBlog.like < 0) {
        updatedBlog.like = 0;
        await prisma.post.update({
          where: { id: blogId },
          data: { like: 0 },
        });
      }

      return c.json(
        {
          success: true,
          blog: updatedBlog,
          postLiked: updatedBlogLike,
        },
        200
      );
    } else {
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
    return c.json({ success: false, error: "Failed to update like" }, 500);
  }
};

const getLikeInfo = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { id } = c.req.param();
  const user = c.get("user");

  const [blogLikeCount, blogIsLiked] = await Promise.all([
    prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        like: true,
      },
    }),
    prisma.postLiked.findUnique({
      where: {
        authorId_postId: {
          authorId: user.id,
          postId: id,
        },
      },
    }),
  ]);

  return c.json(
    {
      success: true,
      like: blogLikeCount,
      isLiked: blogIsLiked,
    },
    200
  );
};

const uploadFile = async (c: Context) => {
  try {
    const formData = await c.req.parseBody();

    const image = formData.image as File;
    if (!image) {
      throw new HTTPException(404, {
        message: "File wasnt found",
      });
    }
    if (image) {
      const form = new FormData();
      form.append("file", image);
      form.append("upload_preset", "ml_default"); // Correct spelling
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      console.log(res);
      if (!res.ok) {
        console.log(res);
        throw new HTTPException(400, {
          message: "File wasnt Uploaded , Something went wrong",
        });
      }

      const result: any = await res.json();
      const imageUrl = result.secure_url;
      return c.json({
        success: 1,
        file: {
          url: imageUrl,
        },
      });
    }
  } catch (error) {
    console.log(error);

    return c.json({
      success: false,
      message: "something went wrong",
    });
  }
};

const uploadByURL = async (c: Context) => {
  const { url } = await c.req.json();
  if (!url)
    throw new HTTPException(400, {
      message: "No URL provided",
    });
  return c.json(
    {
      success: 1,
      file: {
        url: url,
      },
    },
    200
  );
};


const isValidUrl = (url:string) => {
  const regex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i; // Basic URL regex
  return regex.test(url);
};

const linkFetching = async (c: Context) => {
  const url = c.req.query('url')
  
  if (!url) throw new HTTPException(400, { message: "No URL provided" });
  
  if (!isValidUrl(url)) {
    throw new HTTPException(400, { message: "Invalid or untrusted URL" });
  }

  try {
    const response = await axios.get(url, { timeout: 5000 }); // 5-second timeout
    const html = response.data;

    const $ = cheerio.load(html);
    const title = $('head title').text() || '';
    const description = $('meta[name="description"]').attr('content') || '';
    const imageUrl = $('meta[property="og:image"]').attr('content') || '';

    return c.json({
      success: 1,
      link: url,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    }, 200);
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: "Error fetching link data" });
  }
};


const getUserBlogs = async(c:Context)=>{
  const prisma = new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL
  }).$extends(withAccelerate())
  const user = c.get('user')
  const blogs = await prisma.post.findMany({
    where:{
      authorId:user.id

    }, 
    select:{
      id:true,
      title:true,
      description:true,
      postImage:true,
      like:true,
      createdAt:true

    },
    orderBy:{
      createdAt: 'desc'
    }
  })
  
return c.json({
  success:true,
  blogs
}, 200)


}


export {
  newBlog,
  getAllBlogs,
  updateBlog,
  getBlog,
  increaseLike,
  getLikeInfo,
  uploadFile,
  uploadByURL,
  linkFetching,
  getUserBlogs
};
