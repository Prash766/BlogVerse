import { motion } from "framer-motion";
import { PenBox, Search, TrendingUp, Users } from "lucide-react"; 

type PropType = {
  title: string;
  description: string;
  icon: string; 
};

const iconMap: { [key: string]: React.ComponentType<{ size?: string | number }> } = {
  "PenBox": PenBox,
  "TrendingUp":TrendingUp,
  "Search":Search,
 "Users": Users,
};

const Card = ({ title, description, icon }: PropType) => {
  const IconComponent = iconMap[icon] || PenBox; 

  return (
    <motion.div
      className="w-50 p-4 bg-white rounded-lg shadow-lg flex flex-col items-center text-center space-y-2 hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        whileHover={{ rotate: 10 }}
        transition={{ type: "spring", stiffness: 200 }}
      >       
       <IconComponent size={50} />
      </motion.div>

      <h2 className="text-xl font-bold">
        {title}
      </h2>
      <p className="text-gray-500">
        {description}
      </p>
    </motion.div>
  );
};

export default Card;
