// import Blog, { Author } from "@/utils/Blog";
// import HomeNavBar from "./HomeNavBar";
// import SkeletonUi from "@/utils/SkeletonUi";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { axiosClient } from "@/axios/axios";
// import { toast } from "sonner";
// import { useEffect, useRef, useCallback } from "react";

// type BlogType = {
//   id: string;
//   title: string;
//   content: string;
//   author: Author;
// };

// const fetchBlogs = async (cursor: string | null) => {
//   const response = await axiosClient.get(`/blog/allBlogs?cursor=${cursor}`);
//   if (response.status === 400) {
//     toast.error("Error fetching data");
//   }
//   // Return both the blogs and the next cursor
//   return {
//     blogs: response.data.blog.reverse(), // Reverse the order of the blog list
//     nextCursor: response.data.cursor|| null // Ensure this matches your API response structure
//   };
// };

// const Home = () => {
//   const observer = useRef<IntersectionObserver | null>(null);

//   const {
//     data,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     isLoading,
//   } = useInfiniteQuery({
//     queryKey: ["blogs"],
//     queryFn: ({ pageParam = null }) => fetchBlogs(pageParam),
//     initialPageParam: null,
//     getNextPageParam: (lastPage) => lastPage.nextCursor || null,
//   });

//   const lastElementRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (isLoading) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//           fetchNextPage();
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]
//   );

//   if (status === "pending") return <SkeletonUi />;
//   if (error) {
//     toast.error("Error fetching Blogs");
//     return <div>Error loading blogs</div>;
//   }

//   return (
//     <div className="min-h-screen">
//       <header>
//         <HomeNavBar />
//       </header>

//       <main className="flex flex-col space-y-4 p-4">
//         {data?.pages.map((page, pageIndex) =>
//           page.blogs.map((blog: BlogType, blogIndex:any) => (
//             <Blog
//               key={blog.id}
//               title={blog.title}
//               content={blog.content}
//               author={blog.author}
//               ref={pageIndex === data.pages?.length - 1 && blogIndex === page.blogs?.length - 1 ? lastElementRef : undefined} // Apply ref only to the last element of the last page
//             />
//           ))
//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;




// import Blog, { Author } from "@/utils/Blog";
// import HomeNavBar from "./HomeNavBar";
// import SkeletonUi from "@/utils/SkeletonUi";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { axiosClient } from "@/axios/axios";
// import { toast } from "sonner";
// import { useEffect, useRef, useCallback } from "react";

// type BlogType = {
//   id: string;
//   title: string;
//   content: string;
//   author: Author;
// };

// const fetchBlogs = async (cursor: string | null) => {
//   try {
//     const response = await axiosClient.get(`/blog/allBlogs?cursor=${cursor || ''}`);
//     if (response.status === 400) {
//       toast.error("Error fetching data");
//     }
//     return {
//       blogs: response.data.blog?.reverse() || [], // Ensure this is an array
//       nextCursor: response.data.cursor || null // Ensure this is defined
//     };
//   } catch (error) {
//     toast.error("Error fetching data");
//     return { blogs: [], nextCursor: null }; // Handle errors gracefully
//   }
// };

// const Home = () => {
//   const observer = useRef<IntersectionObserver | null>(null);

//   const {
//     data = { pages: [] }, // Default empty pages
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     isLoading,
//   } = useInfiniteQuery({
//     queryKey: ["blogs"],
//     queryFn: ({ pageParam = null }) => fetchBlogs(pageParam),
//     initialPageParam: null,
//     getNextPageParam: (lastPage) => {
//       console.log("hiiiiiii")
//       if (!lastPage || !lastPage.nextCursor) return null;
//       return lastPage.nextCursor
//     },

//   });

//   const lastElementRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (isLoading) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//           console.log(entries[0])
//           fetchNextPage();
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]
//   );

//   if (status === "pending") return <SkeletonUi />;
//   if (error) {
//     toast.error("Error fetching Blogs");
//     return <div>Error loading blogs</div>;
//   }

//   return (
//     <div className="min-h-screen">
//       <header>
//         <HomeNavBar />
//       </header>

//       <main className="flex flex-col space-y-4 p-4">
//         {data.pages.map((page, pageIndex) =>
//           page.blogs.map((blog: BlogType, blogIndex: any) => (
//             <Blog
//               key={blog.id}
//               title={blog.title}
//               content={blog.content}
//               author={blog.author}
//               ref={pageIndex === data.pages.length - 1 && blogIndex === page.blogs.length - 1 ? lastElementRef : undefined}
//             />
//           ))
//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;





// import Blog, { Author } from "@/utils/Blog";
// import HomeNavBar from "./HomeNavBar";
// import SkeletonUi from "@/utils/SkeletonUi";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { axiosClient } from "@/axios/axios";
// import { toast } from "sonner";
// import { useEffect, useRef, useCallback } from "react";

// type BlogType = {
//   id: string;
//   title: string;
//   content: string;
//   author: Author;
// };

// const fetchBlogs = async (cursor: string | null) => {
//   try {
//     const response = await axiosClient.get(`/blog/allBlogs?cursor=${cursor || ''}`);
//     if (response.status === 400) {
//       toast.error("Error fetching data");
//     }
//     return {
//       blogs: response.data.blog?.reverse() || [], // Ensure this is an array
//       nextCursor: response.data.cursor || null // Ensure this is defined
//     };
//   } catch (error) {
//     toast.error("Error fetching data");
//     return { blogs: [], nextCursor: null }; // Handle errors gracefully
//   }
// };

// const Home = () => {
//   const observer = useRef<IntersectionObserver | null>(null);

//   const {
//     data = { pages: [] }, // Default empty pages
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     isLoading,
//   } = useInfiniteQuery({
//     queryKey: ["blogs"],
//     queryFn: ({ pageParam = null }) => fetchBlogs(pageParam),
//     initialPageParam: null,
//     getNextPageParam: (lastPage) => {
//       console.log("hiiiiiii")
//       if (!lastPage || !lastPage.nextCursor) return null;
//       return lastPage.nextCursor
//     },

//   });

//   const lastElementRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (isLoading) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//           console.log(entries[0])
//           fetchNextPage();
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]
//   );

//   if (status === "pending") return <SkeletonUi />;
//   if (error) {
//     toast.error("Error fetching Blogs");
//     return <div>Error loading blogs</div>;
//   }

//   return (
//     <div className="min-h-screen">
//       <header>
//         <HomeNavBar />
//       </header>

//       <main className="flex flex-col space-y-4 p-4">
//         {data.pages.map((page, pageIndex) =>
//           page.blogs.map((blog: BlogType, blogIndex: any) => (
//             <Blog
//               key={blog.id}
//               title={blog.title}
//               content={blog.content}
//               author={blog.author}
//               ref={pageIndex === data.pages.length - 1 && blogIndex === page.blogs.length - 1 ? lastElementRef : undefined}
//             />
//           ))
//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;

import { useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Blog, { Author } from "@/utils/Blog";
import HomeNavBar from "./HomeNavBar";
import SkeletonUi from "@/utils/SkeletonUi";
import { axiosClient } from "@/axios/axios";


type BlogType = {
  id: string;
  title: string;
  content: string;
  author: Author;
  published: boolean;
  authorId: string;
  like:Number,
  isLiked : boolean

};

const fetchBlogs = async (cursor: string | null) => {
  try {
    const response = await axiosClient.get(`/blog/allBlogs?cursor=${cursor || ''}`);
    if (response.status === 400) {
      toast.error("Error fetching data");
    }
    return {
      blogs: response.data.blog || [],
      nextCursor: response.data.cursor || null
    };
  } catch (error) {
    toast.error("Error fetching data");
    return { blogs: [], nextCursor: null };
  }
};

const Home = () => {
  const observer = useRef<IntersectionObserver | null>(null);
  const queryClient = useQueryClient();

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

  // Function to update the cache with the new blog
  const updateCacheWithNewBlog = useCallback((newBlog: BlogType) => {
    queryClient.setQueryData(['blogs'], (oldData: any) => {
      if (!oldData) {
        return { pages: [{ blogs: [newBlog], nextCursor: null }], pageParams: [null] };
      }
  
      const newPages = oldData.pages.map((page: any, index: number) => {
        if (index === 0) {
          return { ...page, blogs: [newBlog, ...page.blogs] };
        }
        return page;
      });
  
      return { ...oldData, pages: newPages };
    });
  
    queryClient.invalidateQueries({
     queryKey: ['blogs'], 
    });
  }, [queryClient]);
  

  // Effect to listen for new blog events
  useEffect(() => {
    const handleNewBlog = (event: CustomEvent<BlogType>) => {
      updateCacheWithNewBlog(event.detail);
    };

    window.addEventListener('newBlogPublished' as any, handleNewBlog as EventListener);

    return () => {
      window.removeEventListener('newBlogPublished' as any, handleNewBlog as EventListener);
    };
  }, [updateCacheWithNewBlog]);

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
          page.blogs.map((blog: BlogType, blogIndex: number) => (
            <Blog
              key={blog.id}
              isLikedBlog= {blog.isLiked}
              id={blog.id}
              like={blog.like}
              title={blog.title}
              content={blog.content}
              author={blog.author}
              ref={pageIndex === data.pages.length - 1 && blogIndex === page.blogs.length - 1 ? lastElementRef : undefined}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;