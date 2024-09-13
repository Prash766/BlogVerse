import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

const errorMiddleware = (err: Error | HTTPException, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        error: err,
      },
      400
    );
  }
  if (err instanceof ZodError) {
    return c.json(
      {
        success:false,
        message: err.errors[0].message,
      },
      411
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
};

export { errorMiddleware };
