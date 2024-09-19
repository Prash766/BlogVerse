import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Blog, { Author } from "@/utils/Blog";
import HomeNavBar from "./HomeNavBar";
import SkeletonUi from "@/utils/SkeletonUi";
import { axiosClient } from "@/axios/axios";
import { Loader } from "lucide-react";

type BlogType = {
  id: string;
  title: string;
  content: string;
  author: Author;
  published: boolean;
  authorId: string;
  like: Number;
  isLiked: boolean;
  description: string;
  postImage: string;
};

const fetchBlogs = async (cursor: string | null) => {
  try {
    const response = await axiosClient.get(
      `/blog/allBlogs?cursor=${cursor || ""}`
    );
    if (response.status === 400) {
      toast.error("Error fetching data");
    }
    return {
      blogs: response.data.blog || [],
      nextCursor: response.data.cursor || null,
    };
  } catch (error) {
    toast.error("Error fetching data");
    return { blogs: [], nextCursor: null };
  }
};

const Home = () => {
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: ({ pageParam = null }) => fetchBlogs(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]
  );

  if (status === "pending") return <SkeletonUi />;
  if (error) {
    toast.error("Error fetching Blogs");
    return <div>Error loading blogs</div>;
  }
  return (
    <div className="min-h-screen">
      <header>
        <HomeNavBar />
      </header>
      <main className="flex flex-col space-y-4 p-4">
        {data?.pages.map((page, pageIndex) =>
          (page.blogs || []).map((blog: BlogType, blogIndex: number) => (
            <Blog
              key={blog.id}
              description={blog.description}
              postImage={blog.postImage}
              isLikedBlog={blog.isLiked}
              id={blog.id}
              like={blog.like}
              title={blog.title}
              content={blog.content}
              author={blog.author}
              ref={
                pageIndex === data.pages.length - 1 &&
                blogIndex === (page.blogs || []).length - 1
                  ? lastElementRef
                  : undefined
              }
            />
          ))
        )}
        {isFetchingNextPage && <Loader className=" mx-auto animate-spin" />}
      </main>
    </div>
  );
};

export default Home;
