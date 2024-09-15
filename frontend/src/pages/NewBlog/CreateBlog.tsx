import { blogInfo } from "@/atoms/blog";
import { userInfo } from "@/atoms/user";
import { axiosClient } from "@/axios/axios";
import { Button } from "@/components/ui/button";
import SkeletonUi from "@/utils/SkeletonUi";
import { createPost } from "@prash766/common-app";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const User = useRecoilValue(userInfo);
  const setBlogInfo = useSetRecoilState(blogInfo);

  function handleTextAreaResize(textArea: HTMLTextAreaElement | null) {
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.code === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      contentRef.current?.focus();
    }
  }

  async function handleClick() {
    try {
      setIsLoading(true);
      console.log(User);

      const data: createPost = {
        title,
        content,
        published: true,
        authorId: User.id,
      };

      const response = await axiosClient.post("/blog/newBlog", data);
      console.log(response);
      if (response.status === 200) {
        setBlogInfo(response.data.blog);
        toast.success("Blog Published");
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const titleTextArea = titleRef.current;
    const contentTextArea = contentRef.current;

    handleTextAreaResize(titleTextArea);
    handleTextAreaResize(contentTextArea);

    if (titleTextArea) {
      titleTextArea.addEventListener("input", () => handleTextAreaResize(titleTextArea));
    }

    if (contentTextArea) {
      contentTextArea.addEventListener("input", () => handleTextAreaResize(contentTextArea));
    }

    return () => {
      if (titleTextArea) {
        titleTextArea.removeEventListener("input", () => handleTextAreaResize(titleTextArea));
      }
      if (contentTextArea) {
        contentTextArea.removeEventListener("input", () => handleTextAreaResize(contentTextArea));
      }
    };
  }, [title, content]);

  function handleNavigateHome() {
    navigate("/home");
  }
  return (
    <div className="min-h-screen">
      {isLoading ? (
        <SkeletonUi />
      ) : (
        <>
          <nav className="flex justify-between items-center py-4 px-6">
            <div className="group flex items-center space-x-2 cursor-pointer" onClick={handleNavigateHome}>
              <span className="font-bold text-2xl">BlogVerse</span>
              <span className=" pt-1 pl-5 text-xl font-serif">Draft</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500">
                <div className="h-8 w-8 mr-3 bg-red-500 rounded-full" />
                Profile
              </Button>
              <Button onClick={handleClick} variant="outline" size="sm">
                Publish
              </Button>
            </div>
          </nav>

          <div className="mt-9 mb-6 px-10">
            <textarea
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ resize: "none" }}
              placeholder="Title"
              className="w-full h-auto focus:outline-none placeholder:font-normal placeholder:text-slate-400 font-serif text-5xl leading-snug"
            />
          </div>

          <div className="mb-6 px-10">
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: "none" }}
              placeholder="Tell Your Story..."
              className="w-full h-auto focus:outline-none placeholder:font-normal placeholder:text-slate-400 font-serif text-2xl leading-relaxed"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CreateBlog;
