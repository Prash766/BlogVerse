import { Hono } from "hono";
import { loginUser, logoutUser, userSignup , verifyUser } from "../controllers/user.controller";
import { updateUserInfo } from "../controllers/blog.controller";
const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    CLOUDINARY_NAME:string,
    CLOUDINARY_API_KEY:string,
    CLOUDINARY_API_SECRET:string 
  };
}>();

userRouter.post("/signup", userSignup);

userRouter.post("/login",loginUser );
userRouter.get("/logout" , logoutUser )
userRouter.post('/updateProfile' , updateUserInfo)

userRouter.get('/verify' , verifyUser)

export default userRouter;
