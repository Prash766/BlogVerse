import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from 'lucide-react';

export default function ProfilePage({ initialName = "John Doe", initialEmail = "john@example.com" }) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState("/placeholder.svg?height=200&width=200");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
      if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target?.result as string);
      reader.onerror = () => console.error("Failed to read file");
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Profile updated:", { name, avatar });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={avatar} alt="Profile picture" />
                  <AvatarFallback>{name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="sr-only"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  aria-label="Upload new avatar"
                />
              </div>
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={initialEmail}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
