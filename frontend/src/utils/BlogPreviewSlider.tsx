import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Plus,
  Image as ImageIcon,
  CircleX,
  ChevronDown,
} from "lucide-react";
import { axiosClient } from "@/axios/axios";
import { Loading } from "@/atoms/blog";

interface BlogPreviewSliderProps {
  title: string;
  content: string;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  authorId: string;
}

export default function BlogPreviewSlider({
  title,
  content,
  setIsOpen,
  isOpen,
  authorId,
}: BlogPreviewSliderProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useRecoilState(Loading);
  const [currentTag, setCurrentTag] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [description]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const addTag = () => {
    if (currentTag.trim() !== "" && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const createBlogMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosClient.post("/blog/newBlog", formData);
      return response.data.blog;
    },
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["blogs"], (oldData: any) => {
        if (
          !oldData ||
          !Array.isArray(oldData.pages) ||
          oldData.pages.length === 0
        ) {
          return { pages: [{ blogs: [newBlog] }] };
        }
        const updatedPages = [...oldData.pages];
        if (updatedPages[0] && Array.isArray(updatedPages[0].blogs)) {
          updatedPages[0] = {
            ...updatedPages[0],
            blogs: [newBlog, ...updatedPages[0].blogs],
          };
        } else {
          updatedPages[0] = { blogs: [newBlog] };
        }

        return { ...oldData, pages: updatedPages };
      });

      setIsLoading(false);
      toast.success("Blog post published successfully!");
      navigate("/home");
    },
    onError: (error) => {
      console.error("Error publishing the blog:", error);
      toast.error("Failed to publish blog");
      setIsLoading(false);
    },
  });

  const handlePublish = () => {
    if (!image) {
      toast.error("Please upload an image before publishing.");
      return;
    }
    if (!content.length) {
      toast.error("Enter the content to publish it!");
      return;
    }
    if (!title.length) {
      toast.error("Enter a blog title to publish it!");
      return;
    }
    if (!description.length) {
      toast.error("Please add a description for your blog post.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("description", description);
    formData.append("authorId", authorId);
    formData.append("postImage", image);

    setIsLoading(true);
    createBlogMutation.mutate(formData);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-all duration-500 ease-in-out transform ${
        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="bg-background flex-grow overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 h-full relative">
          {/* <CircleX
            onClick={() => setIsOpen(false)}
            className="cursor-pointer absolute sm:right-6 md:hidden "
            size={30}
          /> */}
          <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="w-full md:w-2/3 space-y-6">
              <div>
                <Label htmlFor="image-upload" className="text-lg font-semibold">
                  Blog Picture
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload an eye-catching image to make your blog post stand out
                </p>
                <div
                  className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center bg-gray-50 h-64 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Uploaded"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <>
                      <ImageIcon size={48} className="text-gray-400 mb-4" />
                      <p className="text-gray-500 text-center">
                        Click to upload image
                        <br />
                        <span className="text-sm">
                          (This will be visible to your readers)
                        </span>
                      </p>
                    </>
                  )}
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-lg font-semibold">
                  Tags
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add relevant tags to help readers find your content
                </p>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Type a tag and press Enter"
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    className="flex-grow"
                  />
                  <Button
                    onClick={addTag}
                    size="icon"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus size={24} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <div>
                <Label htmlFor="description" className="text-lg font-semibold">
                  Blog Description
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Provide a brief description of your blog post (max 200
                  characters)
                </p>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  placeholder="Enter a brief description of your blog post"
                  className="resize-none"
                  ref={textareaRef}
                  rows={1}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {description.length}/200 characters
                </p>
              </div>
              <Button
                onClick={handlePublish}
                className="w-full text-lg py-6"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Publishing..." : "Publish Blog Post"}
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-center -mt-10">
            <ChevronDown
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
              size={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
