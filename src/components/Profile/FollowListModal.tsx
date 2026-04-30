// // src/components/Profile/FollowListModal.tsx
// import { useEffect, useState } from 'react';
// import { X, User, Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../services/api'; // Đường dẫn đến file api của bạn

// interface FollowListModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     userId: string;
//     type: 'followers' | 'following';
// }

// const FollowListModal = ({ isOpen, onClose, userId, type }: FollowListModalProps) => {
//     const navigate = useNavigate();
//     const [users, setUsers] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         if (!isOpen) return;
//         const fetchUsers = async () => {
//             setIsLoading(true);
//             try {
//                 // Tùy thuộc vào API Backend của bạn. Ở đây mình ví dụ gọi API lấy danh sách:
//                 const endpoint = type === 'followers'
//                     ? `/user/${userId}/followers` // Đổi thành đường dẫn thật của bạn
//                     : `/user/${userId}/following`;

//                 const res = await api.get(endpoint);
//                 if (res.data.code === 1000) {
//                     setUsers(res.data.result.content || res.data.result || []);
//                 }
//             } catch (error) {
//                 console.error(`Lỗi lấy danh sách ${type}:`, error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchUsers();
//     }, [isOpen, userId, type]);

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
//             <div className="bg-[#282828] w-full max-w-md rounded-xl shadow-2xl flex flex-col h-[60vh] overflow-hidden m-4">
//                 {/* Header */}
//                 <div className="flex justify-between items-center p-4 border-b border-white/10">
//                     <h2 className="text-xl font-bold text-white capitalize">{type}</h2>
//                     <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-full"><X size={20} /></button>
//                 </div>

//                 {/* Body List */}
//                 <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
//                     {isLoading ? (
//                         <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-green-500" /></div>
//                     ) : users.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center h-full text-zinc-500">
//                             <User size={48} className="mb-4 opacity-20" />
//                             <p>Không có người dùng nào</p>
//                         </div>
//                     ) : (
//                         users.map((u) => (
//                             <div
//                                 key={u.id}
//                                 onClick={() => {
//                                     onClose();
//                                     navigate(`/user/${u.id}/profile`);
//                                 }}
//                                 className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-md cursor-pointer transition-colors"
//                             >
//                                 <img
//                                     src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.username || u.name}`}
//                                     alt={u.username || u.name}
//                                     className="w-12 h-12 rounded-full object-cover"
//                                 />
//                                 <div className="flex flex-col">
//                                     <span className="font-bold text-white">{u.name || u.username}</span>
//                                     <span className="text-sm text-zinc-400">Profile</span>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FollowListModal;

// src/components/Profile/FollowListModal.tsx
import { useEffect, useState } from 'react';
import { X, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface FollowListModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    type: 'followers' | 'following';
}

const FollowListModal = ({ isOpen, onClose, userId, type }: FollowListModalProps) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const endpoint = type === 'followers' ? `/user/${userId}/followers` : `/user/${userId}/following-users`;
                const res = await api.get(endpoint);
                if (res.data.code === 1000) {
                    setUsers(res.data.result.content || res.data.result || []);
                }
            } catch (error) {
                console.error(`Lỗi lấy danh sách ${type}:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [isOpen, userId, type]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#282828] w-full max-w-md rounded-xl shadow-2xl flex flex-col h-[60vh] overflow-hidden m-4 border border-zinc-200 dark:border-white/10">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-white/10">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white capitalize">{type}</h2>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-black dark:hover:text-white rounded-full transition"><X size={20} /></button>
                </div>

                {/* Body List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-green-500" /></div>
                    ) : users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
                            <User size={48} className="mb-4 opacity-30" />
                            <p>Không có người dùng nào</p>
                        </div>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u.id}
                                onClick={() => {
                                    onClose();
                                    navigate(`/user/${u.id}/profile`);
                                }}
                                className="flex items-center gap-4 p-3 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors"
                            >
                                <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.name || u.username}`} alt="avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-zinc-900 dark:text-white">{u.name || u.username}</span>
                                    <span className="text-xs font-medium text-zinc-500">Profile</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;