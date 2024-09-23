import { Hono } from "hono";
import {
  getAllBlogs,
  getBlog,
  getLikeInfo,
  getUserBlogs,
  increaseLike,
  newBlog,
  updateBlog,
  uploadByURL,
  uploadFile,
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
blogRouter.post("/uploadFile", uploadFile);
blogRouter.post("/fetchUrl", uploadByURL);

blogRouter.put("/update/:id", updateBlog);

blogRouter.get("/get/:id", getBlog);
blogRouter.put("/like", increaseLike);
blogRouter.get("/blogLikes/:id", getLikeInfo);
blogRouter.get("/userBlog", getUserBlogs);


export default blogRouter;
