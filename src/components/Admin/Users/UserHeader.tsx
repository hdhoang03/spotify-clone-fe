import { Plus } from 'lucide-react';

interface UserHeaderProps {
    onCreate: () => void;
    totalCount: number;
}

export const UserHeader = ({ onCreate, totalCount }: UserHeaderProps) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Người dùng</h1>
            <p className="text-sm text-gray-500">
                Tổng số: <span className="font-bold text-blue-600">{totalCount}</span> tài khoản
            </p>
        </div>
        <button
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-600/20 transition transform active:scale-95"
        >
            <Plus size={20} /> Thêm tài khoản
        </button>
    </div>
);