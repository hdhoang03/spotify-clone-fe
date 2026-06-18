import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from './services/api';

const OAuth2Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy mã 'code' từ URL mà Google trả về
        const code = searchParams.get('code');

        if (code) {
            // Gửi code xuống API backend của bạn https://cw33tbhh-8080.asse.devtunnels.ms/
            fetch(`http://localhost:8080/spotify/auth/outbound/authentication?code=${code}`, {
                method: 'POST',
            })
                .then((response) => response.json())
                .then(async (data) => {
                    if (data.code === 1000) {
                        // Đăng nhập thành công, lưu Token vào localStorage
                        localStorage.setItem('token', data.result.token);

                        // Lấy thông tin user (giống với login bình thường)
                        try {
                            const userRes = await api.get('/user/my');
                            localStorage.setItem('user', JSON.stringify(userRes.data.result));
                            window.dispatchEvent(new Event('user-update')); // Bắn event để Header update
                        } catch (err) {
                            console.error("Lỗi lấy thông tin user:", err);
                        }

                        navigate('/');
                    } else {
                        console.error("Lỗi xác thực:", data.message);
                        navigate('/login'); // Lỗi thì đẩy về lại trang login
                    }
                })
                .catch((error) => {
                    console.error("Lỗi kết nối backend:", error);
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex justify-center items-center h-screen text-white">
            {/* Bạn có thể tạo một UI loading đẹp hơn ở đây */}
            <h2>Đang xử lý đăng nhập Google... Vui lòng đợi!</h2>
        </div>
    );
};

export default OAuth2Callback;