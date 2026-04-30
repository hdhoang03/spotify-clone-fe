// import { useState, useEffect, useCallback, useMemo } from 'react';
// import api from '../../services/api';
// import type { UserProfileResponse, TopLikeSongResponse } from '../../types/backend';
// import type { SectionItem } from './ProfileSection';
// import { usePlaylistStore } from '../../stores/usePlaylistStore'; // 1. IMPORT ZUSTAND

// export const useProfileLogic = (userId: string | undefined) => {
//     const [profile, setProfile] = useState<UserProfileResponse | null>(null);
//     const [topTracks, setTopTracks] = useState<TopLikeSongResponse[]>([]);
//     const [fetchedPlaylists, setFetchedPlaylists] = useState<SectionItem[]>([]); // Đổi tên state này
//     const [following, setFollowing] = useState<SectionItem[]>([]);

//     const [isLoading, setIsLoading] = useState(true);
//     const [isOwnProfile, setIsOwnProfile] = useState(false);

//     // 2. LẤY DANH SÁCH PLAYLIST TỪ GLOBAL STORE (ZUSTAND)
//     const globalPlaylists = usePlaylistStore(state => state.playlists);

//     const fetchProfileData = useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const targetId = userId || 'me';

//             // 1. Lấy thông tin User
//             const profileRes = await api.get(`/user/${targetId}/profile`);
//             const profileData = profileRes.data.result;
//             setProfile(profileData);

//             const isOwn = targetId === 'me' || profileData.isFollowedByMe === null;
//             setIsOwnProfile(isOwn);
//             const actualId = profileData.id;

//             // 2. LOGIC PUBLIC/PRIVATE: 
//             // Nếu không phải profile của mình VÀ profile đó là private -> Dừng lại, không fetch các list bên dưới.
//             if (!isOwn && !profileData.publicProfile) {
//                 setFetchedPlaylists([]);
//                 setTopTracks([]);
//                 setFollowing([]);
//                 setIsLoading(false);
//                 return;
//             }

//             // 3. Nếu Public hoặc là của chính mình -> Lấy danh sách Playlist & Following
//             const apiCalls: Promise<any>[] = [
//                 api.get(`/playlist/user/${actualId}`),
//                 api.get(`/user/follow/${actualId}/artist`) // Hoặc API lấy danh sách user đang theo dõi
//             ];

//             // Chỉ lấy Top Tracks nếu là profile của chính mình (vì API '/stream/my-tracks' chỉ dùng cho 'me')
//             if (isOwn) {
//                 apiCalls.push(api.get('/stream/my-tracks'));
//             }

//             const results = await Promise.allSettled(apiCalls);

//             const playlistsRes = results[0];
//             const artistsRes = results[1];
//             const tracksRes = isOwn ? results[2] : null;

//             if (tracksRes?.status === 'fulfilled' && tracksRes.value.data.result) {
//                 setTopTracks(tracksRes.value.data.result);
//             }

//             if (playlistsRes.status === 'fulfilled' && playlistsRes.value.data.result) {
//                 const formattedPlaylists: SectionItem[] = playlistsRes.value.data.result.content.map((p: any) => ({
//                     id: String(p.id),
//                     title: p.name,
//                     subTitle: p.isPublic ? 'Public Playlist' : 'Private Playlist',
//                     imageUrl: p.coverUrl || 'https://ui-avatars.com/api/?name=Playlist',
//                     rounded: false,
//                     type: 'playlist'
//                 }));
//                 setFetchedPlaylists(formattedPlaylists);
//             }

//             if (artistsRes.status === 'fulfilled' && artistsRes.value.data.result) {
//                 const formattedArtists: SectionItem[] = artistsRes.value.data.result.content.map((a: any) => ({
//                     id: String(a.artistId),
//                     title: a.artistName,
//                     subTitle: 'Artist',
//                     imageUrl: a.avatarUrl || `https://ui-avatars.com/api/?name=${a.artistName}`,
//                     rounded: true,
//                     type: 'artist'
//                 }));
//                 setFollowing(formattedArtists);
//             }

//         } catch (error) {
//             console.error("Lỗi lấy dữ liệu profile:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [userId]);

//     useEffect(() => {
//         fetchProfileData();
//     }, [fetchProfileData]);

//     const displayPlaylists = useMemo(() => {
//         if (isOwnProfile) {
//             return globalPlaylists.map(p => ({
//                 id: String(p.id),
//                 title: p.name,
//                 subTitle: p.isPublic ? 'Public Playlist' : 'Private Playlist',
//                 imageUrl: p.coverUrl || 'https://ui-avatars.com/api/?name=Playlist',
//                 rounded: false,
//                 type: 'playlist'
//             }));
//         }
//         return fetchedPlaylists;
//     }, [isOwnProfile, globalPlaylists, fetchedPlaylists]);

//     const handleToggleFollowUser = async () => {
//         if (!profile || isOwnProfile) return;
//         try {
//             const res = await api.post(`/user/${profile.id}/follow`);
//             const isNowFollowed = res.data.result;

//             setProfile(prev => prev ? {
//                 ...prev,
//                 isFollowedByMe: isNowFollowed,
//                 followerCount: prev.followerCount + (isNowFollowed ? 1 : -1)
//             } : null);
//         } catch (error) {
//             console.error("Lỗi follow user:", error);
//         }
//     };

import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';
import type { SectionItem } from './ProfileSection';
import { usePlaylistStore } from '../../stores/usePlaylistStore';

export const useProfileLogic = (userId: string | undefined) => {
    const [profile, setProfile] = useState<any>(null);
    const [topTracks, setTopTracks] = useState<any[]>([]);
    const [fetchedPlaylists, setFetchedPlaylists] = useState<SectionItem[]>([]);
    const [following, setFollowing] = useState<SectionItem[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    const globalPlaylists = usePlaylistStore(state => state.playlists);

    const fetchProfileData = useCallback(async () => {
        setIsLoading(true);
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
                    subTitle: p.isPublic ? 'Public Playlist' : 'Private Playlist',
                    imageUrl: p.coverUrl || 'https://ui-avatars.com/api/?name=Playlist',
                    rounded: false,
                    type: 'playlist'
                }));
                setFetchedPlaylists(formattedPlaylists);
            }

            if (results[1].status === 'fulfilled' && results[1].value.data.result) {
                const formattedArtists = results[1].value.data.result.content.map((a: any) => ({
                    id: String(a.artistId),
                    title: a.artistName,
                    subTitle: 'Artist',
                    imageUrl: a.avatarUrl || `https://ui-avatars.com/api/?name=${a.artistName}`,
                    rounded: true,
                    type: 'artist'
                }));
                setFollowing(formattedArtists);
            }

            if (isOwn && results[2]?.status === 'fulfilled' && results[2].value.data.result) {
                setTopTracks(results[2].value.data.result);
            }

        } catch (error) {
            console.error("Lỗi lấy dữ liệu profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const displayPlaylists = useMemo(() => {
        if (isOwnProfile) {
            return globalPlaylists.map(p => ({
                id: String(p.id),
                title: p.name,
                subTitle: p.isPublic ? 'Public Playlist' : 'Private Playlist',
                imageUrl: p.coverUrl || 'https://ui-avatars.com/api/?name=Playlist',
                rounded: false,
                type: 'playlist'
            }));
        }
        return fetchedPlaylists;
    }, [isOwnProfile, globalPlaylists, fetchedPlaylists]);

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

    const handleToggleBlockUser = async () => {
        if (!profile || isOwnProfile) return;

        const confirmBlock = window.confirm(`Bạn có chắc chắn muốn chặn ${profile.name || profile.username}?`);
        if (!confirmBlock) return;

        try {
            const res = await api.post(`/user/${profile.id}/block`); //[cite: 104]
            if (res.data.code === 1000) {
                const isBlocked = res.data.result; // Trả về true nếu đã chặn

                if (isBlocked) {
                    alert("Đã chặn người dùng này. Bạn sẽ không thấy họ nữa.");
                    // Chuyển hướng vì profile này giờ sẽ bị Backend ẩn đi
                    window.location.href = '/search';
                }
            }
        } catch (error) {
            console.error("Lỗi chặn người dùng:", error);
            alert("Không thể thực hiện yêu cầu này.");
        }
    };

    return {
        profile, topTracks, playlists: displayPlaylists, following,
        isLoading, isOwnProfile, handleToggleFollowUser, handleUpdateProfile, handleToggleBlockUser
    };
};