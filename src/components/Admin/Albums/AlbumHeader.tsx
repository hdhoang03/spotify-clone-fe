import { Plus } from 'lucide-react';

interface AlbumHeaderProps {
    onCreate: () => void;
}

export const AlbumHeader = ({ onCreate }: AlbumHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Album</h1>
                <p className="text-sm text-gray-500">Tạo album và gán bài hát cho nghệ sĩ.</p>
            </div>
            <button
                onClick={onCreate}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold
                py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-orange-600/20 transition"
            >
                <Plus size={20} /> Thêm Album
            </button>
        </div>
    );
};