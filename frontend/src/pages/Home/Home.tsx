import Blog, { Author } from "@/utils/Blog";
import HomeNavBar from "./HomeNavBar";
import SkeletonUi from "@/utils/SkeletonUi";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios/axios";
import { toast } from "sonner";

type Blog = {
  id: number;
  title: string;
  content: string;
  author: Author
  
};

const fetchBlogs = async () => {
  const response = await axiosClient.get("/blog/allBlogs");
  if (response.status === 400) {
    toast.error("Error fetching data");
  }
  console.log(response.data.blog)
  return response.data.blog.reverse();
};

const Home = () => {
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  if (isLoading) return <SkeletonUi />;
  if (error) return toast.error(`Error fetching Blogs`);

  return (
    <div className="min-h-screen">
      <header>
        <HomeNavBar />
      </header>

      <main className="flex flex-col ">
        {blog.map((blog: Blog) => (
          <Blog key={blog.id} title={blog.title} content={blog.content}  author={blog.author}/>
        ))}
        {/* <Blog/>
        <Blog/>
        <Blog/>
        <Blog/>
        <Blog/>
       */}
      </main>
    </div>
  );
};

export default Home;
