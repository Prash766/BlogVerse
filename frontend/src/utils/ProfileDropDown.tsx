import { useState } from "react";
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
import { axiosClient } from "@/axios/axios";

const ProfileDropDown = () => {
  const UserDetails = useRecoilValue(userInfo);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => setIsOpen(false);

  function handleProfileClick(e:React.MouseEvent) {
    e.preventDefault();
    try {
      navigate("/profile");
      closeDropdown(); // Close dropdown after clicking
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get("/user/logout");
      if (res.status === 200) {
        navigate("/", { replace: true });
      }
      closeDropdown(); // Close dropdown after logout
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LogoutSkeleton />;

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="flex items-center space-x-2 group">
          <span className="text-muted-foreground group-hover:text-slate-800">
            {UserDetails.FullName}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              handleProfileClick(e);
            }}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
              closeDropdown(); // Close dropdown after clicking dashboard
            }}
          >
            <LayoutDashboard className=" mr-2 h-4 w-4" />
            <span>My Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoading ? "Logging out..." : "Logout"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileDropDown;
