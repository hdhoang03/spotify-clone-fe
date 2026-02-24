// src/pages/Admin/Albums/useAlbumDetailLogic.ts
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import type { AlbumResponse, SongResponse } from '../../../types/backend';

export const useAlbumDetailLogic = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [album, setAlbum] = useState<AlbumResponse | null>(null);
    const [albumSongs, setAlbumSongs] = useState<SongResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const ITEMS_PER_PAGE = 10;

    const fetchAlbumDetail = useCallback(async () => {
        try {
            const res = await api.get(`/albums/${id}`);
            setAlbum(res.data.result);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết album:", error);
        }
    }, [id]);

    const fetchAlbumSongs = useCallback(async (page: number) => {
        try {
            const res = await api.get(`/albums/${id}/songs`, {
                params: { page, size: ITEMS_PER_PAGE }
            });
            const { content, totalPages: tPages, totalElements: tElements } = res.data.result;
            setAlbumSongs(content);
            setTotalPages(tPages);
            setTotalElements(tElements);
        } catch (error) {
            console.error("Lỗi khi tải bài hát của album:", error);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            Promise.all([fetchAlbumDetail(), fetchAlbumSongs(currentPage)]).finally(() => {
                setIsLoading(false);
            });
        }
    }, [id, currentPage, fetchAlbumDetail, fetchAlbumSongs]);

    const handleAddSong = async (songId: string) => {
        try {
            await api.post(`/albums/${id}/songs`, [songId]);
            alert(`Đã thêm bài hát vào album thành công!`);
            fetchAlbumDetail();
            fetchAlbumSongs(currentPage);
        } catch (error) {
            alert("Có lỗi xảy ra khi thêm bài hát vào album.");
        }
    };

    const handleRemoveSong = async (songId: string) => {
        if (window.confirm("Bạn có chắc muốn loại bỏ bài hát này khỏi Album?")) {
            try {
                await api.delete(`/albums/${id}/songs/${songId}`);
                fetchAlbumDetail();
                fetchAlbumSongs(currentPage);
            } catch (error) {
                alert("Lỗi khi xóa bài hát khỏi Album!");
            }
        }
    };

    return {
        id, navigate,
        album, albumSongs, isLoading,
        isAddModalOpen, setIsAddModalOpen,
        currentPage, setCurrentPage, totalPages, totalElements, ITEMS_PER_PAGE,
        handleAddSong, handleRemoveSong
    };
};