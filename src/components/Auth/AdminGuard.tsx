import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../../services/api';

type GuardStatus = 'loading' | 'allowed' | 'denied';

const AdminGuard = () => {
    const [status, setStatus] = useState<GuardStatus>('loading');

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Không có token → từ chối ngay, không cần gọi API
        if (!token || token === 'null' || token === 'undefined') {
            setStatus('denied');
            return;
        }

        // Gọi API thực để xác minh role từ SERVER
        // KHÔNG tin tưởng localStorage vì có thể bị giả mạo qua DevTools
        api.get('/user/my')
            .then(res => {
                const user = res.data?.result;
                const isAdmin = user?.roles?.some((role: any) => role.name === 'ADMIN');

                if (isAdmin) {
                    // Đồng bộ lại localStorage với dữ liệu thật từ server
                    localStorage.setItem('user', JSON.stringify(user));
                    setStatus('allowed');
                } else {
                    console.warn('[AdminGuard] Truy cập bị từ chối. Roles:', user?.roles);
                    setStatus('denied');
                }
            })
            .catch((err) => {
                console.error('[AdminGuard] Lỗi xác minh quyền:', err);
                setStatus('denied');
            });
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0c0c0e]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400 text-sm">Đang xác minh quyền truy cập...</p>
                </div>
            </div>
        );
    }

    if (status === 'denied') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminGuard;