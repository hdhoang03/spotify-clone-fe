// components/Search/CategoryCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  color: string;
  onClick?: () => void;
  index?: number;
}

const CategoryCard = ({ title, color, onClick, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div 
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut",
        delay: index * 0.05 // Mẹo: Delay dựa theo index để các thẻ không hiện cùng lúc mà nối đuôi nhau
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${color} group relative overflow-hidden rounded-lg 
        aspect-[16/9] sm:aspect-square cursor-pointer p-4 shadow-md transition-shadow hover:shadow-xl
      `}
    >
      <h3 className="text-xl md:text-2xl font-bold text-white break-words max-w-[70%] leading-tight z-10 relative">
        {title}
      </h3>
      {/* Giả lập hình ảnh xoay nghiêng ở góc (giống Spotify) */}
      <div className="absolute -bottom-2 -right-4 w-24 h-24 bg-white/20 
                      rotate-[25deg] rounded-md shadow-lg 
                      transition-transform duration-500 ease-out
                      group-hover:rotate-[30deg] group-hover:scale-110 group-hover:-translate-y-1" />
    </motion.div>
  );
};

export default CategoryCard;