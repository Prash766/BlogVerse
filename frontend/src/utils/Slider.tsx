import { Code, Image, Link, VideoIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useRef } from 'react';
import { useSetRecoilState } from "recoil";
import { AttachmentClicked } from "@/atoms/blog";


interface proptype{
  focusedArea:string
}

const Slider = ({focusedArea}:proptype) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setIsAttachmentClicked = useSetRecoilState(AttachmentClicked)

  const handleFileSelection = () => {
    if (fileInputRef.current) {
        setIsAttachmentClicked(false)
      fileInputRef.current.click();

    }
  };

  return (
    <motion.div
      className={`absolute bg-transparent w-44 h-12 ${focusedArea==="title"? "top-3 pl-2 pb-2" : "-top-1 pl-2"} flex items-center space-x-2 left-16`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          console.log(e.target.files);
        }}
      />

      <div
        className="cursor-pointer hover:scale-105 transition-transform"
        onClick={handleFileSelection}
      >
        <Image size={35} strokeWidth={1} color="black" />
      </div>
      <div
        className="cursor-pointer hover:scale-105 transition-transform"
        onClick={handleFileSelection}
      >
        <VideoIcon size={35} strokeWidth={1} color="black" />
      </div>
      <div className="cursor-pointer hover:scale-105 transition-transform">
        <Code size={35} strokeWidth={1} color="black" />
      </div>
      <div className="cursor-pointer hover:scale-105 transition-transform">
        <Link size={35} strokeWidth={1} color="black" />
      </div>
    </motion.div>
  );
};


export default Slider