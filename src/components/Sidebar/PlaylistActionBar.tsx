/**
 * PlaylistActionBar — wrapper dùng PlaybackActionBar với menu Edit/Delete cho playlist.
 * Import path cũ trong PlaylistDetailPage vẫn hoạt động bình thường.
 */

import { Edit2, Trash2 } from 'lucide-react';
import PlaybackActionBar from '../common/PlaybackActionBar';
import { useTranslation } from 'react-i18next';

interface ActionBarProps {
    isOwner: boolean;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onPlayClick?: () => void;
    isPlaying?: boolean;
    onTogglePlay?: () => void;
}

const PlaylistActionBar = ({ isOwner, onEditClick, onDeleteClick, onPlayClick, isPlaying, onTogglePlay }: ActionBarProps) => {
    const { t } = useTranslation();
    const menuItems = isOwner
        ? [
            {
                label: t('playlist.edit_details'),
                icon: <Edit2 size={16} />,
                onClick: onEditClick,
                variant: 'default' as const,
            },
            {
                label: t('playlist.delete_playlist'),
                icon: <Trash2 size={16} />,
                onClick: onDeleteClick,
                variant: 'danger' as const,
            },
        ]
        : [];

    return (
        <PlaybackActionBar
            isPlaying={isPlaying}
            onPlayClick={onPlayClick}
            onTogglePlay={onTogglePlay}
            menuItems={menuItems}
        />
    );
};

export default PlaylistActionBar;