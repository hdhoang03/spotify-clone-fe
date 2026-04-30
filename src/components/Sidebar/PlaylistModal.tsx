// components/Sidebar/PlaylistModal.tsx
import React, { useState, useRef } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface PlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<boolean>;
    initialData?: { name: string; description: string; isPublic: boolean; coverUrl?: string };
    isLoading?: boolean;
}

const PlaylistModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }: PlaylistModalProps) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.coverUrl || null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('isPublic', String(isPublic));
        if (coverFile) formData.append('coverUrl', coverFile);

        const success = await onSubmit(formData);
        if (success) {
            // Reset form và đóng
            setName(''); setDescription(''); setCoverFile(null); setPreviewUrl(null);
            onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-white dark:bg-[#282828] rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {initialData ? 'Sửa thông tin' : 'Tạo Playlist'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        {/* Nút Upload Ảnh */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-28 h-28 shrink-0 bg-zinc-100 dark:bg-[#181818] rounded-md shadow-md flex flex-col items-center justify-center text-zinc-400 cursor-pointer hover:bg-zinc-200 dark:hover:bg-[#383838] transition-colors relative overflow-hidden group"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Camera size={32} className="mb-2" />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold">Chọn ảnh</span>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>

                        {/* Input Tên & Mô tả */}
                        <div className="flex-1 space-y-3">
                            <input
                                required placeholder="Tên danh sách phát" value={name} onChange={e => setName(e.target.value)}
                                className="w-full bg-zinc-100 dark:bg-[#3E3E3E] text-zinc-900 dark:text-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm"
                            />
                            <textarea
                                placeholder="Thêm mô tả tùy chọn" value={description} onChange={e => setDescription(e.target.value)} rows={3}
                                className="w-full bg-zinc-100 dark:bg-[#3E3E3E] text-zinc-900 dark:text-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-green-500 text-xs resize-none"
                            />
                        </div>
                    </div>

                    {/* Toggle Công khai */}
                    <div className="flex items-center justify-between py-2 border-t border-zinc-200 dark:border-zinc-700/50 mt-4">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Công khai trên hồ sơ</span>
                        <button
                            type="button" onClick={() => setIsPublic(!isPublic)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${isPublic ? 'bg-green-500' : 'bg-zinc-400 dark:bg-zinc-600'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2">
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            {initialData ? 'Lưu' : 'Tạo mới'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>,
        document.body
    );
};

export default PlaylistModal;