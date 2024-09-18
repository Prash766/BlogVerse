import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { blogInfo, Loading, PublishButtonClicked } from "@/atoms/blog";
import { userInfo } from "@/atoms/user";
import BlogPreviewSlider from "@/utils/BlogPreviewSlider";
import { Button } from "@/components/ui/button";
import SkeletonUi from "@/utils/SkeletonUi";
import { toast } from "sonner";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishClicked, setIsPublishClicked] =
    useRecoilState(PublishButtonClicked);
  const isLoading = useRecoilValue(Loading);
  const User = useRecoilValue(userInfo);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<EditorJS | null>(null);

  const handleTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      editorRef.current?.focus(); // Focus on EditorJS
    }
  };

  useEffect(() => {
    const editor = new EditorJS({
      holder: "editorjs",
      inlineToolbar: ["italic", "bold"],
      placeholder: "Tell Your Story....",
      tools: {
        header: {
          //@ts-ignore
          class: Header,
          inlineToolbar: ["link"],
          shortcut: "CMD+SHIFT+H",
        },
        inlineCode: {
          class: InlineCode,
        },
      },
      onReady: () => {
        editorRef.current = editor;
      },

      onChange: async () => {
        try {
          const outputData = await editor.save();
          console.log("EditorJS Output Data:", outputData);
          const plainText = outputData.blocks
            .map((block) => {
              if (block.type === "paragraph" || block.type === "header") {
                return block.data.text;
              }
              return "";
            })
            .join("\n");

          // Update content state
          setContent(plainText);
        } catch (error) {
          console.error("Error saving editor content", error);
        }
      },
    });

    editor.isReady.then(() => {
      console.log("EditorJS is ready!");
    });

    return () => {
      editor.destroy();
    };
  }, []);

  useEffect(() => {
    const titleTextArea = titleRef.current;
    if (titleTextArea) {
      titleTextArea.style.height = "auto";
      titleTextArea.style.height = `${titleTextArea.scrollHeight}px`;
    }
  }, [title]);

  const handleClick = () => {
    if (!content.length || !title.length) {
      return toast.error("Enter the Blog title or the Content");
    }
    setIsPublishClicked(true); // Open the slider
  };

  if (isLoading) return <SkeletonUi />;

  return (
    <div className="min-h-screen">
      <nav className="flex justify-between items-center py-4 px-6">
        <div className="group flex items-center space-x-2">
          <span
            onClick={() => navigate("/home")}
            className="font-bold cursor-pointer text-2xl"
          >
            BlogVerse
          </span>
          <span className="pt-1 pl-5 text-xl cursor-default font-serif">
            Draft
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Button onClick={handleClick} variant="outline" size="sm">
            Publish
          </Button>
        </div>
      </nav>

      <div className="relative mt-9 mb-6 px-10 overflow-hidden">
        <textarea
          ref={titleRef}
          value={title}
          onKeyDown={(e) => handleTextAreaKeyDown(e)}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog Title"
          className="text-5xl ml-20 pr-10 placeholder:text-5xl placeholder:font-normal font-normal leading-snug font-serif bg-transparent border-none w-full  resize-none outline-none overflow-hidden mb-2"
        />
        {/* <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your blog post..."
          className="w-full resize-none h-96 text-lg border-none bg-transparent outline-none"
        /> */}
        <div id="editorjs" className="font-serif text-xl"></div>
      </div>

      <BlogPreviewSlider
        title={title}
        content={content}
        isOpen={isPublishClicked}
        setIsOpen={setIsPublishClicked}
        authorId={User?.id}
      />
    </div>
  );
};

export default CreateBlog;


