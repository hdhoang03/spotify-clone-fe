import { useArtistLogic } from './useArtistLogic';
import { ArtistHeader } from './ArtistHeader';
import { ArtistFilter } from './ArtistFilter';
import { ArtistGrid } from './ArtistGrid'
import ArtistModal from '../Modals/ArtistModal';
import ConfirmModal from '../ConfirmModal';

const ArtistManagement = () => {
    const {
        filteredArtists,
        searchTerm,
        isModalOpen,
        selectedArtist,
        setSearchTerm,
        handleCreateClick,
        handleEditClick,
        handleFormSubmit,
        closeModal,
        viewDeleted,
        setViewDeleted,
        handleDeleteClick,
        handleRestoreClick,
        handleHardDeleteClick,
        confirmModal,      // State modal
        executeAction,     // Hàm xác nhận
        closeConfirmModal,
        startIndex,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = useArtistLogic();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <ArtistHeader onCreate={handleCreateClick} />

            <ArtistFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                viewDeleted={viewDeleted}
                onViewDeletedChange={setViewDeleted}
            />

            <ArtistGrid
                artists={filteredArtists}
                searchTerm={searchTerm}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                isViewDeleted={viewDeleted}
                onRestore={handleRestoreClick}
                onHardDelete={handleHardDeleteClick}
                startIndex={startIndex}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />

            {/* Modal Tạo/Sửa */}
            <ArtistModal
                isOpen={isModalOpen}
                onClose={closeModal}
                artistData={selectedArtist}
                onSubmit={handleFormSubmit}
            />

            {/* Modal Xác nhận Xóa/Khôi phục */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={executeAction}
                type={confirmModal.type}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div>
    );
};

export default ArtistManagement;