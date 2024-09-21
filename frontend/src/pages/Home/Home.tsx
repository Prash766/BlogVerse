import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Blog from "@/utils/Blog";
import HomeNavBar from "./HomeNavBar";
import SkeletonUi from "@/utils/SkeletonUi";
import { axiosClient } from "@/axios/axios";
import { Loader } from "lucide-react";

const fetchBlogs = async (cursor:any) => {
  try {
    const response = await axiosClient.get(`/blog/allBlogs?cursor=${cursor || ""}`);
    if (response.status === 400) {
      toast.error("Error fetching data");
    }
    console.log(response.data)
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
    refetch,
  } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: ({ pageParam = null }) => fetchBlogs(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.nextCursor) {
        return lastPage.nextCursor;
      }
      return undefined
    
    }
  });

  useEffect(() => {
    const onFocus = () => {
      refetch();
    };
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [refetch]);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
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
          (page.blogs || []).map((blog:any, blogIndex:any) => (
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