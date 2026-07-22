// src/components/Admin/Modals/ArtistModal.tsx
import React, { useState, useEffect } from 'react';
import { X, User, FileText, Image as ImageIcon, Loader2, UploadCloud, MapPin, Link2, Plus, Trash2 } from 'lucide-react';
import type { ArtistResponse } from '../../../types/backend';

interface ArtistModalProps {
    isOpen: boolean;
    onClose: () => void;
    artistData?: ArtistResponse | null;
    onSubmit: (formData: FormData) => Promise<void>;
}

const ArtistModal = ({ isOpen, onClose, artistData, onSubmit }: ArtistModalProps) => {
    // State form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [country, setCountry] = useState('');
    const [debutDate, setDebutDate] = useState('');
    
    interface SocialAccountInput {
        platform: string;
        url: string;
    }
    const [socials, setSocials] = useState<SocialAccountInput[]>([]);

    // State UI
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset hoặc Fill data khi mở modal
    useEffect(() => {
        if (isOpen) {
            if (artistData) {
                // Chế độ Edit
                setName(artistData.name);
                setDescription(artistData.description || '');
                setCountry(artistData.country || '');
                setPreviewUrl(artistData.avatarUrl || '');
                
                let parsedSocials: SocialAccountInput[] = [];
                if (artistData.socialAccounts) {
                    try {
                        const accObj = typeof artistData.socialAccounts === 'string' 
                            ? JSON.parse(artistData.socialAccounts) 
                            : artistData.socialAccounts;
                        parsedSocials = Object.entries(accObj).map(([platform, url]) => ({
                            platform,
                            url: url as string
                        }));
                    } catch (e) {
                        console.error("Parse social error", e);
                    }
                }
                setSocials(parsedSocials);
                setAvatarFile(null);
            } else {
                // Chế độ Create
                setName('');
                setDescription('');
                setCountry('');
                setSocials([]);
                setDebutDate('');
                setPreviewUrl('');
                setAvatarFile(null);
            }
        }
    }, [isOpen, artistData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert("Tên nghệ sĩ không được để trống!");

        setIsLoading(true);
        const formData = new FormData();

        // Append data chuẩn khớp với ArtistRequest.java
        formData.append('name', name);
        formData.append('description', description);
        formData.append('country', country);
        if (debutDate) formData.append('debutDate', debutDate);

        // Convert socials array back to object
        const socialObj: Record<string, string> = {};
        socials.forEach(s => {
            if (s.platform.trim() && s.url.trim()) {
                socialObj[s.platform.trim().toLowerCase()] = s.url.trim();
            }
        });
        
        // Spring Boot FormData mapping for Map<String, String> requires bracket notation
        if (Object.keys(socialObj).length > 0) {
            Object.entries(socialObj).forEach(([key, value]) => {
                formData.append(`socialAccounts[${key}]`, value);
            });
        }

        // Ảnh chỉ gửi nếu user có chọn ảnh mới
        if (avatarFile) {
            formData.append('avatarUrl', avatarFile);
        }

        try {
            await onSubmit(formData); // Gọi hàm ở hook để ném data lên API
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {artistData ? "Chỉnh sửa Nghệ sĩ" : "Thêm Nghệ sĩ mới"}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">

                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer w-28 h-28 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden hover:border-purple-500 transition-colors">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon className="mx-auto text-gray-400 mb-1" size={24} />
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Tải ảnh lên</span>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <UploadCloud className="text-white mb-1" size={20} />
                                <span className="text-white text-xs font-medium">Thay đổi</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Tên nghệ sĩ <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Nhập tên nghệ sĩ..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:text-white transition"
                                />
                            </div>
                        </div>

                        {/* Grid cho Quốc gia và Ngày ra mắt để tiết kiệm không gian */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Quốc gia</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="VD: Việt Nam, US..."
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:text-white transition"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Mô tả / Tiểu sử</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                <textarea
                                    rows={3}
                                    placeholder="Nhập mô tả ngắn về nghệ sĩ..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:text-white transition resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Mạng xã hội</label>
                            
                            {socials.map((social, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        value={social.platform}
                                        onChange={(e) => {
                                            const newSocials = [...socials];
                                            newSocials[index].platform = e.target.value;
                                            setSocials(newSocials);
                                        }}
                                        className="w-[130px] bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:text-white transition"
                                    >
                                        <option value="">Nền tảng</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="x">X (Twitter)</option>
                                        <option value="tiktok">TikTok</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="website">Website</option>
                                    </select>
                                    
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={social.url}
                                        onChange={(e) => {
                                            const newSocials = [...socials];
                                            newSocials[index].url = e.target.value;
                                            setSocials(newSocials);
                                        }}
                                        className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:text-white transition"
                                    />
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => setSocials(socials.filter((_, i) => i !== index))}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition shrink-0"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            
                            <button
                                type="button"
                                onClick={() => setSocials([...socials, { platform: '', url: '' }])}
                                className="mt-1 flex items-center justify-center gap-1.5 py-2.5 px-4 border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-500 hover:text-purple-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition"
                            >
                                <Plus size={16} />
                                Thêm liên kết
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition mt-6 flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-purple-500/30"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (artistData ? "Lưu thay đổi" : "Xác nhận tạo mới")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ArtistModal;