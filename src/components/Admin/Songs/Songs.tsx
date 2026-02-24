import { useSongLogic } from './useSongLogic';
import { SongHeader } from './SongHeader';
import { SongFilter } from './SongFilter';
import { SongTable } from './SongTable';
import CreateSongModal from '../Modals/CreateSongModal';
import UpdateSongModal from '../Modals/UpdateSongModal';
import ConfirmModal from '../ConfirmModal'; // IMPORT CONFIRM MODAL

const SongsManagement = () => {
    const {
        paginatedSongs, totalItems, totalPages, currentPage, startIndex,
        filters, isCreateModalOpen, isUpdateModalOpen, selectedSong,
        isDeletedView, setIsDeletedView,
        handleFilterChange, handlePageChange, handleCreateClick, handleEditClick,

        // Lấy thêm các biến quản lý Modal
        handleDeleteClick, handleRestoreClick, handleHardDeleteClick,
        confirmModal, executeAction, closeConfirmModal,

        handleCreateSubmit, handleUpdateSubmit,
        setIsCreateModalOpen, setIsUpdateModalOpen
    } = useSongLogic();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <SongHeader onCreate={handleCreateClick} />

            <SongFilter
                filters={filters}
                onChange={handleFilterChange}
                isDeletedView={isDeletedView}
                onToggleView={setIsDeletedView}
            />

            <SongTable
                songs={paginatedSongs}
                startIndex={startIndex}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                isDeletedView={isDeletedView}
                onPageChange={handlePageChange}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onRestore={handleRestoreClick}
                onHardDelete={handleHardDeleteClick}
            />

            <CreateSongModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateSubmit}
            />

            <UpdateSongModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                songData={selectedSong}
                onUpdate={handleUpdateSubmit}
            />

            {/* NHÚNG CONFIRM MODAL VÀO ĐÂY */}
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

export default SongsManagement;