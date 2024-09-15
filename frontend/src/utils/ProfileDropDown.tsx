import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/atoms/user";
const ProfileDropDown = () => {
    const UserDetails = useRecoilValue(userInfo)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 group">
          <span className="text-muted-foreground group-hover:text-slate-800 ">
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
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileDropDown;
