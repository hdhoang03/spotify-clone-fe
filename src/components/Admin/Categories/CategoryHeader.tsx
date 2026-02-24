// src/pages/Admin/Categories/components/CategoryHeader.tsx
import { Plus } from 'lucide-react';

interface CategoryHeaderProps {
    onCreate: () => void;
}

export const CategoryHeader = ({ onCreate }: CategoryHeaderProps) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thể loại & Danh mục</h1>
            <p className="text-sm text-gray-500">Quản lý các dòng nhạc và phân loại bài hát.</p>
        </div>
        <button onClick={onCreate} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-pink-600/20 transition">
            <Plus size={20} /> Thêm thể loại
        </button>
    </div>
);