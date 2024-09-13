import z from "zod";

export const signupInputSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  FullName: z.string(),
  password: z.string().min(5, { message: "Must be 5 or fewer character long" }),
});

export type SignupType = z.infer<typeof signupInputSchema>;

export const signinUserSchema = z.object({
  email: z.string().email({ message: "Invalid Email address" }),
  password: z.string(),
});


export type SigninType = z.infer<typeof signinUserSchema>

export const createPostSchema = z.object({
    title:z.string(),
    content:z.string(),
    published:z.boolean(),
    authorId:z.string().uuid()

})

export type createPost = z.infer<typeof createPostSchema>


export const updatePostSchema=z.object({
    title:z.string().optional(),
    content:z.string().optional(),
    published:z.boolean().optional()

})

export type updatePost = z.infer<typeof updatePostSchema>