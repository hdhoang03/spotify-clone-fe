// components/Search/index.tsx
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CategoryCard from './CategoryCard';
import SearchResults from './SearchResult';
import { useSearchStore } from '../../hooks/useSearch';

// 1. MOCK DATA: Danh sách thể loại (Sau này lấy từ API /api/genres)
const MOCK_CATEGORIES = [
  { id: 1, title: 'Nhạc Việt', color: 'bg-purple-600' },
  { id: 2, title: 'Pop Quốc Tế', color: 'bg-green-600' },
  { id: 3, title: 'Hip-Hop', color: 'bg-orange-500' },
  { id: 4, title: 'Code Java', color: 'bg-blue-600' },
  { id: 5, title: 'Lofi Chill', color: 'bg-teal-600' },
  { id: 6, title: 'EDM', color: 'bg-pink-600' },
  { id: 7, title: 'Indie', color: 'bg-indigo-500' },
  { id: 8, title: 'Rock', color: 'bg-red-600' },
];

const SearchPage = () => {
  // const [query, setQuery] = useState('');
  const { query, setQuery } = useSearchStore();

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Nếu cuộn quá 10px thì đổi trạng thái
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="p-4 md:p-8 pb-24 min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white">
      
      {/* Ẩn thanh search này ở màn hình md (Desktop/Tablet) vì đã có trên Header */}
      <div 
        className={`
          md:hidden sticky top-0 z-20 -mx-4 px-4 mb-6
          transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'py-2 bg-gray-50/98 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 shadow-sm' 
            : 'py-4 bg-transparent border-transparent'
          }
        `}
      >
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Logic điều kiện: Có query thì hiện Results, không thì hiện Categories */}
      {query ? (
        <SearchResults query={query} />
      ) : (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-xl font-bold mb-4">Duyệt tìm tất cả</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MOCK_CATEGORIES.map((cat, index) => (
              <div 
                key={cat.id} 
                onClick={() => {
                    // Ví dụ: Điều hướng đến trang thể loại
                    // navigate(`/genre/${cat.id}`); 
                    console.log("Navigating to category:", cat.title);
                }}
                className="cursor-pointer"
              >
                  <CategoryCard 
                    title={cat.title} 
                    color={cat.color}
                    index={index}
                  />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;