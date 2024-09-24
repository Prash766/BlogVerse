import { motion } from 'framer-motion' 
import { useRecoilState } from 'recoil'
import { AttachmentClicked } from '@/atoms/blog'
import { PlusCircle } from 'lucide-react'


const AttachmentIcon = ({focusedArea , yPosition}:any) => {
    const [isPlusClicked , setIsPlusClicked] = useRecoilState(AttachmentClicked)
  return (
    <motion.div 
    onClick={()=>setIsPlusClicked(!isPlusClicked)}
    animate={{rotate: isPlusClicked? 45: 0} }
    transition={{duration:0.2}}
    className={`${focusedArea==='title'?`absolute top-${yPosition} left-6`:`absolute top-${yPosition}  left-8` }`}>
      

    <PlusCircle size={`${focusedArea==="title"? 42: 34}`} strokeWidth={1} />
    </motion.div>  )
}

export default AttachmentIcon
