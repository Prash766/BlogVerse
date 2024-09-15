import { Context, Hono, Next } from "hono";

import blogRouter from "./routes/blog.routes";
import userRouter from "./routes/user.routes";
import { errorMiddleware } from "./middlewares/error";
import { verifyJWT } from "./middlewares/auth.middleware";
import {cors} from 'hono/cors'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    FRONTEND_URL:string
  };
}>();

app.use('/api/v1/*' , async(c:Context , next:Next)=>{
  const corsMiddleware = cors({
    origin:c.env.FRONTEND_URL,
    credentials: true,
  })
  return corsMiddleware(c, next)
})
app.use("/api/v1/blog/*", verifyJWT);

app.get("/", (c: Context) => c.text("hello this is the main route"));
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/user", userRouter);

app.onError(errorMiddleware);

export default app; 
