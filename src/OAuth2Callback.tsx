import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from './services/api';
import { setUICache } from './utils/userStorage';

const OAuth2Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'error'>('loading');

    useEffect(() => {
        // Lấy mã 'code' từ URL mà Google trả về
        const code = searchParams.get('code');

        if (!code) {
            // Không có code → mở lại modal đăng nhập thay vì 404
            navigate('/');
            window.dispatchEvent(new Event('open-auth-modal'));
            return;
        }

        // Lấy lại đúng redirectUri mà frontend đã dùng để yêu cầu code ban đầu
        const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/callback`);

        // Gửi code xuống API backend — BE sẽ set httpOnly cookie, không trả token trong body
        api.post(`/auth/outbound/authentication?code=${code}&redirectUri=${redirectUri}`)
            .then(async (response) => {
                const data = response.data;
                if (data.code === 1000) {
                    // Cookie đã được set tự động bởi BE
                    try {
                        const userRes = await api.get('/user/my');
                        // ✅ Chỉ lưu 3 field tối giản – không lưu email/role/...
                        setUICache(userRes.data.result);
                        window.dispatchEvent(new Event('user-update'));
                    } catch (err) {
                        console.error('Lỗi lấy thông tin user sau Google login:', err);
                    }
                    navigate('/');
                } else {
                    console.error('Lỗi xác thực Google:', data.message);
                    setStatus('error');
                    // Sau 2 giây mở lại modal đăng nhập — không 404
                    setTimeout(() => {
                        navigate('/');
                        window.dispatchEvent(new Event('open-auth-modal'));
                    }, 2000);
                }
            })
            .catch((error) => {
                console.error('Lỗi kết nối backend (Google OAuth):', error);
                setStatus('error');
                setTimeout(() => {
                    navigate('/');
                    window.dispatchEvent(new Event('open-auth-modal'));
                }, 2000);
            });
    }, [searchParams, navigate]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            gap: 16,
            color: '#a0a0a0',
        }}>
            {status === 'loading' ? (
                <>
                    <div style={{
                        width: 40, height: 40,
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTop: '3px solid #e91e8c',
                        borderRadius: '50%',
                        animation: 'oauth-spin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes oauth-spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ margin: 0, fontSize: 15 }}>Đang xác thực tài khoản Google...</p>
                </>
            ) : (
                <p style={{ margin: 0, fontSize: 15, color: '#ff6b6b' }}>
                    Đăng nhập thất bại. Đang quay lại...
                </p>
            )}
        </div>
    );
};

export default OAuth2Callback;