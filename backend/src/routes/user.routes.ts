import { Hono } from "hono";
import { loginUser, userSignup } from "../controllers/user.controller";
const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", userSignup);

userRouter.post("/login",loginUser );

export default userRouter;
