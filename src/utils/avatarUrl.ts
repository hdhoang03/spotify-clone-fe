/**
 * avatarUrl.ts
 * Tiện ích tạo URL avatar với fallback ui-avatars.com
 * Dùng chung toàn app thay vì viết inline ở từng file.
 */

/**
 * Trả về avatarUrl thật nếu có, hoặc fallback ui-avatars.com
 * @param avatarUrl URL avatar thật (có thể null/undefined)
 * @param name Tên dùng làm initials khi fallback
 * @param background Màu nền hex hoặc "random" (default: "random")
 */
export const getAvatarUrl = (
    avatarUrl: string | null | undefined,
    name: string | null | undefined,
    background = 'random'
): string => {
    if (avatarUrl) return avatarUrl;
    const safeName = encodeURIComponent((name || '?').trim());
    return `https://ui-avatars.com/api/?name=${safeName}&background=${background}&color=fff`;
};

/**
 * Trả về cover URL cho playlist, fallback về màu xanh Spotify
 * @param coverUrl URL cover thật (có thể null/undefined)
 * @param name Tên playlist dùng làm initials (default: "Playlist")
 */
export const getPlaylistCover = (
    coverUrl: string | null | undefined,
    name?: string
): string => {
    if (coverUrl) return coverUrl;
    const safeName = encodeURIComponent((name || 'Playlist').trim());
    return `https://ui-avatars.com/api/?name=${safeName}&background=1db954&color=fff`;
};

/**
 * Trả về cover URL cho artist
 * @param avatarUrl URL avatar thật
 * @param artistName Tên nghệ sĩ
 */
export const getArtistAvatar = (
    avatarUrl: string | null | undefined,
    artistName: string | null | undefined
): string => {
    return getAvatarUrl(avatarUrl, artistName, '4a4a4a');
};
