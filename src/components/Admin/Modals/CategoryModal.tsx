import React, { useState, useEffect } from 'react';
import { X, Layers, Image as ImageIcon, Loader2, Tag, Edit3, UploadCloud } from 'lucide-react';
import type { CategoryResponse } from '../../../types/backend';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryData?: CategoryResponse | null;
    onSubmit: (formData: FormData) => Promise<void>;
}

const CategoryModal = ({ isOpen, onClose, categoryData, onSubmit }: CategoryModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);
    const [type, setType] = useState('GENRE');
    const [displayOrder, setDisplayOrder] = useState<number>(0);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (categoryData) {
                setName(categoryData.name);
                setDescription(categoryData.description || '');
                setActive(categoryData.active);
                setType(categoryData.type);
                setDisplayOrder(categoryData.displayOrder || 0);
                setPreviewUrl(categoryData.coverUrl || '');
                setCoverFile(null);
            } else {
                setName('');
                setDescription('');
                setActive(true);
                setType('GENRE');
                setDisplayOrder(0);
                setPreviewUrl('');
                setCoverFile(null);
            }
        }
    }, [isOpen, categoryData]);

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
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('active', active.toString());
            formData.append('type', type);
            formData.append('displayOrder', displayOrder.toString());

            if (coverFile) {
                formData.append('coverUrl', coverFile);
            }

            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Layers className="text-pink-500" size={20} />
                        {categoryData ? 'Cập nhật Thể loại' : 'Thêm Thể loại mới'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Phần 1: Tên và Ảnh bìa */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Upload Cover */}
                        <div className="flex flex-col items-center space-y-2">
                            <div className="relative group w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-pink-500 transition cursor-pointer bg-gray-50 dark:bg-zinc-800 shadow-sm flex-shrink-0">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400 flex-col gap-1">
                                        <ImageIcon size={24} />
                                        <span className="text-[10px] font-bold">ẢNH BÌA</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <UploadCloud className="text-white" size={24} />
                                </div>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                            </div>
                        </div>

                        {/* Tên danh mục & Trạng thái */}
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                    <Edit3 size={12} /> Tên danh mục *
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="VD: Nhạc Trẻ, Chill Mood..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 dark:text-white transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phần 2: Phân loại & Thứ tự hiển thị */}
                    <div className="grid grid-cols-2 gap-4 items-end">
                        {/* Loại danh mục */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                <Tag size={12} /> Loại danh mục
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-pink-500 dark:text-white appearance-none"
                            >
                                <option value="GENRE">Thể loại (Genre)</option>
                                <option value="MOOD">Tâm trạng (Mood)</option>
                                <option value="ARTIST">Nghệ sĩ (Artist)</option>
                                <option value="TRENDING">Xu hướng (Trending)</option>
                            </select>
                        </div>

                        {/* Nút gạt trạng thái (Toggle Switch) */}
                        <div className="flex flex-col gap-1.5 pb-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Trạng thái</label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2 px-4 h-[42px]">
                                <span className={`text-[10px] font-black ${active ? 'text-green-500' : 'text-gray-400'}`}>
                                    {active ? 'ACTIVE' : 'HIDDEN'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setActive(!active)} //
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${active ? 'bg-pink-600' : 'bg-gray-300 dark:bg-zinc-600'
                                        }`}
                                >
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${active ? 'translate-x-5' : 'translate-x-1'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Phần 3: Mô tả */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Mô tả chi tiết</label>
                        <textarea
                            rows={3}
                            placeholder="Mô tả ngắn về thể loại nhạc này để người dùng hiểu rõ hơn..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 px-4 text-sm outline-none focus:border-pink-500 dark:text-white transition resize-none"
                        />
                    </div>

                    {/* Nút bấm */}
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-pink-500/30"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (categoryData ? "Lưu thay đổi" : "Xác nhận tạo mới")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;