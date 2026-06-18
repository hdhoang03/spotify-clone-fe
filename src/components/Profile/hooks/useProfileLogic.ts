import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../../services/api';
import type { SectionItem } from '../components/ProfileSection';
import { usePlaylistStore } from '../../../stores/usePlaylistStore';
import { useNavigate } from 'react-router-dom';
import type { ConfirmActionType } from '../../Admin/ConfirmModal';
import { getPlaylistCover, getArtistAvatar } from '../../../utils/avatarUrl';
import { useTranslation } from 'react-i18next';

export const useProfileLogic = (userId: string | undefined) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [topTracks, setTopTracks] = useState<any[]>([]);
    const [fetchedPlaylists, setFetchedPlaylists] = useState<SectionItem[]>([]);
    const [following, setFollowing] = useState<SectionItem[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isPrivateError, setIsPrivateError] = useState(false);
    const [privateFollowing, setPrivateFollowing] = useState(false); // Follow state khi không có profile data

    const globalPlaylists = usePlaylistStore(state => state.playlists);

    // --- STATE CHO CONFIRM MODAL CHẶN NGƯỜI DÙNG ---
    const [confirmBlockModal, setConfirmBlockModal] = useState<{
        isOpen: boolean; type: ConfirmActionType; title: string; message: string;
    }>({ isOpen: false, type: 'BLOCK', title: '', message: '' });

    const fetchProfileData = useCallback(async () => {
        setIsLoading(true);
        setTopTracks([]);
        setFetchedPlaylists([]);
        setFollowing([]);

        try {
            const targetId = userId || 'me';

            // 1. Fetch thông tin Profile
            const profileRes = await api.get(`/user/${targetId}/profile`);
            const profileData = profileRes.data.result;
            setProfile(profileData);

            // Nếu targetId là 'me' hoặc isFollowedByMe là null -> Profile của chính mình
            const isOwn = targetId === 'me' || profileData.isFollowedByMe === null;
            setIsOwnProfile(isOwn);

            const actualId = profileData.id;

            // 2. LOGIC PUBLIC/PRIVATE
            // Nếu KHÔNG PHẢI profile của mình VÀ đang để PRIVATE -> Dừng gọi API phụ
            if (!isOwn && !profileData.publicProfile) {
                setFetchedPlaylists([]);
                setTopTracks([]);
                setFollowing([]);
                setIsLoading(false);
                return;
            }

            // 3. NẾU PUBLIC HOẶC LÀ CỦA MÌNH -> Gọi API phụ
            const apiCalls: Promise<any>[] = [
                api.get(`/playlist/user/${actualId}`),
                api.get(`/user/follow/${actualId}/artist`) // Hoặc api lấy danh sách following
            ];

            // Chỉ lấy Top Tracks nếu là profile của chính mình
            if (isOwn) {
                apiCalls.push(api.get('/stream/my-tracks'));
            }

            const results = await Promise.allSettled(apiCalls);

            if (results[0].status === 'fulfilled' && results[0].value.data.result) {
                const formattedPlaylists = results[0].value.data.result.content.map((p: any) => ({
                    id: String(p.id),
                    title: p.name,
                    subTitle: p.isPublic ? t('playlist.public_playlist') : t('playlist.private_playlist'),
                    imageUrl: getPlaylistCover(p.coverUrl, p.name),
                    rounded: false,
                    type: 'playlist'
                }));
                setFetchedPlaylists(formattedPlaylists);
            }

            if (results[1].status === 'fulfilled' && results[1].value.data.result) {
                const formattedArtists = results[1].value.data.result.content.map((a: any) => ({
                    id: String(a.id),
                    title: a.artistName || a.name || a.username || 'Unknown',
                    subTitle: t('artist.artist_label'),
                    imageUrl: getArtistAvatar(a.avatarUrl, a.artistName || a.name || a.username),
                    rounded: true,
                    type: 'artist'
                }));
                setFollowing(formattedArtists);
            }

            if (isOwn && results[2]?.status === 'fulfilled' && results[2].value.data.result) {
                setTopTracks(results[2].value.data.result);
            }

        } catch (error: any) {
            const status = error?.response?.status;
            const code = error?.response?.data?.code;

            // Backend trả 404 + code 1014 = "User profile's is private" -> hiển thị UI riêng tư
            if (code === 1014) {
                setIsPrivateError(true);
            }
            // 403 do private (phòng trường hợp backend đổi behavior) -> hiển thị UI riêng tư
            else if (status === 403 && code !== 1009) {
                setIsPrivateError(true);
            }
            // Bị chặn (1009 / 1008) -> redirect về /
            else if (code === 1008 || code === 1009) {
                navigate('/');
            }
            // 404 thật (không tìm thấy user) -> redirect về /
            else if (status === 404) {
                navigate('/');
            }
        } finally {
            setIsLoading(false);
        }
    }, [userId, navigate]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const displayPlaylists = useMemo(() => {
        if (isOwnProfile) {
            return globalPlaylists.map(p => ({
                id: String(p.id),
                title: p.name,
                subTitle: p.isPublic ? t('playlist.public_playlist') : t('playlist.private_playlist'),
                imageUrl: getPlaylistCover(p.coverUrl, p.name),
                rounded: false,
                type: 'playlist'
            }));
        }
        return fetchedPlaylists;
    }, [isOwnProfile, globalPlaylists, fetchedPlaylists, t]);

    // Navigation được gắn sẵn — Profile.tsx không cần tự map nữa
    // Số public playlist thực tế — backend đôi khi trả về sai
    const publicPlaylistCount = useMemo(() => {
        if (isOwnProfile) {
            // Store chứa cả private + public, chỉ đếm public
            return globalPlaylists.filter(p => p.isPublic).length;
        }
        // Với user khác, API chỉ trả về public playlist
        return fetchedPlaylists.length;
    }, [isOwnProfile, globalPlaylists, fetchedPlaylists]);

    const playlistsWithNavigation = useMemo(
        () => displayPlaylists.map(p => ({
            ...p, onClick: () => {
                const token = localStorage.getItem('token');
                if (!token || token === 'null' || token === 'undefined') {
                    window.dispatchEvent(new Event('open-auth-modal'));
                    return;
                }
                navigate(`/playlist/${p.id}`);
            }
        })),
        [displayPlaylists, navigate]
    );

    const followingWithNavigation = useMemo(
        () => following.map(a => ({
            ...a, onClick: () => {
                const token = localStorage.getItem('token');
                if (!token || token === 'null' || token === 'undefined') {
                    window.dispatchEvent(new Event('open-auth-modal'));
                    return;
                }
                navigate(`/artist/${a.id}`);
            }
        })),
        [following, navigate]
    );

    const handleToggleFollowUser = async () => {
        if (!profile || isOwnProfile) return;
        try {
            const res = await api.post(`/user/${profile.id}/follow`);
            const isNowFollowed = res.data.result;
            setProfile((prev: any) => prev ? {
                ...prev,
                isFollowedByMe: isNowFollowed,
                followerCount: prev.followerCount + (isNowFollowed ? 1 : -1)
            } : null);
        } catch (error) {
            console.error("Lỗi follow user:", error);
        }
    };

    const handleUpdateProfile = async (name: string, file: File | null, isRemoved?: boolean) => {
        try {
            const formData = new FormData();
            formData.append('name', name.trim());

            if (isRemoved) {
                formData.append('isRemoved', 'true');
            } else if (file) {
                formData.append('avatar', file);
            }

            const res = await api.put('/user/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.code === 1000) {
                const updatedUser = res.data.result;
                setProfile(updatedUser);

                const currentUserStr = localStorage.getItem('user');
                if (currentUserStr) {
                    const currentUser = JSON.parse(currentUserStr);
                    const newUser = { ...currentUser, name: updatedUser.name, avatarUrl: updatedUser.avatarUrl };
                    localStorage.setItem('user', JSON.stringify(newUser));
                    window.dispatchEvent(new Event('user-update'));
                }

                return true;
            }
            return false;

        } catch (error) {
            console.error("Lỗi cập nhật profile:", error);
            return false;
        }
    };

    // Mở modal xác nhận chặn user
    const openBlockConfirm = () => {
        if (isOwnProfile) return;
        setConfirmBlockModal({
            isOpen: true,
            type: 'BLOCK',
            title: `${t('profile.block_user')} ${profile?.name}?`,
            message: t('confirm_modal.block_message')
        });
    };

    const closeBlockConfirm = () => setConfirmBlockModal(prev => ({ ...prev, isOpen: false }));

    const handleToggleBlockUser = async (): Promise<boolean> => {
        const targetId = profile?.id || userId;
        if (!targetId || isOwnProfile) return false;
        try {
            const res = await api.post(`/user/${targetId}/block`);
            if (res.data.code === 1000) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi chặn người dùng:", error);
            return false;
        }
    };

    // Follow/unfollow khi không có profile data (trường hợp private 1014)
    const handleToggleFollowPrivate = async () => {
        if (!userId) return;
        try {
            const res = await api.post(`/user/${userId}/follow`);
            setPrivateFollowing(res.data.result);
        } catch (error) {
            console.error('Lỗi follow private user:', error);
        }
    };

    return {
        profile, topTracks,
        playlists: displayPlaylists,
        playlistsWithNavigation,
        following,
        followingWithNavigation,
        publicPlaylistCount,
        isLoading, isOwnProfile, isPrivateError,
        privateFollowing, handleToggleFollowPrivate,
        handleToggleFollowUser, handleUpdateProfile,

        // Block user
        openBlockConfirm, closeBlockConfirm, confirmBlockModal, handleToggleBlockUser
    };
};
