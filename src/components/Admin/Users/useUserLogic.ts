import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { UserResponse, UserCreationRequest } from '../../../types/backend';
import type { ConfirmActionType } from '../ConfirmModal';

const ITEMS_PER_PAGE = 6;

export type UserStatusFilter = 'all' | 'active' | 'banned';

export const useUserLogic = () => {
    // 1. STATE TỪ BACKEND
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // STATE ĐIỀU KHIỂN UI
    const [keyword, setKeyword] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // STATE CHO MODAL XÁC NHẬN
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean; type: ConfirmActionType; id: string | null; title: string; message: string;
    }>({ isOpen: false, type: 'DELETE_SOFT', id: null, title: '', message: '' });

    // 2. CHỐNG SPAM API (DEBOUNCE SEARCH)
    // Khi người dùng gõ phím, đợi 500ms không gõ nữa mới cập nhật debouncedKeyword để gọi API
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedKeyword(keyword), 500);
        return () => clearTimeout(timer);
    }, [keyword]);

    // 3. FETCH API LOGIC
    const fetchUsers = useCallback(async () => {
        try {
            // Gọi API GET /user/list với các tham số phân trang
            const response = await api.get('/user/list', {
                params: {
                    keyword: debouncedKeyword,
                    page: currentPage,
                    size: ITEMS_PER_PAGE
                }
            });

            // Lấy dữ liệu từ wrapper ApiResponse -> Page
            const pageData = response.data.result;

            setUsers(pageData.content);
            setTotalPages(pageData.totalPages);
            setTotalItems(pageData.totalElements);

        } catch (error) {
            console.error("Lỗi khi tải danh sách user:", error);
        }
    }, [debouncedKeyword, currentPage]); // Gọi lại API khi từ khóa hoặc trang thay đổi

    // Kích hoạt gọi API
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Lọc trạng thái (Tạm thời lọc ở Frontend vì Backend chưa hỗ trợ lọc theo enabled)
    const paginatedUsers = users.filter(user => {
        if (statusFilter === 'active') return user.enabled === true;
        if (statusFilter === 'banned') return user.enabled === false;
        return true;
    });

    // 4. HANDLERS
    const handlePageChange = (newPage: number) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };
    const handleSearchChange = (val: string) => { setKeyword(val); setCurrentPage(1); };
    const handleStatusFilterChange = (val: UserStatusFilter) => { setStatusFilter(val); setCurrentPage(1); };

    // --- LOGIC: BẤM NÚT KHÓA/MỞ KHÓA TÀI KHOẢN ---
    const handleToggleStatusClick = (id: string) => {
        const targetUser = users.find(u => u.id === id);
        if (!targetUser) return;
        if (targetUser.roles.some(r => r.name === 'ADMIN')) {
            alert("Không thể thay đổi trạng thái của tài khoản Quản trị viên!");
            return;
        }

        const isBanning = targetUser.enabled;
        setConfirmModal({
            isOpen: true,
            id: id,
            type: isBanning ? 'DELETE_SOFT' : 'RESTORE',
            title: isBanning ? 'Vô hiệu hóa tài khoản?' : 'Kích hoạt lại tài khoản?',
            message: isBanning
                ? `Bạn có chắc muốn khóa tài khoản "${targetUser.username}"?`
                : `Tài khoản "${targetUser.username}" sẽ được mở khóa.`
        });
    };

    // --- LOGIC: THỰC THI GỌI API ĐỔI TRẠNG THÁI ---
    const executeStatusChange = async () => {
        const { id } = confirmModal;
        if (id) {
            try {
                // Gọi API bằng Axios thay vì chỉ setUsers giả lập
                await api.put(`/user/toggle-status/${id}`);

                // Cập nhật lại state trên UI cho nhanh mượt mà không cần load lại trang
                setUsers(prev => prev.map(u =>
                    u.id === id ? { ...u, enabled: !u.enabled } : u
                ));
            } catch (error: any) {
                console.error("Lỗi thay đổi trạng thái:", error);
                alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!");
            }
        }
        closeConfirmModal();
    };

    const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

    // --- LOGIC: GỌI API TẠO USER MỚI ---
    const handleCreateUser = async (data: UserCreationRequest) => {
        try {
            await api.post('/user/create', data);
            alert(`Đã tạo người dùng ${data.username} thành công!`);
            setIsCreateModalOpen(false);
            setCurrentPage(1); // Quay về trang 1
            setKeyword(''); // Xóa ô tìm kiếm
            fetchUsers(); // Gọi lại API để lấy data mới nhất
        } catch (error: any) {
            alert(error.response?.data?.message || "Tạo người dùng thất bại!");
        }
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return {
        paginatedUsers, totalItems, totalPages, currentPage, startIndex,
        keyword, statusFilter, isCreateModalOpen, setIsCreateModalOpen,
        handleSearchChange, handleStatusFilterChange, handlePageChange, handleCreateUser,
        handleToggleStatusClick, confirmModal, executeStatusChange, closeConfirmModal
    };
};