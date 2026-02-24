// src/pages/Admin/Categories/index.tsx
import { useCategoryLogic } from './useCategoryLogic';
import { CategoryHeader } from './CategoryHeader';
import { CategoryFilter } from './CategoryFilter';
import CategoryTable from './CategoryTable';
import CategoryModal from '../Modals/CategoryModal'; // Giữ nguyên import Modal cũ

const CategoriesManagement = () => {
    const {
        categories,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        selectedCategory,
        openCreateModal,
        openEditModal,
        closeModal,
        handleDelete,
        handleSubmit,
        isDeletedView,
        setIsDeletedView,
        handleRestore,
        startIndex,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = useCategoryLogic();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <CategoryHeader onCreate={openCreateModal} />

            {/* Cập nhật Filter */}
            <CategoryFilter
                value={searchTerm}
                onChange={setSearchTerm}
                isDeletedView={isDeletedView}
                onToggleView={setIsDeletedView}
            />

            {/* Cập nhật Table */}
            <CategoryTable
                data={categories}
                isDeletedView={isDeletedView}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onRestore={handleRestore}
                startIndex={startIndex}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />

            {/* 5. Hiển thị Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                categoryData={selectedCategory}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default CategoriesManagement;