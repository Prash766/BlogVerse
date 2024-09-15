import { Search } from "lucide-react";

const HomeSearchBar = () => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full pl-12 outline-none pr-4 py-2 bg-gray-100 rounded-3xl border-none  shadow-sm"
        placeholder="Search"
      />
      <Search
        color="#bababa"
        size="24"
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
      />
    </div>
  );
};

export default HomeSearchBar;
