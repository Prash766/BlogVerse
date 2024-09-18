
// import React, { ForwardedRef } from "react";

// export type Author = {
//   FullName: string;
//   email: string;
//   id: string;
// };

// interface PropTypes {
//   ref?: ForwardedRef<HTMLDivElement>; // Add ref here
//   author: Author;
//   content: string;
//   title: string;
// }

// const Blog = React.forwardRef<HTMLDivElement, PropTypes>(
//   ({ content, title, author }, ref) => {
//     return (
//       <div ref={ref} className="max-w-full h-40 mr-20 flex mt-10 ml-10 gap-4 border-b border-b-slate-300">
//         {/* Left Section: Title and Description */}
//         <div className="flex-1 space-y-2">
//           {/* Person name with Publication if present */}
//           <div className="flex gap-2">
//             <div className="w-8 h-8 rounded-full overflow-hidden border bg-red-500 border-gray-300"></div>
//             <div className="flex justify-center items-center gap-1">
//               <span className="font-semibold text-sm hover:underline hover:cursor-pointer">
//                 {author.FullName}
//               </span>
//               <span> in </span>
//               <span className="font-semibold text-sm hover:underline hover:cursor-pointer">
//                 Publication Name
//               </span>
//             </div>
//           </div>

//           {/* Blog title */}
//           <h1 className="font-bold text-2xl">{title}</h1>

//           {/* Description of the Blog */}
//           <div>
//             <p className="text-md text-gray-500 line-clamp-2 overflow-hidden text-ellipsis">
//               {content}
//             </p>
//           </div>
//         </div>

//         {/* Right Section: Image */}
//         <div className="w-40 h-auto mb-4">
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
//             alt="Blog Illustration"
//             className="w-full mt-10 h-24 object-contain"
//           />
//         </div>
//       </div>
//     );
//   }
// );

// Blog.displayName = "Blog"; // Display name for debugging purposes

// export default Blog;

'use client'
import React, { ForwardedRef, useState } from "react";
import { Heart } from "lucide-react";

export type Author = {
  fullName: string;
  email: string;
  id: string;
};

interface PropTypes {
  ref?: ForwardedRef<HTMLDivElement>;
  author?: Author;
  content: string;
  title: string;
}

const Blog = React.forwardRef<HTMLDivElement, PropTypes>(
  ({ content, title, author }, ref) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
      if (isLiked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    };

    // Pseudo title and description
    const pseudoTitle = "The Future of Web Development: Trends to Watch in 2023";
    const pseudoDescription = "This is a fascinating article that delves into the intricacies of modern web development. It explores cutting-edge technologies and best practices that every developer should know. From responsive design to performance optimization, this piece covers it all. Whether you're a seasoned professional or just starting out, you'll find valuable insights here.";

    return (
      <div ref={ref} className="cursor-pointer max-w-5xl ml-10 px-6 py-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-8 items-center justify-between">
          {/* Left Section: Title and Description */}
          <div className="flex-1 space-y-5">
            {/* Author info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {/* You can add an author image here if available */}
              </div>
              <div>
                <span className="font-semibold text-sm hover:underline cursor-pointer">
                  {author?.fullName || "John Doe"}
                </span>
                <span className="text-gray-500 text-sm"> in </span>
                <span className="font-semibold text-sm hover:underline cursor-pointer">
                  Tech Insights
                </span>
              </div>
            </div>

            {/* Blog title */}
            <h1 className="font-bold text-2xl sm:text-3xl leading-tight">
              {title || pseudoTitle}
            </h1>

            {/* Description of the Blog */}
            <p className="text-md text-gray-600 line-clamp-3 min-h-[3em]">
              {content || pseudoDescription}
            </p>

            {/* Like button and count */}
            <div className="flex pt-8 items-center gap-2">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-sm font-medium"
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                <span>{likes}</span>
              </button>
            </div>
          </div>

          {/* Right Section: Image */}
          <div className="w-full sm:w-48 h-48 flex-shrink-0 mt-6 sm:mt-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
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
