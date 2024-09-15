import { Edit, PenSquare, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import HomeSearchBar from "./HomeSearchBar";
import ProfileDropDown from "@/utils/ProfileDropDown";

const HomeNavBar = () => {
  return (
    <div className="w-full flex justify-between items-center bg-white px-4 lg:px-6 h-20 border-b ">
      <Link to="/home" className="flex items-center justify-center space-x-2">
        <PenSquare className="h-6 w-6 text-black" />
        <span className="font-bold text-2xl text-black">BlogVerse</span>
      </Link>

      <div className="flex-grow px-6 max-w-md">
        <HomeSearchBar />
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/write" className="flex items-center space-x-2 group">
          <Edit className="h-6 w-6 text-gray-500 group-hover:text-gray-600 transition-colors duration-300" />
          <span className="text-black group-hover:text-gray-600 transition-colors duration-300">
            Write
          </span>
        </Link>

        <button className="group relative">
          <Bell
            strokeWidth="1"
            className="h-6 w-6 text-black group-hover:text-gray-600 transition-colors duration-300"
          />
          <span className="absolute top-0 right-0 text-xs bg-red-700 text-white rounded-full px-1">
            3
          </span>
        </button>

        <Link to="#" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <ProfileDropDown />
        </Link>
      </div>
    </div>
  );
};

export default HomeNavBar;
