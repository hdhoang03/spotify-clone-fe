import { useUserLogic } from './useUserLogic';
import { UserHeader } from './UserHeader';
import { UserFilter } from './UserFilter';
import { UserGrid } from './UserGrid';
import CreateUserModal from '../Modals/CreateUserModal';
import ConfirmModal from '../ConfirmModal';

const UserManagement = () => {
    const {
        paginatedUsers,
        totalItems,
        totalPages,
        currentPage,
        startIndex,
        keyword,
        statusFilter,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleSearchChange,
        handleStatusFilterChange,
        handlePageChange,
        handleCreateUser,

        // Props cho Modal Xác nhận
        handleToggleStatusClick,
        confirmModal,
        executeStatusChange,
        closeConfirmModal
    } = useUserLogic();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <UserHeader
                onCreate={() => setIsCreateModalOpen(true)}
                totalCount={totalItems}
            />

            <UserFilter
                keyword={keyword}
                onSearchChange={handleSearchChange}
                statusFilter={statusFilter}
                onStatusChange={handleStatusFilterChange}
            />

            <UserGrid
                users={paginatedUsers}
                onToggleStatus={handleToggleStatusClick}
                startIndex={startIndex}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />

            {/* Modal Tạo mới */}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateUser}
            />

            {/* Modal Xác nhận (Tái sử dụng) */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={executeStatusChange}
                type={confirmModal.type}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div>
    );
};

export default UserManagement;