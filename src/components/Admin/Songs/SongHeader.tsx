import { Plus } from 'lucide-react';

interface SongHeaderProps {
    onCreate: () => void;
}

export const SongHeader = ({ onCreate }: SongHeaderProps) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Bài hát</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Quản lý kho nhạc, lượt nghe và thông tin chi tiết.</p>
        </div>
        <button
            onClick={onCreate}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition shadow-lg shadow-green-500/20"
        >
            <Plus size={20} /> Thêm bài hát
        </button>
    </div>
);