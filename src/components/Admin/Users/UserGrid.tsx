import { Shield, ShieldAlert, UserCheck, Lock } from 'lucide-react';
import type { UserResponse } from '../../../types/backend';
import { Pagination } from '../../Shared/Pagination';

interface UserGridProps {
    users: UserResponse[];
    onToggleStatus: (id: string) => void;
    startIndex: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export const UserGrid = ({
    users, onToggleStatus,
    startIndex, currentPage, totalPages, totalItems, onPageChange
}: UserGridProps) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => {
                    // Kiểm tra xem User này có phải Admin không
                    const isAdmin = user.roles.some(r => r.name === 'ADMIN');

                    return (
                        <div key={user.id} className={`bg-white dark:bg-zinc-900 p-4 rounded-xl border shadow-sm flex items-start gap-4 relative group transition
                            ${isAdmin ? 'border-purple-200 dark:border-purple-900/20' : 'border-gray-200 dark:border-white/10 hover:border-blue-500/50'}`}>

                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 dark:border-zinc-700 bg-gray-100">
                                <img
                                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
                                    {isAdmin && (
                                        <Shield size={14} className="text-purple-600 fill-purple-100 dark:fill-purple-900" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-xs text-gray-500 font-mono">@{user.username}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>

                                {/* Badges */}
                                <div className="flex gap-2 mt-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isAdmin
                                        ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:border-purple-900/30'
                                        : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-400'
                                        }`}>
                                        {user.roles[0]?.name || 'USER'}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${user.enabled
                                        ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30'
                                        : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/30'
                                        }`}>
                                        {user.enabled ? 'Active' : 'Banned'}
                                    </span>
                                </div>
                            </div>

                            {/* Action Menu */}
                            {/* Nếu là ADMIN -> Không hiện nút hoặc hiện nút khóa (disabled) */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                {isAdmin ? (
                                    <div className="p-2 text-gray-300 dark:text-zinc-700 cursor-not-allowed" title="Không thể tác động lên Admin">
                                        <Lock size={16} />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onToggleStatus(user.id)}
                                        className={`p-2 rounded-lg transition shadow-sm ${user.enabled
                                            ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40'
                                            : 'bg-green-50 text-green-500 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40'}`}
                                        title={user.enabled ? "Vô hiệu hóa" : "Kích hoạt lại"}
                                    >
                                        {user.enabled ? <ShieldAlert size={16} /> : <UserCheck size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- PAGINATION (Đồng bộ style với SongTable) --- */}
            {totalItems > 0 ? (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    currentItemsCount={users.length}
                    onPageChange={onPageChange}
                    activeColorClass="bg-blue-600 shadow-blue-500/30" // Màu xanh dương cho User
                />
            ) : (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <p>Không tìm thấy người dùng nào phù hợp.</p>
                </div>
            )}
        </div>
    );
};