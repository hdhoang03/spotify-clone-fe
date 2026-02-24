// import { useState, useEffect, useCallback } from 'react';
// import api from '../../../services/api'; // Import api instance
// import type { CategoryResponse } from '../../../types/backend';

// export const useCategoryLogic = () => {
//     const [categories, setCategories] = useState<CategoryResponse[]>([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isDeletedView, setIsDeletedView] = useState(false);

//     // 1. Hàm lấy dữ liệu từ API thật
//     const fetchCategories = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const res = await api.get('/categories/list', {
//                 params: {
//                     keyword: searchTerm,
//                     page: 1,
//                     size: 50, // Lấy nhiều để hiển thị hoặc bạn có thể làm phân trang thêm
//                     isDeleted: isDeletedView
//                 }
//             });
//             setCategories(res.data.result.content);
//         } catch (error) {
//             console.error("Lỗi fetch categories:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [searchTerm, isDeletedView]);

//     // 2. Tự động fetch khi gõ tìm kiếm (debounce)
//     useEffect(() => {
//         const timer = setTimeout(() => fetchCategories(), 500);
//         return () => clearTimeout(timer);
//     }, [fetchCategories]);

//     const openCreateModal = () => { setSelectedCategory(null); setIsModalOpen(true); };
//     const openEditModal = (e: React.MouseEvent, cat: CategoryResponse) => {
//         e.stopPropagation();
//         setSelectedCategory(cat);
//         setIsModalOpen(true);
//     };
//     const closeModal = () => setIsModalOpen(false);

//     // 3. Gọi API xóa vĩnh viễn
//     const handleDelete = async (e: React.MouseEvent, id: string) => {
//         e.stopPropagation();
//         if (window.confirm("Xóa danh mục này sẽ chuyển tất cả bài hát về 'Others'. Bạn chắc chắn chứ?")) {
//             try {
//                 await api.delete(`/categories/delete/${id}`);
//                 fetchCategories();
//             } catch (error) {
//                 alert("Xóa thất bại!");
//             }
//         }
//     };

//     const handleRestore = async (id: string) => {
//         if (window.confirm("Bạn muốn khôi phục danh mục này?")) {
//             try {
//                 await api.patch(`/categories/restore/${id}`); // Gọi API khôi phục mới
//                 fetchCategories(); // Load lại danh sách thùng rác
//             } catch (error) {
//                 alert("Khôi phục thất bại!");
//             }
//         }
//     };

//     // 4. Gọi API Create/Update với FormData
//     const handleSubmit = async (formData: FormData) => {
//         try {
//             const config = { headers: { 'Content-Type': 'multipart/form-data' } };
//             if (selectedCategory) {
//                 await api.put(`/categories/update/${selectedCategory.id}`, formData, config);
//             } else {
//                 await api.post('/categories/create', formData, config);
//             }
//             fetchCategories();
//             closeModal();
//         } catch (error: any) {
//             alert(error.response?.data?.message || "Lỗi khi lưu!");
//         }
//     };

//     return {
//         categories, searchTerm, setSearchTerm, isModalOpen, selectedCategory, isLoading,
//         openCreateModal, openEditModal, closeModal, handleDelete, handleSubmit, isDeletedView,
//         setIsDeletedView,
//         handleRestore
//     };
// };

import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { CategoryResponse } from '../../../types/backend';

export const useCategoryLogic = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeletedView, setIsDeletedView] = useState(false);

    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const ITEMS_PER_PAGE = 10; // Thay đổi số lượng item trên 1 trang ở đây (ví dụ: 5, 8, 10)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    // Reset về trang 1 khi tìm kiếm hoặc đổi view (Thùng rác/Hoạt động)
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, isDeletedView]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 1. Hàm lấy dữ liệu từ API thật
    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/categories/list', {
                params: {
                    keyword: searchTerm,
                    page: currentPage,     // Đã thay đổi: Dùng currentPage thay vì 1
                    size: ITEMS_PER_PAGE,  // Đã thay đổi: Dùng ITEMS_PER_PAGE thay vì 50
                    isDeleted: isDeletedView
                }
            });

            // Trích xuất dữ liệu phân trang từ Backend
            const { content, totalElements, totalPages: tPages } = res.data.result;

            setCategories(content);
            setTotalItems(totalElements);
            setTotalPages(tPages);

        } catch (error) {
            console.error("Lỗi fetch categories:", error);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, isDeletedView, currentPage]);

    // 2. Tự động fetch khi gõ tìm kiếm (debounce)
    useEffect(() => {
        const timer = setTimeout(() => fetchCategories(), 500);
        return () => clearTimeout(timer);
    }, [fetchCategories]);

    const openCreateModal = () => { setSelectedCategory(null); setIsModalOpen(true); };
    const openEditModal = (e: React.MouseEvent, cat: CategoryResponse) => {
        e.stopPropagation();
        setSelectedCategory(cat);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    // 3. Gọi API xóa vĩnh viễn
    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Xóa danh mục này sẽ chuyển tất cả bài hát về 'Others'. Bạn chắc chắn chứ?")) {
            try {
                await api.delete(`/categories/delete/${id}`);
                fetchCategories();
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleRestore = async (id: string) => {
        if (window.confirm("Bạn muốn khôi phục danh mục này?")) {
            try {
                await api.patch(`/categories/restore/${id}`);
                fetchCategories();
            } catch (error) {
                alert("Khôi phục thất bại!");
            }
        }
    };

    // 4. Gọi API Create/Update với FormData
    const handleSubmit = async (formData: FormData) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (selectedCategory) {
                await api.put(`/categories/update/${selectedCategory.id}`, formData, config);
            } else {
                await api.post('/categories/create', formData, config);
            }
            fetchCategories();
            closeModal();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi lưu!");
        }
    };

    return {
        categories, searchTerm, setSearchTerm, isModalOpen, selectedCategory, isLoading,
        openCreateModal, openEditModal, closeModal, handleDelete, handleSubmit, isDeletedView,
        setIsDeletedView, handleRestore,

        // TRẢ VỀ CÁC BIẾN PHÂN TRANG:
        startIndex, currentPage, totalPages, totalItems, handlePageChange
    };
};