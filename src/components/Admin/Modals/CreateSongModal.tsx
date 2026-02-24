// import React, { useState, useEffect } from 'react';
// import { X, Music, Disc, Mic2, Image as ImageIcon, FileAudio, Loader2, UploadCloud } from 'lucide-react';
// import { MOCK_ARTIST_OPTIONS, MOCK_ALBUMS } from '../../../constants/mockData';

// // --- PHẦN 1: CÁC COMPONENT CON (UI) ---
// // Tách ra để code chính gọn gàng hơn

// const InputGroup = ({ icon, label, placeholder, value, onChange }: { icon: any, label: string, placeholder?: string, value: string, onChange: (v: string) => void }) => (
//     <div className="space-y-1">
//         <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
//         <div className="relative">
//             <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
//             <input
//                 required
//                 type="text"
//                 placeholder={placeholder}
//                 className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//             />
//         </div>
//     </div>
// );

// const SelectGroup = ({ icon, label, value, onChange, options, placeholder = "-- Chọn --" }: { icon: any, label: string, value: string, onChange: (v: string) => void, options: { id: string, name: string }[], placeholder?: string }) => (
//     <div className="space-y-1">
//         <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
//         <div className="relative">
//             <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
//             <select
//                 className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 appearance-none dark:text-white"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//             >
//                 <option value="">{placeholder}</option>
//                 {options.map(opt => (
//                     <option key={opt.id} value={opt.id}>{opt.name}</option>
//                 ))}
//             </select>
//         </div>
//     </div>
// );

// const FileUpload = ({ label, icon, accept, file, onChange }: { label: string, icon: any, accept: string, file: File | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
//     <div className="space-y-2">
//         <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
//             {icon} {label}
//         </label>
//         <div className={`border-2 border-dashed rounded-xl p-4 text-center transition relative group cursor-pointer 
//             ${file ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>

//             <input
//                 type="file"
//                 accept={accept}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                 onChange={onChange}
//             />

//             <div className="flex flex-col items-center justify-center gap-2 py-2">
//                 {file ? (
//                     <>
//                         {accept.includes("image") && (
//                             <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md mb-2">
//                                 <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
//                             </div>
//                         )}
//                         <div className="text-left">
//                             <p className="text-sm font-bold text-green-700 dark:text-green-400 truncate max-w-[180px]">{file.name}</p>
//                             <p className="text-xs text-green-600 dark:text-green-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
//                         </div>
//                     </>
//                 ) : (
//                     <>
//                         <UploadCloud className="text-gray-400" size={32} />
//                         <span className="text-xs text-gray-500">Click hoặc kéo thả file vào đây</span>
//                     </>
//                 )}
//             </div>
//         </div>
//     </div>
// );


// // --- PHẦN 2: COMPONENT CHÍNH ---

// interface CreateSongModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onCreate: (formData: FormData) => Promise<void>;
// }

// const CreateSongModal = ({ isOpen, onClose, onCreate }: CreateSongModalProps) => {
//     // State management
//     const [title, setTitle] = useState('');
//     const [artistId, setArtistId] = useState('');
//     const [albumId, setAlbumId] = useState('');
//     const [category, setCategory] = useState('Pop');
//     const [coverFile, setCoverFile] = useState<File | null>(null);
//     const [audioFile, setAudioFile] = useState<File | null>(null);
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         if (!isOpen) {
//             setTitle(''); setArtistId(''); setAlbumId('');
//             setCategory('Pop'); setCoverFile(null); setAudioFile(null);
//             setIsLoading(false);
//         }
//     }, [isOpen]);

//     if (!isOpen) return null;

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!title || !artistId || !coverFile || !audioFile) {
//             alert("Vui lòng điền đủ thông tin!");
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append('title', title);
//             formData.append('artistId', artistId);
//             formData.append('category', category);
//             if (albumId) formData.append('albumId', albumId);
//             formData.append('coverUrl', coverFile);
//             formData.append('audioUrl', audioFile);

//             await onCreate(formData);
//             onClose();
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />

//             <div className="relative -mt-10 bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

//                 {/* Header */}
//                 <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
//                     <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                         <Music className="text-blue-500" /> Thêm bài hát mới
//                     </h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
//                 </div>

//                 {/* Form Body - Code giờ rất GỌN GÀNG */}
//                 <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                         {/* Cột trái */}
//                         <div className="space-y-4">
//                             <InputGroup
//                                 label="Tên bài hát *" icon={<Music size={16} />}
//                                 value={title} onChange={setTitle} placeholder="VD: Em của ngày hôm qua"
//                             />

//                             <SelectGroup
//                                 label="Nghệ sĩ *" icon={<Mic2 size={16} />}
//                                 value={artistId} onChange={setArtistId}
//                                 options={MOCK_ARTIST_OPTIONS}
//                             />

//                             <SelectGroup
//                                 label="Album" icon={<Disc size={16} />}
//                                 value={albumId} onChange={setAlbumId}
//                                 options={MOCK_ALBUMS} placeholder="-- Không thuộc album --"
//                             />

//                             <InputGroup
//                                 label="Thể loại" icon={<Disc size={16} />}
//                                 value={category} onChange={setCategory} placeholder="Pop, Ballad..."
//                             />
//                         </div>

//                         {/* Cột phải */}
//                         <div className="space-y-6">
//                             <FileUpload
//                                 label="Ảnh bìa *" icon={<ImageIcon size={14} />} accept="image/*"
//                                 file={coverFile}
//                                 onChange={(e) => e.target.files && setCoverFile(e.target.files[0])}
//                             />

//                             <FileUpload
//                                 label="File nhạc *" icon={<FileAudio size={14} />} accept="audio/*"
//                                 file={audioFile}
//                                 onChange={(e) => e.target.files && setAudioFile(e.target.files[0])}
//                             />
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
//                         <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition">Hủy bỏ</button>
//                         <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/30">
//                             {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Tải lên & Lưu"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateSongModal;

import React, { useState, useEffect } from 'react';
import { X, Music, Disc, Mic2, Image as ImageIcon, FileAudio, Loader2, UploadCloud, Tag } from 'lucide-react';
import api from '../../../services/api';
import type { ArtistResponse, AlbumResponse, CategoryResponse } from '../../../types/backend';

// --- CÁC COMPONENT CON (UI) ---
const InputGroup = ({ icon, label, placeholder, value, onChange }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
            <input
                required
                type="text"
                placeholder={placeholder}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

const SelectGroup = ({ icon, label, value, onChange, options, required = false }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
            <select
                required={required}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition appearance-none cursor-pointer"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="" disabled>Chọn {label.toLowerCase().replace('*', '')}</option>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    </div>
);

const FileUpload = ({ label, icon, accept, file, onChange }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <div className="relative overflow-hidden group">
            <input required type="file" accept={accept} onChange={onChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed transition-all ${file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 group-hover:border-blue-400'}`}>
                <div className={`p-2 rounded-full ${file ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'bg-gray-200 text-gray-500 dark:bg-zinc-700'}`}>
                    {file ? <UploadCloud size={16} /> : icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${file ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {file ? file.name : "Kéo thả hoặc click để chọn file"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : accept === 'image/*' ? 'JPG, PNG, WEBP (Max 5MB)' : 'MP3, WAV, FLAC (Max 20MB)'}</p>
                </div>
            </div>
        </div>
    </div>
);

interface CreateSongModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: FormData) => Promise<void>;
}

const CreateSongModal = ({ isOpen, onClose, onCreate }: CreateSongModalProps) => {
    const [title, setTitle] = useState('');
    const [artistId, setArtistId] = useState('');
    const [albumId, setAlbumId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Dữ liệu từ Backend
    const [artists, setArtists] = useState<ArtistResponse[]>([]);
    const [albums, setAlbums] = useState<AlbumResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        if (!isOpen) {
            // Reset form khi đóng
            setTitle(''); setArtistId(''); setAlbumId(''); setCategoryId(''); setCoverFile(null); setAudioFile(null);
            return;
        }

        // Fetch data khi mở modal
        const fetchData = async () => {
            try {
                const [artistRes, albumRes, categoryRes] = await Promise.all([
                    api.get('/artist/list', { params: { size: 100 } }),
                    api.get('/albums/list', { params: { size: 100 } }),
                    api.get('/categories/list', { params: { size: 100 } })
                ]);
                setArtists(artistRes.data.result.content || []);
                setAlbums(albumRes.data.result.content || []);
                setCategories(categoryRes.data.result.content || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Modal:", error);
            }
        };
        fetchData();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverFile || !audioFile) return alert("Vui lòng chọn đầy đủ ảnh bìa và file nhạc!");

        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artistId', artistId);
        if (albumId) formData.append('albumId', albumId); // Album có thể null
        formData.append('category', categoryId); // Tùy thuộc Backend nhận ID hay Name, ở đây truyền ID
        formData.append('coverUrl', coverFile);
        formData.append('audioUrl', audioFile);

        await onCreate(formData);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity -mt-20" onClick={onClose} />

            <div
                className="relative bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 md:p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thêm bài hát mới</h2>
                        <p className="text-xs text-gray-500 mt-1">Upload bài hát lên hệ thống Cloudinary</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <h3 className="text-sm font-bold border-b border-gray-100 dark:border-zinc-800 pb-2 flex items-center gap-2"><Music size={16} className="text-blue-500" /> Thông tin cơ bản</h3>
                            <InputGroup label="Tên bài hát *" icon={<Music size={14} />} placeholder="Nhập tên bài hát..." value={title} onChange={setTitle} />

                            <SelectGroup
                                label="Nghệ sĩ *" icon={<Mic2 size={14} />} required value={artistId} onChange={setArtistId}
                                options={artists.map(a => ({ value: a.id, label: a.name }))}
                            />

                            <SelectGroup
                                label="Album" icon={<Disc size={14} />} value={albumId} onChange={setAlbumId}
                                options={[{ value: '', label: '-- Không thuộc Album nào --' }, ...albums.map(a => ({ value: a.id, label: a.name }))]}
                            />

                            <SelectGroup
                                label="Thể loại *" icon={<Tag size={14} />} required value={categoryId} onChange={setCategoryId}
                                options={categories.map(c => ({ value: c.id, label: c.name }))}
                            />
                        </div>

                        <div className="space-y-5">
                            <h3 className="text-sm font-bold border-b border-gray-100 dark:border-zinc-800 pb-2 flex items-center gap-2"><UploadCloud size={16} className="text-blue-500" /> Media Files</h3>
                            <FileUpload label="Ảnh bìa (Cover) *" icon={<ImageIcon size={14} />} accept="image/*" file={coverFile} onChange={(e: any) => e.target.files && setCoverFile(e.target.files[0])} />
                            <FileUpload label="File nhạc *" icon={<FileAudio size={14} />} accept="audio/*" file={audioFile} onChange={(e: any) => e.target.files && setAudioFile(e.target.files[0])} />
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition">Hủy bỏ</button>
                        <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/30">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Tải lên & Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSongModal;