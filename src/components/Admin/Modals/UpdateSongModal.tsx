// // src/components/Admin/Modals/UpdateSongModal.tsx

// import React, { useState, useEffect } from 'react';
// import { X, Music, Disc, Mic2, Image as ImageIcon, FileAudio, Loader2, UploadCloud, Edit } from 'lucide-react';
// import { MOCK_ARTIST_OPTIONS, MOCK_ALBUMS } from '../../../constants/mockData';
// import type { SongResponse } from '../../../types/backend';

// // --- CÁC COMPONENT CON (UI) GIỮ NGUYÊN NHƯ CREATE SONG ---
// // (Bạn có thể tách 3 component này ra file riêng FormComponents.tsx để tái sử dụng)

// const InputGroup = ({ icon, label, placeholder, value, onChange }: any) => (
//     <div className="space-y-1">
//         <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
//         <div className="relative">
//             <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
//             <input
//                 type="text"
//                 placeholder={placeholder}
//                 className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//             />
//         </div>
//     </div>
// );

// const SelectGroup = ({ icon, label, value, onChange, options, placeholder = "-- Chọn --" }: any) => (
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
//                 {options.map((opt: any) => (
//                     <option key={opt.id} value={opt.id}>{opt.name}</option>
//                 ))}
//             </select>
//         </div>
//     </div>
// );

// // FileUpload có điều chỉnh: Hiển thị Preview ảnh cũ nếu chưa chọn ảnh mới
// const FileUpload = ({ label, icon, accept, file, currentUrl, onChange }: { label: string, icon: any, accept: string, file: File | null, currentUrl?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
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
//                 {/* Trường hợp 1: Đã chọn file mới -> Hiển thị file mới */}
//                 {file ? (
//                     <>
//                         {accept.includes("image") && (
//                             <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md mb-2">
//                                 <img src={URL.createObjectURL(file)} alt="Preview New" className="w-full h-full object-cover" />
//                             </div>
//                         )}
//                         <div className="text-left">
//                             <p className="text-sm font-bold text-green-700 dark:text-green-400 truncate max-w-[180px]">Mới: {file.name}</p>
//                             <p className="text-xs text-green-600 dark:text-green-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
//                         </div>
//                     </>
//                 ) : (
//                     /* Trường hợp 2: Chưa chọn file mới -> Hiển thị URL cũ (nếu có) */
//                     currentUrl ? (
//                         <>
//                             {accept.includes("image") ? (
//                                 <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md mb-2 relative">
//                                     <img src={currentUrl} alt="Current" className="w-full h-full object-cover opacity-80" />
//                                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs font-bold">Hiện tại</div>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold mb-2">
//                                     <FileAudio size={12} /> File nhạc hiện tại
//                                 </div>
//                             )}
//                             <span className="text-xs text-gray-400">Click để thay đổi file khác</span>
//                         </>
//                     ) : (
//                         /* Trường hợp 3: Không có gì cả */
//                         <>
//                             <UploadCloud className="text-gray-400" size={32} />
//                             <span className="text-xs text-gray-500">Click hoặc kéo thả file vào đây</span>
//                         </>
//                     )
//                 )}
//             </div>
//         </div>
//     </div>
// );


// // --- PHẦN CHÍNH: COMPONENT UPDATE MODAL ---

// interface UpdateSongModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     songData: SongResponse | null; // Dữ liệu bài hát cần sửa
//     onUpdate: (id: string, formData: FormData) => Promise<void>;
// }

// const UpdateSongModal = ({ isOpen, onClose, songData, onUpdate }: UpdateSongModalProps) => {
//     // State
//     const [title, setTitle] = useState('');
//     const [artistId, setArtistId] = useState('');
//     const [albumId, setAlbumId] = useState('');
//     const [category, setCategory] = useState('');
//     const [coverFile, setCoverFile] = useState<File | null>(null);
//     const [audioFile, setAudioFile] = useState<File | null>(null);
//     const [isLoading, setIsLoading] = useState(false);

//     // Effect: Fill dữ liệu cũ vào form khi mở modal
//     useEffect(() => {
//         if (isOpen && songData) {
//             setTitle(songData.title || '');
//             // Lưu ý: songData.artist đang trả về Tên (String), nhưng dropdown cần ID.
//             // Nếu API trả về artistId thì tốt, nếu không bạn phải map ngược hoặc sửa API trả về object Artist {id, name}
//             // Ở đây giả sử songData có field artistId (như bạn định nghĩa trong SongResponse ở backend thì chưa thấy, nhưng nên thêm vào).
//             // Tạm thời mình dùng artistId từ mockData hoặc để rỗng nếu chưa khớp.
//             setArtistId(songData.artistId || '');
//             setAlbumId(songData.albumId || '');
//             setCategory(songData.category || 'Pop');
//             setCoverFile(null); // Reset file upload
//             setAudioFile(null);
//         }
//     }, [isOpen, songData]);

//     if (!isOpen || !songData) return null;

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);

//         try {
//             const formData = new FormData();

//             // Chỉ append những field có giá trị
//             formData.append('title', title);
//             formData.append('category', category);

//             if (artistId) formData.append('artistId', artistId);
//             if (albumId) formData.append('albumId', albumId);

//             // QUAN TRỌNG: Chỉ gửi file nếu người dùng có chọn file mới
//             // Backend của bạn check: if(request.getCoverUrl() != null && !request.getCoverUrl().isEmpty())
//             if (coverFile) {
//                 formData.append('coverUrl', coverFile);
//             }
//             if (audioFile) {
//                 formData.append('audioUrl', audioFile);
//             }

//             await onUpdate(songData.id, formData);
//             onClose();
//         } catch (error) {
//             console.error("Lỗi update:", error);
//             alert("Có lỗi xảy ra khi cập nhật!");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

//             <div className="relative -mt-10 bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

//                 {/* Header */}
//                 <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
//                     <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                         <Edit size={20} className="text-blue-500" /> Cập nhật bài hát
//                     </h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                         {/* Cột trái */}
//                         <div className="space-y-4">
//                             <InputGroup
//                                 label="Tên bài hát" icon={<Music size={16} />}
//                                 value={title} onChange={setTitle} placeholder="Nhập tên bài hát"
//                             />

//                             <SelectGroup
//                                 label="Nghệ sĩ" icon={<Mic2 size={16} />}
//                                 value={artistId} onChange={setArtistId}
//                                 options={MOCK_ARTIST_OPTIONS}
//                             />

//                             <SelectGroup
//                                 label="Album" icon={<Disc size={16} />}
//                                 value={albumId} onChange={setAlbumId}
//                                 options={MOCK_ALBUMS} placeholder="-- Không thay đổi --"
//                             />

//                             <InputGroup
//                                 label="Thể loại" icon={<Disc size={16} />}
//                                 value={category} onChange={setCategory} placeholder="Pop, Ballad..."
//                             />
//                         </div>

//                         {/* Cột phải - Truyền URL cũ để hiển thị preview */}
//                         <div className="space-y-6">
//                             <FileUpload
//                                 label="Ảnh bìa (Cover)" icon={<ImageIcon size={14} />} accept="image/*"
//                                 file={coverFile}
//                                 currentUrl={songData.coverUrl} // URL ảnh cũ
//                                 onChange={(e) => e.target.files && setCoverFile(e.target.files[0])}
//                             />

//                             <FileUpload
//                                 label="File nhạc (Audio)" icon={<FileAudio size={14} />} accept="audio/*"
//                                 file={audioFile}
//                                 currentUrl={songData.audioUrl} // URL nhạc cũ
//                                 onChange={(e) => e.target.files && setAudioFile(e.target.files[0])}
//                             />
//                         </div>
//                     </div>

//                     <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
//                         <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition">Hủy bỏ</button>
//                         <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/30">
//                             {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Lưu thay đổi"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UpdateSongModal;

import React, { useState, useEffect } from 'react';
import { X, Music, Disc, Mic2, Image as ImageIcon, FileAudio, Loader2, UploadCloud, Edit, Tag } from 'lucide-react';
import api from '../../../services/api';
import type { SongResponse, ArtistResponse, AlbumResponse, CategoryResponse } from '../../../types/backend';

// --- CÁC COMPONENT CON (DÙNG CHUNG VỚI CREATE) ---
const InputGroup = ({ icon, label, placeholder, value, onChange }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
            <input required type="text" placeholder={placeholder} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    </div>
);

const SelectGroup = ({ icon, label, value, onChange, options, required = false }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
            <select required={required} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition appearance-none cursor-pointer" value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="" disabled>Chọn {label.toLowerCase().replace('*', '')}</option>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    </div>
);

const FileUpload = ({ label, icon, accept, file, currentUrl, onChange }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <div className="relative overflow-hidden group">
            <input type="file" accept={accept} onChange={onChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed transition-all ${file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 group-hover:border-blue-400'}`}>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center">
                    {accept === 'image/*' && currentUrl && !file ? (
                        <img src={currentUrl} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                        file ? <UploadCloud size={16} className="text-blue-600 dark:text-blue-400" /> : <span className="text-gray-400">{icon}</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${file ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {file ? file.name : (currentUrl ? "Đã có file (Click để đổi)" : "Chọn file mới")}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

interface UpdateSongModalProps {
    isOpen: boolean;
    onClose: () => void;
    songData: SongResponse | null;
    onUpdate: (id: string, formData: FormData) => Promise<void>;
}

const UpdateSongModal = ({ isOpen, onClose, songData, onUpdate }: UpdateSongModalProps) => {
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
            setCoverFile(null); setAudioFile(null);
            return;
        }

        const fetchData = async () => {
            try {
                const [artistRes, albumRes, categoryRes] = await Promise.all([
                    api.get('/artist/list', { params: { size: 100 } }),
                    api.get('/albums/list', { params: { size: 100 } }),
                    api.get('/categories/list', { params: { size: 100 } })
                ]);
                const fetchedArtists = artistRes.data.result.content || [];
                const fetchedCategories = categoryRes.data.result.content || [];

                setArtists(fetchedArtists);
                setAlbums(albumRes.data.result.content || []);
                setCategories(fetchedCategories);

                // Điền dữ liệu cũ vào Form
                if (songData) {
                    setTitle(songData.title || '');
                    setAlbumId(songData.albumId || '');

                    // Vì backend trả về artistName/categoryName trong songData, ta cần map ngược lại ID
                    const matchedArtist = fetchedArtists.find((a: any) => a.name === songData.artist || a.id === songData.artistId);
                    setArtistId(matchedArtist ? matchedArtist.id : '');

                    const matchedCategory = fetchedCategories.find((c: any) => c.name === songData.category);
                    setCategoryId(matchedCategory ? matchedCategory.id : songData.category || '');
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Update Modal:", error);
            }
        };

        fetchData();
    }, [isOpen, songData]);

    if (!isOpen || !songData) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artistId', artistId);
        if (albumId) formData.append('albumId', albumId);
        formData.append('category', categoryId);

        // Cập nhật API chỉ nhận file mới nếu có chọn
        if (coverFile) formData.append('coverUrl', coverFile);
        if (audioFile) formData.append('audioUrl', audioFile);

        await onUpdate(songData.id, formData);
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
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Edit size={20} className="text-blue-500" /> Cập nhật Bài hát</h2>
                        <p className="text-xs text-gray-500 mt-1">Chỉnh sửa thông tin hoặc thay đổi file</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <h3 className="text-sm font-bold border-b border-gray-100 dark:border-zinc-800 pb-2">Thông tin cơ bản</h3>
                            <InputGroup label="Tên bài hát *" icon={<Music size={14} />} value={title} onChange={setTitle} />

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
                            <h3 className="text-sm font-bold border-b border-gray-100 dark:border-zinc-800 pb-2">Media Files</h3>
                            <FileUpload
                                label="Ảnh bìa (Cover)" icon={<ImageIcon size={14} />} accept="image/*"
                                file={coverFile} currentUrl={songData.coverUrl} onChange={(e: any) => e.target.files && setCoverFile(e.target.files[0])}
                            />
                            <FileUpload
                                label="File nhạc (Audio)" icon={<FileAudio size={14} />} accept="audio/*"
                                file={audioFile} currentUrl={songData.audioUrl} onChange={(e: any) => e.target.files && setAudioFile(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition">Hủy bỏ</button>
                        <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/30">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateSongModal;