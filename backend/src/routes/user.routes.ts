import { Hono } from "hono";
import { loginUser, userSignup , verifyUser } from "../controllers/user.controller";
const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", userSignup);

userRouter.post("/login",loginUser );


userRouter.get('/verify' , verifyUser)

export default userRouter;
