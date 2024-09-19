import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Play, Share2 } from "lucide-react"

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Badge variant="secondary" className="mb-4">Member-only story</Badge>
      <h1 className="text-4xl font-bold mb-4">Dear FAAMG: Please Say Goodbye to LeetCode</h1>
      
      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage src="/placeholder-avatar.jpg" alt="Pen Magnet" />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Pen Magnet</span>
            <Button variant="ghost" size="sm" className="text-blue-600">Follow</Button>
          </div>
          <div className="text-sm text-gray-500">
            Published in Level Up Coding · 5 min read · Aug 23, 2024
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm">
          <Heart className="w-4 h-4 mr-2" />
          545
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          17
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

      <p className="text-xl mb-8">The question is, who will do it first?</p>

      <img 
        src="/placeholder.svg?height=400&width=800" 
        alt="People working at computers in an office" 
        className="w-full h-auto mb-4"
      />
      <p className="text-sm text-gray-500 mb-8">Photo by Alex Kotliarskyi on Unsplash</p>

      <p className="text-lg mb-4">
        Read Pen Magnet envisions the future of senior developer interviews in his
        latest blog post...
      </p>

      {/* More content would go here */}
    </div>
  )
}