import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlaylistCardProps {
    title: string;
    description: string;
    imageUrl: string;
    index?: number;
}

const PlaylistCard = ({ title, description, imageUrl, index = 0}: PlaylistCardProps) => {
    return (
        <motion.div 
            // 2. Hiệu ứng xuất hiện (Fade In + Slide Up)
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }} // Delay dựa trên thứ tự
            
            // 3. Hiệu ứng Hover (Nảy nhẹ)
            whileHover={{ y: -5, scale: 1.02 }}
            
            className="group relative p-3 md:p-4 rounded-lg 
            bg-zinc-100/50 dark:bg-[#181818] 
            hover:bg-zinc-200 dark:hover:bg-[#282828] 
            transition-colors duration-300 cursor-pointer ease-out"
        >
            <div className="relative mb-3 md:mb-4 shadow-md rounded-md overflow-hidden aspect-square">
                <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
                
                {/* Nút Play: Dùng motion.button để nảy khi hiện */}
                <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-2 right-2 
                               w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full 
                               flex items-center justify-center shadow-xl text-black
                               opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2
                               transition-all duration-300"
                >
                    <Play fill="black" size={20} className="ml-1 md:w-6 md:h-6"/>
                </motion.button>
            </div>
            
            <h3 className="font-bold text-zinc-900 dark:text-white mb-1 truncate text-sm md:text-base">
                {title}
            </h3>
            <p className="text-zinc-500 dark:text-gray-400 line-clamp-2 text-xs md:text-sm font-medium">
                {description}
            </p>
        </motion.div>
    );
};

export default PlaylistCard;