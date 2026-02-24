import React, { useState, useEffect } from 'react';
import { X, Disc, FileText, Image as ImageIcon, Loader2, UploadCloud, Mic2, Calendar } from 'lucide-react';
import type { AlbumResponse } from '../../../types/backend';
import api from '../../../services/api';

interface AlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    albumData?: AlbumResponse | null; // Có data -> Edit, Null -> Create
    onSubmit: (formData: FormData) => Promise<void>;
}

const AlbumModal = ({ isOpen, onClose, albumData, onSubmit }: AlbumModalProps) => {
    // State form
    const [artists, setArtists] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [artistId, setArtistId] = useState('');
    const [releaseDate, setReleaseDate] = useState(''); // TRƯỜNG MỚI BỔ SUNG
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // State UI
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // 1. Fetch danh sách nghệ sĩ để Admin chọn
    useEffect(() => {
        const loadArtists = async () => {
            try {
                const res = await api.get('/artist/list', { params: { size: 100 } });
                setArtists(res.data.result.content);
            } catch (error) {
                console.error("Lỗi tải danh sách nghệ sĩ:", error);
            }
        };
        if (isOpen) loadArtists();
    }, [isOpen]);

    // 2. Reset form hoặc đổ dữ liệu cũ vào form (Pre-fill) khi mở Modal
    useEffect(() => {
        if (isOpen) {
            if (albumData) {
                // CHẾ ĐỘ EDIT
                setName(albumData.name);
                setDescription(albumData.description || '');
                setReleaseDate(albumData.releaseDate || ''); // Đổ ngày cũ vào
                setPreviewUrl(albumData.avatarUrl || '');
                setAvatarFile(null);
                // Mặc định chọn artistId (nếu Backend có trả về ID trong AlbumResponse)
                // Lưu ý: Tùy vào cấu trúc artistName/artists của bạn để set artistId ban đầu
            } else {
                // CHẾ ĐỘ CREATE
                setName('');
                setDescription('');
                setReleaseDate('');
                setArtistId('');
                setPreviewUrl('');
                setAvatarFile(null);
            }
        }
    }, [isOpen, albumData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert("Tên album không được để trống!");
        if (!artistId && !albumData) return alert("Vui lòng chọn nghệ sĩ chủ quản!");

        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('artistId', artistId);
        formData.append('releaseDate', releaseDate); // GỬI NGÀY PHÁT HÀNH LÊN BACKEND

        if (avatarFile) {
            formData.append('avatarUrl', avatarFile);
        }

        try {
            await onSubmit(formData);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Disc className="text-orange-500" size={24} />
                        {albumData ? "Chỉnh sửa Album" : "Thêm Album mới"}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden hover:border-orange-500 transition-colors">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon className="mx-auto text-gray-400 mb-1" size={28} />
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Ảnh Album</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <UploadCloud className="text-white mb-1" size={24} />
                                <span className="text-white text-xs font-medium">Tải ảnh lên</span>
                            </div>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        {/* Tên Album */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tên Album <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Disc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text" placeholder="Nhập tên album..." value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition"
                                />
                            </div>
                        </div>

                        {/* Chọn Nghệ sĩ & Ngày phát hành */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nghệ sĩ chủ quản</label>
                                <div className="relative">
                                    <Mic2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        value={artistId}
                                        onChange={(e) => setArtistId(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 dark:text-white transition appearance-none"
                                    >
                                        <option value="">-- Chọn nghệ sĩ --</option>
                                        {artists.map(art => (
                                            <option key={art.id} value={art.id}>{art.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ngày phát hành</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date" value={releaseDate}
                                        onChange={(e) => setReleaseDate(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 dark:text-white transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mô tả về album</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                <textarea
                                    rows={3} placeholder="Nhập mô tả về album..." value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit" disabled={isLoading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-orange-500/30"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (albumData ? "Lưu thay đổi" : "Xác nhận thêm mới")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AlbumModal;