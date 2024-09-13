import { Context } from "hono";
import { HTTPException } from "hono/http-exception";


const errorMiddleware = (err:Error | HTTPException, c: Context) => {
    if (err instanceof HTTPException) {
      return c.json(
        {
          success: false,
          error: err,
        },
        400
      );
    }
    return c.json(
      {
        success: false,
        error: err,
        message: "Something went wrong",
      },
      500
    );
  }

  export {
    errorMiddleware

  }