
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/axios/axios';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Play, Share2 } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { userInfo } from '@/atoms/user';
import BlogPageSkeleton from '@/utils/BlogPageSkeleton';

const fetchBlog = async (id:string| undefined) => {
  const res = await axiosClient.get(`/blog/get/${id}`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch blog');
  }
  return res.data;
};

const toggleLike = async (id:string|undefined) => {
  const res = await axiosClient.put(`/blog/like`, {
    blogId: id
  });
  if (res.status !== 200) {
    throw new Error('Failed to toggle like');
  }
  return res.data;
};

export default function BlogPage() {
  const { id } = useParams();
  console.log(id)
  const user = useRecoilValue(userInfo)
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchBlog(id),
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['blog', id]});
    },
    onError: () => {
      toast.error('Failed to update like');
    },
  });

  if (isLoading) return <BlogPageSkeleton/>;
  if (isError) return <div>Error fetching blog</div>;

  const { blog, blogsLiked } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      
      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage src={user.avatar || "/placeholder-avatar.jpg"} alt={user.FullName} />
          <AvatarFallback>{user.FullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{user.FullName}</span>
            <Button variant="ghost" size="sm" className="text-blue-600">Follow</Button>
          </div>
          <div className="text-sm text-gray-500">
            Published in {blog.publication || "Gaming"} · {blog.readTime || "3"} min read · {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => likeMutation.mutate()}
          // disabled={likeMutation.isLoading}
        >
          <Heart className={`w-4 h-4 mr-2 ${blogsLiked.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          {blog.like}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          {blog.comments || null}
        </Button>
        <div className="flex-grow"></div>
        <Button variant="ghost" size="icon">
          <Play className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bookmark className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <img 
        src={blog.postImage || "/placeholder.svg?height=400&width=800"} 
        alt={blog.imageAlt || "Blog post image"} 
        className="w-full h-auto mb-4"
      />
      <p className="text-sm text-gray-500 mb-8">{blog.imageCredit}</p>

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}