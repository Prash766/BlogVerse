import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/axios/axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ExternalLink,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Share2,
} from "lucide-react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/atoms/user";
import BlogPageSkeleton from "@/utils/BlogPageSkeleton";

import DOMPurify from "dompurify";

interface LikeMutationContext {
  previousBlogs: any; 
  previousBlogData: any; 
}



interface BlockData {
  text?: string;
  file?: { url: string };
  caption?: string;
  items?: string[];
  link: string;
  meta?: {
    title: string;
    description: string;
    image?: { url: string };
  };
}

interface Block {
  type: "header" | "paragraph" | "image" | "list" | "linkTool";
  data: BlockData;
}

interface LinkTool {
  link: string;
  meta: {
    title: string;
    description: string;
    image?: {
      url: string;
    };
  };
}

type Blog = {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
  like: number;
  title: string;
  postImage: string;
  isLiked: boolean;
  linkTool: LinkTool;
};
const fetchBlog = async (id: string) => {
  const res = await axiosClient.get(`/blog/get/${id}`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch blog");
  }
  console.log(res.data);
  return res.data;
};

const toggleLike = async (id: string) => {
  const res = await axiosClient.put(`/blog/like`, { blogId: id });
  if (res.status !== 200) {
    throw new Error("Failed to toggle like");
  }
  return res.data;
};

const renderBlocks = (blocks: Block[]) => {
  return blocks.map((block, index: number) => {
    const sanitizeAndRenderHTML = (html: string) => {
      const sanitizedHTML = DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
      return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
    };

    const processText = (text: string) => {
      return text
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    };

    switch (block.type) {
      case "header":
        return (
          <h2 key={index} className="text-2xl font-bold mb-6 mt-8">
            {block.data.text ? processText(block.data.text) : null}
          </h2>
        );
      case "paragraph":
        return (
          <p key={index} className="mb-5 leading-relaxed">
            {block.data.text
              ? sanitizeAndRenderHTML(processText(block.data.text))
              : null}
          </p>
        );
      case "image":
        return (
          <div key={index} className="mb-8">
            <img
              src={block.data.file?.url}
              alt={block.data.caption}
              className="w-full rounded-lg shadow-md mb-2"
            />
            <p className="text-sm text-gray-500 italic">{block.data.caption}</p>
          </div>
        );
      case "list":
        return (
          <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
            {block.data.items?.map((item, i) => (
              <li key={i}>{sanitizeAndRenderHTML(processText(item))}</li>
            ))}
          </ul>
        );
      case "linkTool":
        const { title, description, image } = block.data.meta as {
          title: string;
          description: string;
          image?: { url: string };
        };
        return (
          <a
            href={block.data.link}
            style={{ textDecoration: "none" }}
            target="_blank"
            className="group block mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full max-w-4xl"
            rel="noopener noreferrer"
          >
            <div className="flex items-center space-x-6">
              <div className="flex-grow space-y-3 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300 no-underline truncate pr-4">
                    {title}
                  </h3>
                  <ExternalLink className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {description}
                </p>
                <div className="flex ">
                  <span className="inline-block  px-2  py-1 text-xs font-medium text-gray-500 bg-gray-100  rounded-full">
                    {new URL(block.data.link).hostname}
                  </span>
                </div>
              </div>
              {image?.url && (
                <div className="flex-shrink-0">
                  <img
                    src={image.url}
                    alt={title}
                    className="w-28 h-28 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          </a>
        );
      default:
        return null;
    }
  });
};

export default function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const user = useRecoilValue(userInfo);
  const queryClient = useQueryClient();
 

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlog(id!),
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(id!),
    onMutate: async ():Promise<LikeMutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["blogs"] });
      await queryClient.cancelQueries({ queryKey: ["blog", id] });

      const previousBlogs = queryClient.getQueryData(["blogs"]);
      const previousBlogData = queryClient.getQueryData(["blog", id]);

      queryClient.setQueryData(["blogs"], (old: any) => {
        if (!old || !old.blog) return old;
        return {
          ...old,
          blog: old.blog.map((blog: Blog) =>
            blog.id === id
              ? {
                  ...blog,
                  like: blog.like + (blog.isLiked ? -1 : 1),
                  isLiked: !blog.isLiked,
                }
              : blog
          ),
        };
      });

      queryClient.setQueryData(["blog", id], (oldData: any) => {
        if (!oldData) return oldData;
        const newLikeCount = oldData.blog.like + (oldData.isBlogLiked ? -1 : 1);
        return {
          ...oldData,
          blog: {
            ...oldData.blog,
            like: newLikeCount >= 0 ? newLikeCount : 0,
          },
          blogsLiked: {
            ...oldData.blogsLiked,
            isLiked: !oldData.isBlogLiked,
          },
          isBlogLiked: !oldData.isBlogLiked,
        };
      });

      return { previousBlogs, previousBlogData };
    },
    onError: (err,_,  context: LikeMutationContext | undefined) => {
      console.log(err);
      queryClient.setQueryData(["blogs"], context?.previousBlogs);
      queryClient.setQueryData(["blog", id], context?.previousBlogData);
      toast.error("Failed to update like");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", id] });
    },
  });

  if (isLoading) return <BlogPageSkeleton />;
  if (isError) return <div>Error fetching blog</div>;

  const { blog,  isBlogLiked } = data;

  const parsedContent = JSON.parse(blog.content);
  console.log(parsedContent);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage
            src={user.avatar || "/placeholder-avatar.jpg"}
            alt={user.FullName}
          />
          <AvatarFallback>{user.FullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{user.FullName}</span>
            <Button variant="ghost" size="sm" className="text-blue-600">
              Follow
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Published in {blog.publication || "Gaming"} · {blog.readTime || "3"}{" "}
            min read · {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => likeMutation.mutate()}>
          <Heart
            className={`w-4 h-4 mr-2 ${
              isBlogLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
          {blog.like}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          {blog.comments || null}
        </Button>
        <div className="flex-grow"></div>
        <Button variant="ghost" size="icon">
          <Play className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bookmark className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <img
        src={blog.postImage || "/placeholder.svg?height=400&width=800"}
        alt={blog.imageAlt || "Blog post image"}
        className="w-full max-h-100 object-cover mb-10"
      />
      <p className="text-sm text-gray-500 mb-8">{blog.imageCredit}</p>

      <div id="editorjs" className="prose font-serif text-xl max-w-none">
        {renderBlocks(parsedContent.blocks)}
      </div>
    </div>
  );
}
