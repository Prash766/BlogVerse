import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="max-w-full flex justify-between items-center py-2">
      <div className="flex gap-3 pl-4 items-center">
        <Edit className="-pt-1 mt-1" />
        <span className="text-2xl font-bold">
            
        <NavLink to='/'>BlogVerse</NavLink>
            </span>
      </div>

      <ul className="flex gap-4 pt-0.5"> 
        <li className="cursor-pointer hover:underline">Home</li>
        <li className="cursor-pointer hover:underline">About</li>
        <li className="cursor-pointer hover:underline">Categories</li>
      </ul>

      <div className="flex gap-2 pr-4 items-center">
        <Button className="bg-white text-black py-2 px-4 hover:bg-slate-200">
        <NavLink to='/login'>Log in</NavLink>
            </Button>
        <Button className="bg-black text-white py-2 px-5 hover:bg-slate-800">
        <NavLink to='/signup'>Sign Up</NavLink>

            </Button>
      </div>
    </div>
  );
};

export default NavBar;
