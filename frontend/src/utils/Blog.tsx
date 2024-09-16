
export type Author={
  FullName:string,
  email:string,
  id:string,
}

interface propTypes{
  author:Author,
  content:string,
  title:string
}

const Blog = ({content , title , author }:propTypes) => {
  return (
    <div className="max-w-full h-40 mr-20 flex mt-10 ml-10 gap-4 border-b border-b-slate-300">
      {/* Left Section: Title and Description */}
      <div className="flex-1 space-y-2">
        {/* Person name with Publication if present */}
        <div className="flex gap-2 ">
          <div className="w-8 h-8 rounded-full overflow-hidden border bg-red-500 border-gray-300"></div>
          <div className="flex justify-center items-center gap-1">
            <span className="font-semibold text-sm hover:underline hover:cursor-pointer">
            {author.FullName}
            </span>
            <span> in </span>
            <span className="font-semibold text-sm hover:underline hover:cursor-pointer">
              Publication Name
            </span>
          </div>
        </div>

        {/* Blog title */}
        <h1 className="font-bold text-2xl">{title}</h1>

        {/* Description of the Blog */}
        <div className="">
          <p className="text-md text-gray-500 line-clamp-2 overflow-hidden text-ellipsis">
            {content}
            {/* JavaScript is a versatile and powerful language that is essential
            for modern web development. Here are super hacks that will make you
            a more efficient and effective JavaScript developer, with detailed
            explanations and examples for each one. */}
          </p>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="w-40 h-auto mb-4"> 
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
          alt="Blog Illustration"
          className="w-full mt-10 h-24 object-contain "
        />
      </div>

    </div>
  );
};

export default Blog;
