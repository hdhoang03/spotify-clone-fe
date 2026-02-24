import { Plus } from 'lucide-react';

interface ArtistHeaderProps {
    onCreate: () => void;
}

export const ArtistHeader = ({ onCreate }: ArtistHeaderProps) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Nghệ sĩ</h1>
            <p className="text-sm text-gray-500">Danh sách nghệ sĩ và thống kê hoạt động.</p>
        </div>
        <button
            onClick={onCreate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-purple-600/20 transition"
        >
            <Plus size={20} /> Thêm nghệ sĩ
        </button>
    </div>
);