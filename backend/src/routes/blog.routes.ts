import { Hono } from "hono";
import {
  getAllBlogs,
  getBlog,
  newBlog,
  updateBlog,
} from "../controllers/blog.controller";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRouter.get("/blog", getAllBlogs);
blogRouter.post("/newBlog", newBlog);

blogRouter.put("/blog/:id", updateBlog);

blogRouter.get("/blog/:id", getBlog);

export default blogRouter;
