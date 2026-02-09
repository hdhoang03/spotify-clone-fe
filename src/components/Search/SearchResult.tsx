// components/Search/SearchResults.tsx
import React from 'react';
import { Play, Heart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchResultsProps {
  query: string;
}

// Mock Data kết quả tìm kiếm
const MOCK_RESULTS = [
  { id: 1, title: 'Spring Boot Pro', artist: 'Java Dev', album: 'Backend Hits', duration: '3:45', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop' },
  { id: 2, title: 'Debugging All Night', artist: 'Fullstack', album: 'Midnight Code', duration: '4:20', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop' },
  { id: 3, title: 'React Hooks', artist: 'Frontend Team', album: 'Render Cycle', duration: '2:50', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop' },
];

const SearchResults = ({ query }: SearchResultsProps) => {
  const results = MOCK_RESULTS; //thực tế sẽ lấy từ API

  if (!query) return null;

  return (
    <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Kết quả hàng đầu cho "{query}"</h2>
      
      <div className="flex flex-col gap-1">
        {results.map((song, index) => (
          <motion.div 
            key={song.id}
            initial={{ opacity: 0, y: -10 }} // Bắt đầu: Ẩn và nằm thấp
            animate={{ opacity: 1, y: 0 }}  // Kết thúc: Hiện và về vị trí chuẩn
            transition={{ 
                duration: 0.3, 
                delay: index * 0.05 // Delay tăng dần theo thứ tự: 0s, 0.1s, 0.2s...
            }}
            className="group flex items-center justify-between p-2 rounded-lg 
                       hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {/* Image & Play Overlay */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <img src={song.img} alt={song.title} className="w-full h-full object-cover rounded shadow-sm" loading="lazy"/>
                <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Play size={20} className="text-white fill-white translate-y-1 group-hover:translate-y-0 transition-transform duration-200" />
                </div>
              </div>

              {/* Info */}
              <div className="min-w-0"> {/* min-w-0 giúp text truncate hoạt động */}
                <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{song.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{song.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button className="p-2 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-400 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Heart size={18} />
               </button>
               <span className="text-sm text-gray-500">
                  {song.duration}
               </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;