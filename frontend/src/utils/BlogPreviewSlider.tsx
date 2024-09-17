// 'use client'

// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { X, Plus, Image as ImageIcon } from 'lucide-react'
// import { useRecoilState, useRecoilValue } from 'recoil'
// import { PublishButtonClicked } from '@/atoms/blog'

// export default function BlogPreviewSlider() {
//   const [isOpen, setIsOpen] = useRecoilState(PublishButtonClicked)
//   const [title, setTitle] = useState('')
//   const [tags, setTags] = useState<string[]>([])
//   const [image, setImage] = useState<File | null>(null)
//   const [currentTag, setCurrentTag] = useState('')

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0])
//     }
//   }

//   const addTag = () => {
//     if (currentTag.trim() !== '' && !tags.includes(currentTag.trim())) {
//       setTags([...tags, currentTag.trim()])
//       setCurrentTag('')
//     }
//   }

//   const removeTag = (tagToRemove: string) => {
//     setTags(tags.filter(tag => tag !== tagToRemove))
//   }

//   const handlePublish = () => {
//     if (!image) {
//       alert('Please upload an image before publishing.')
//       return
//     }
//     console.log('Publishing:', { title, tags, image })
//     setTitle('')
//     setTags([])
//     setImage(null)
//     setIsOpen(false)
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex flex-col">
//       <Button 
//         onClick={() => setIsOpen(!isOpen)} 
//         className="mb-4 mx-auto block"
//       >
//         {isOpen ? 'Close' : 'Create Blog Post'}
//       </Button>
//       <div 
//         className={`bg-background flex-grow overflow-y-auto transition-all duration-300 ease-in-out ${
//           isOpen ? 'translate-y-0' : 'translate-y-full'
//         }`}
//       >
//         <div className="max-w-6xl mx-auto p-6 h-full">
//           <div className="flex flex-col md:flex-row gap-6 h-full">
//             <div className="w-full md:w-2/3 space-y-6">
//               <div>
//                 <Label htmlFor="image-upload" className="text-lg font-semibold">Blog Picture</Label>
//                 <p className="text-sm text-muted-foreground mb-2">Upload an eye-catching image to make your blog post stand out</p>
//                 <div 
//                   className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center bg-gray-50 h-64 cursor-pointer hover:bg-gray-100 transition-colors"
//                   onClick={() => document.getElementById('image-upload')?.click()}
//                 >
//                   {image ? (
//                     <img 
//                       src={URL.createObjectURL(image)} 
//                       alt="Uploaded" 
//                       className="max-h-full max-w-full object-contain"
//                     />
//                   ) : (
//                     <>
//                       <ImageIcon size={48} className="text-gray-400 mb-4" />
//                       <p className="text-gray-500 text-center">Click to upload image<br /><span className="text-sm">(This will be visible to your readers)</span></p>
//                     </>
//                   )}
//                 </div>
//                 <Input 
//                   id="image-upload" 
//                   type="file" 
//                   accept="image/*" 
//                   className="hidden" 
//                   onChange={handleImageUpload}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="title" className="text-lg font-semibold">Blog Title</Label>
//                 <p className="text-sm text-muted-foreground mb-2">Create a compelling title that will grab readers' attention</p>
//                 <Input 
//                   id="title" 
//                   value={title} 
//                   onChange={(e) => setTitle(e.target.value)} 
//                   placeholder="Enter your blog title here"
//                   className="text-lg"
//                 />
//               </div>
//             </div>
//             <div className="w-full md:w-1/3 space-y-6">
//               <div>
//                 <Label htmlFor="tags" className="text-lg font-semibold">Tags</Label>
//                 <p className="text-sm text-muted-foreground mb-2">Add relevant tags to help readers find your content</p>
//                 <div className="flex gap-2 mb-4 flex-wrap">
//                   {tags.map(tag => (
//                     <span key={tag} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center">
//                       {tag}
//                       <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500">
//                         <X size={16} />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//                 <div className="flex gap-2">
//                   <Input 
//                     id="tags" 
//                     value={currentTag} 
//                     onChange={(e) => setCurrentTag(e.target.value)} 
//                     placeholder="Type a tag and press Enter"
//                     onKeyPress={(e) => e.key === 'Enter' && addTag()}
//                     className="flex-grow"
//                   />
//                   <Button onClick={addTag} size="icon" className="bg-green-500 hover:bg-green-600">
//                     <Plus size={24} />
//                   </Button>
//                 </div>
//               </div>
//               <Button onClick={handlePublish} className="w-full text-lg py-6" size="lg">
//                 Publish Blog Post
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createPost } from '@prash766/common-app';
import { axiosClient } from '@/axios/axios';
import { useNavigate } from 'react-router-dom';
import SkeletonUi from './SkeletonUi';
import { useRecoilState } from 'recoil';
import { Loading } from '@/atoms/blog';

interface BlogPreviewSliderProps {
  title: string;
  content: string;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  authorId: string;
}

export default function BlogPreviewSlider({ title, content, setIsOpen, isOpen, authorId }: BlogPreviewSliderProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading , setIsLoading] = useRecoilState(Loading)
  const [currentTag, setCurrentTag] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const addTag = () => {
    if (currentTag.trim() !== '' && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const updateBlog = async (data: createPost) => {
    setIsLoading(true)
    try {
      const response = await axiosClient.post('/blog/newBlog', data);
      if (response.status === 200) {
        toast.success('Blog Published');
        setIsOpen(false); 
        setIsLoading(false)
        navigate('/home')
        // Close the slider after publish
      }
      return response.data.blog;
    } catch (error) {
      console.error('Error publishing the blog:', error);
    }
  };

  const mutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs: any) => {
        const blogs = Array.isArray(oldBlogs) ? oldBlogs : [];
        return [newBlog, ...blogs];
      });
    },
  });

  const handlePublish = () => {
    if (!image) {
      toast.error('Please upload an image before publishing.');
      return;
    }
    if (!content.length) {
      toast.error('Enter the content to publish it!');
      return;
    }
    if (!title.length) {
      toast.error('Enter a blog title to publish it!');
      return;
    }

    const data: createPost = {
      title,
      content,
      published: true,
      authorId,
    };

    mutation.mutate(data);
  };


  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-all duration-500 ease-in-out transform ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-background flex-grow overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 h-full">
          <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="w-full md:w-2/3 space-y-6">
              {/* Image Upload Section */}
              <div>
                <Label htmlFor="image-upload" className="text-lg font-semibold">Blog Picture</Label>
                <p className="text-sm text-muted-foreground mb-2">Upload an eye-catching image to make your blog post stand out</p>
                <div
                  className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center bg-gray-50 h-64 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => document.getElementById('image-upload')?.click()}
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
                      <p className="text-gray-500 text-center">Click to upload image<br /><span className="text-sm">(This will be visible to your readers)</span></p>
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

              {/* Tags Section */}
              <div>
                <Label htmlFor="tags" className="text-lg font-semibold">Tags</Label>
                <p className="text-sm text-muted-foreground mb-2">Add relevant tags to help readers find your content</p>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {tags.map(tag => (
                    <span key={tag} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500">
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
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-grow"
                  />
                  <Button onClick={addTag} size="icon" className="bg-green-500 hover:bg-green-600">
                    <Plus size={24} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Publish Button */}
            <div className="w-full md:w-1/3 space-y-6">
              <Button onClick={handlePublish} className="w-full text-lg py-6" size="lg">
                Publish Blog Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
