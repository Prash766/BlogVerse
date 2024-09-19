import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenSquare,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  X,
} from "lucide-react";
import useUpdateProfile from "@/hooks/useUpdateProfile"; 
import { useRecoilValue } from "recoil";
import { userInfo } from "@/atoms/user";

export default function ProfilePage() {
  const userDetails = useRecoilValue(userInfo);

  const user = {
    phone: "123-456-7890",
    location: "New York, USA",
    occupation: "Software Engineer",
    bio: "Passionate developer",
  };
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(userDetails.FullName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState(userDetails.avatar);
  const { isLoading, updateProfile } = useUpdateProfile(fullName, avatarFile);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fullname = e.target.value;
    setFullName(fullname);
  };

  useEffect(() => {
    setFullName(userDetails.FullName);
    setAvatar(userDetails.avatar);
  }, [userDetails]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (userDetails.FullName && (userDetails.avatar || avatarFile)) {
      const res = await updateProfile(fullName, avatarFile || "");
      setIsEditing(false);
      setFullName(res.FullName);
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-10 ">
      <Card className="max-w-4xl pb-12 mx-auto">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          <Button
            onClick={toggleEdit}
            variant="outline"
            className="mt-4 sm:mt-0"
          >
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <PenSquare className="mr-2 h-4 w-4" /> Edit Profile
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatar} alt={fullName} />
                  <AvatarFallback>
                    {userDetails.FullName?.split(" ")
                      .map((n: Array<string>) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div>
                    <Label
                      htmlFor="avatar"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change Avatar
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="flex items-center space-x-2">
                    <User className="text-gray-400" />
                    {isEditing ? (
                      <Input
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span>{fullName}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="text-gray-400" />
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={userDetails.email}
                        readOnly
                      />
                    ) : (
                      <span>{userDetails.email}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="text-gray-400" />
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={user.phone}
                      />
                    ) : (
                      <span>{user.phone}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-gray-400" />
                    {isEditing ? (
                      <Input
                        id="location"
                        name="location"
                        defaultValue={user.location}
                      />
                    ) : (
                      <span>{user.location}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="text-gray-400" />
                    {isEditing ? (
                      <Input
                        id="occupation"
                        name="occupation"
                        defaultValue={user.occupation}
                      />
                    ) : (
                      <span>{user.occupation}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={user.bio}
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{user.bio}</p>
                )}
              </div>
              {isEditing && (
                <Button
                  onClick={handleSaveChanges}
                  className="mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
