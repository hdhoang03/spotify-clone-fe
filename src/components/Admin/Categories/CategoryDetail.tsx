import { useCategoryDetailLogic, ITEMS_PER_PAGE } from './useCategoryDetailLogic';
import { CategoryDetailHeader } from './CategoryDetailHeader';
import { CategorySongTable } from './CategorySongTable';
import AddSongToCategoryModal from '../Modals/AddSongToCategoryModal';
import ConfirmModal from '../ConfirmModal';

const CategoryDetail = () => {
    const {
        category, categorySongs, paginatedSongs, isLoading,
        isAddModalOpen, setIsAddModalOpen,
        currentPage, setCurrentPage, totalPages,
        confirmModal, closeConfirmModal,
        handleBack, handleAddSong, handleRemoveClick, executeRemoveSong
    } = useCategoryDetailLogic();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!category) return <div className="p-8 text-center text-gray-500 font-medium">Không tìm thấy danh mục này hoặc đã bị xóa.</div>;

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* Header / Info */}
            <CategoryDetailHeader
                category={category}
                songCount={categorySongs.length}
                onBack={handleBack}
            />

            {/* Bảng Danh Sách */}
            <CategorySongTable
                songs={paginatedSongs}
                totalSongsCount={categorySongs.length}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                onAddClick={() => setIsAddModalOpen(true)}
                onRemoveClick={handleRemoveClick}
            />

            {/* MODAL THÊM BÀI HÁT */}
            <AddSongToCategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                categoryId={category.id}
                currentSongIds={categorySongs.map(s => s.id)}
                onAdd={handleAddSong}
            />

            {/* MODAL XÁC NHẬN XÓA BÀI HÁT KHỎI DANH MỤC */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={executeRemoveSong}
                type="DELETE_SOFT"
                title="Xóa khỏi danh mục?"
                message="Bài hát này sẽ bị xóa khỏi danh mục hiện tại, nhưng vẫn sẽ tồn tại trong kho nhạc chung của hệ thống."
            />
        </div>
    );
};

export default CategoryDetail;