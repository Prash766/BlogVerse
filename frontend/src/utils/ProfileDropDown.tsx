import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/atoms/user";
import { useNavigate } from "react-router-dom";
import LogoutSkeleton from "./LogoutSkeleton";
import { useState } from "react";
import { axiosClient } from "@/axios/axios";

const ProfileDropDown = () => {
  const UserDetails = useRecoilValue(userInfo);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/user/logout');
      if (res.status === 200) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LogoutSkeleton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 group">
        <span className="text-muted-foreground group-hover:text-slate-800">
          {UserDetails.FullName}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>My Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout} disabled={isLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
