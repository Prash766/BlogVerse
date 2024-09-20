
import  { ForwardedRef, forwardRef, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "@/axios/axios";
import { toast } from "sonner";
import {  useMutation, useQueryClient } from "@tanstack/react-query";


export type Author = {
  FullName: string;
  email: string;
  id: string;
  avatar: string;
};

interface PropTypes {
  ref?: ForwardedRef<HTMLDivElement>;
  author?: Author;
  content: string;
  title: string;
  id: string;
  like: number;
  isLikedBlog: boolean;
  description: string;
  postImage: string;
}

const Blog = forwardRef<HTMLDivElement, PropTypes>(
  ({ content, title, author, id, like, isLikedBlog, description, postImage }, ref) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
        const [localLikeCount, setLocalLikeCount] = useState(like);
    const [localIsLiked, setLocalIsLiked] = useState(isLikedBlog);
    useEffect(() => {
      setLocalLikeCount(like);
      setLocalIsLiked(isLikedBlog);
    }, [like, isLikedBlog]);
  
    const likeMutation = useMutation({
      mutationFn: async () => {
        const res = await axiosClient.put("/blog/like", { blogId: id });
        return res.data;
      },
      onMutate: async () => {
        // Optimistically update local state
        setLocalIsLiked(!localIsLiked);
        setLocalLikeCount(prevCount => localIsLiked ? prevCount - 1 : prevCount + 1);

        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: ["blogs"] });
        const previousBlogs = queryClient.getQueryData(["blogs"]);

        queryClient.setQueryData(["blogs"], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            blog: old.blog?.map((blog: any) => 
              blog.id === id 
                ? { 
                    ...blog, 
                    like: localIsLiked ? blog.like - 1 : blog.like + 1,
                    isLiked: !localIsLiked 
                  }
                : blog
            )
          };
        });

        return { previousBlogs };
      },
      onError: (err, variables, context) => {
        console.error(err);
        setLocalIsLiked(!localIsLiked);
        setLocalLikeCount(prevCount => localIsLiked ? prevCount + 1 : prevCount - 1);
        queryClient.setQueryData(["blogs"], context?.previousBlogs);
        toast.error("Failed to update like status");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
    });
  
    const handleLike = () => {
      likeMutation.mutate();
    };
  
    const handleBlogClick = () => {
      navigate(`/blog/${id}`);
    };

    const pseudoTitle = "The Future of Web Development: Trends to Watch in 2023";
    const pseudoDescription = "This is a fascinating article that delves into the intricacies of modern web development. It explores cutting-edge technologies and best practices that every developer should know. From responsive design to performance optimization, this piece covers it all. Whether you're a seasoned professional or just starting out, you'll find valuable insights here.";
    return (
      <div ref={ref} className="max-w-5xl ml-10 px-6 py-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-8 items-center justify-between">
          <div className="flex-1 space-y-5">
          <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img className="object-cover w-full h-full" src={author?.avatar || ""} alt="User Avatar" />
              </div>
              <div>
                <span className="font-semibold text-sm hover:underline cursor-pointer">
                  {author?.FullName || "John Doe"}
                </span>
                <span className="text-gray-500 text-sm"> in </span>
                <span className="font-semibold text-sm hover:underline cursor-pointer">
                  Tech Insights
                </span>
              </div>
            </div>
            <h1 onClick={handleBlogClick} className="cursor-pointer font-bold text-2xl sm:text-3xl leading-tight">
              {title || pseudoTitle}
            </h1>
            <p onClick={handleBlogClick} className="cursor-pointer text-md text-gray-600 line-clamp-3 min-h-[3em]">
              {description || pseudoDescription}
            </p>
            

            <div className="flex pt-8 items-center gap-2">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-sm font-medium"
                aria-label={localIsLiked ? "Unlike" : "Like"}
              >
                <Heart className={`w-5 h-5 ${localIsLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                <span>{localLikeCount}</span>
              </button>
            </div>
          </div>

          <div className="w-full sm:w-48 h-48 flex-shrink-0 mt-6 sm:mt-0">
            <img
              src={postImage || "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"}
              alt="Blog Illustration"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    );
  }
);

Blog.displayName = "Blog";

export default Blog;
