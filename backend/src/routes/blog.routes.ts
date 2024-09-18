import { Hono } from "hono";
import {
  getAllBlogs,
  getBlog,
  increaseLike,
  newBlog,
  updateBlog,
} from "../controllers/blog.controller";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    CLOUDINARY_NAME:string;
    CLOUDINARY_API_KEY:string;
    CLOUDINARY_API_SECRET:string;
  };
}>();

blogRouter.get("/allBlogs", getAllBlogs);
blogRouter.post("/newBlog", newBlog);

blogRouter.put("/blog/:id", updateBlog);

blogRouter.get("/blog/:id", getBlog);
blogRouter.post("/blog/like", increaseLike);

export default blogRouter;
