import { useAlbumLogic } from './useAlbumLogic';
import { AlbumHeader } from './AlbumHeader';
import { AlbumFilter } from './AlbumFilter';
import { AlbumTable } from './AlbumTable';
import AlbumModal from '../Modals/AlbumModal';

const AlbumManagement = () => {
    const {
        paginatedAlbums,
        totalItems,
        totalPages,
        currentPage,
        startIndex,
        searchTerm,
        isModalOpen,
        selectedAlbum,
        isDeletedView,      // THÊM TỪ HOOK
        setIsDeletedView,   // THÊM TỪ HOOK
        handleRestoreClick, // THÊM TỪ HOOK
        setSearchTerm,
        handlePageChange,
        handleCreateClick,
        handleEditClick,
        handleDeleteClick,
        handleFormSubmit,
        handleManageSongsClick,
        closeModal,
    } = useAlbumLogic();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <AlbumHeader onCreate={handleCreateClick} />

            <AlbumFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isDeletedView={isDeletedView}        // TRUYỀN PROP
                onToggleView={setIsDeletedView}      // TRUYỀN PROP
            />

            <AlbumTable
                albums={paginatedAlbums}
                startIndex={startIndex}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={5}
                isDeletedView={isDeletedView}        // TRUYỀN PROP
                onPageChange={handlePageChange}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onManageSongs={handleManageSongsClick}
                onRestore={handleRestoreClick}       // TRUYỀN PROP
            />

            <AlbumModal
                isOpen={isModalOpen}
                onClose={closeModal}
                albumData={selectedAlbum}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default AlbumManagement;