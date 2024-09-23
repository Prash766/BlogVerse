import { axiosClient } from "@/axios/axios";
import DashBoardCard, { PostType } from "./DashBoardCard";
import { useQuery } from "@tanstack/react-query";
import DashBoardSkeleton from "./DashBoardSkeleton";

const fetchBlog = async () => {
  const res = await axiosClient.get("/blog/userBlog");
  console.log(res);
  return res.data.blogs;
};

export default function DashBoard() {
  const {
    data: blogPosts,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["userBlog"],
    queryFn: fetchBlog,
  });

  if (isLoading) return <DashBoardSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts?.map((post: PostType) => (
          <DashBoardCard
            post={{
              id: post.id,
              title: post.title,
              description: post.description,
              postImage: post.postImage,
              like: post.like,
              createdAt: post.createdAt,
            }}
          />
        ))}
      </div>
    </div>
  );
}
