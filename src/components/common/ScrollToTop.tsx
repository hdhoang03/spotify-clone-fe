import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.scrollTo({
                top: 0,
                behavior: "smooth" // "smooth" nếu muốn trượt mượt, "instant" để lên ngay lập tức
            });
        }
    }, [pathname]); // Chạy lại mỗi khi pathname thay đổi

    return null; // Component này không render gì cả
};

export default ScrollToTop;