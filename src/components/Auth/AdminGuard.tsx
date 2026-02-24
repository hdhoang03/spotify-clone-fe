import { Navigate, Outlet } from 'react-router-dom';

const AdminGuard = () => {
    // 1. Lấy dữ liệu từ localStorage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // 2. LOGIC KIỂM TRA MỚI (Chuẩn Backend)
    // Kiểm tra xem trong mảng 'roles' có phần tử nào tên là 'ADMIN' không
    // Dùng ?. để tránh lỗi nếu user hoặc roles bị null
    const isAdmin = user?.roles?.some((role: any) => role.name === 'ADMIN');

    // 3. Nếu không đăng nhập hoặc không phải Admin -> Đẩy về trang chủ
    if (!user || !isAdmin) {
        // Bạn có thể console.log ở đây để debug xem tại sao bị chặn
        console.warn("Truy cập bị từ chối. User:", user);
        return <Navigate to="/" replace />;
    }

    // 4. Nếu hợp lệ -> Cho phép đi tiếp vào các Route con (Outlet)
    return <Outlet />;
};

export default AdminGuard;