import { CalendarDays, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export interface PostType {
  id: number;
  title: string;
  description: string;
  postImage: string;
  like: number;
  createdAt: string;
}

const DashBoardCard = ({ post }: { post: PostType }) => {
  const { id, title, description, postImage, like, createdAt } = post;
  const navigate= useNavigate()

  return (
    <>
      <motion.div
      onClick={()=>navigate(`/blog/${id}`)}
        whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
        key={id}
        className="relative overflow-hidden cursor-pointer rounded-lg shadow-lg h-64"
      >
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${postImage})`,
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10" />
        <div className="relative z-20 h-full flex flex-col justify-end p-4">
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-gray-300 mb-4 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center text-gray-300">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-1" />
              <span className="text-sm">{formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span className="text-sm">{like}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DashBoardCard;
