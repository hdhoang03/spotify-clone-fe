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
                        <div key={user.id} className={`bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl p-5 rounded-2xl border shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start gap-4 relative group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5
                            ${isAdmin ? 'border-purple-500/20 dark:border-purple-500/10' : 'border-zinc-200/50 dark:border-zinc-800/40 hover:border-emerald-500/30'}`}>

                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 ring-2 ring-transparent group-hover:ring-purple-500/10 transition-all duration-300">
                                <img
                                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate tracking-tight text-[15px]">{user.name}</h3>
                                    {isAdmin && (
                                        <Shield size={13} className="text-purple-500 fill-purple-500/10 dark:fill-purple-950/30" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono tracking-tighter">@{user.username}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{user.email}</p>
                                </div>

                                {/* Badges */}
                                <div className="flex gap-2 mt-3.5">
                                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border tracking-wider ${isAdmin
                                        ? 'bg-purple-50/50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400'
                                        : 'bg-zinc-100 text-zinc-600 border-zinc-200/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400'
                                        }`}>
                                        {user.roles[0]?.name || 'USER'}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border tracking-wider ${user.enabled
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/20 dark:text-emerald-400'
                                        : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/20 dark:text-rose-450'
                                        }`}>
                                        {user.enabled ? 'Active' : 'Banned'}
                                    </span>
                                </div>
                            </div>

                            {/* Action Menu */}
                            {/* Nếu là ADMIN -> Không hiện nút hoặc hiện nút khóa (disabled) */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {isAdmin ? (
                                    <div className="p-2 text-zinc-300 dark:text-zinc-700 cursor-not-allowed" title="Không thể tác động lên Admin">
                                        <Lock size={15} />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onToggleStatus(user.id)}
                                        className={`p-2 rounded-xl transition duration-300 shadow-sm ${user.enabled
                                            ? 'bg-rose-50/80 text-rose-500 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40'
                                            : 'bg-emerald-50/80 text-emerald-500 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40'}`}
                                        title={user.enabled ? "Vô hiệu hóa" : "Kích hoạt lại"}
                                    >
                                        {user.enabled ? <ShieldAlert size={15} /> : <UserCheck size={15} />}
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