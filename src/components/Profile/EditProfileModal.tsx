import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Trash2 } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/canvasUilts';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    currentAvatar?: string;
    onSave: (newName: string, newFile: File | null, isRemoved?: boolean) => void;
}

const EditProfileModal = ({ isOpen, onClose, currentName, currentAvatar, onSave }: EditProfileModalProps) => {
    const [name, setName] = useState(currentName);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRemoved, setIsRemoved] = useState(false); //Đánh dấu user muốn xóa ảnh
    // State cho Cropper
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Hàm gọi input file click (để tái sử dụng cho nút bên ngoài)
    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    // Reset state khi mở modal
    useEffect(() => {
        if (isOpen) {
            setName(currentName);
            setPreviewUrl(currentAvatar || null);
            setSelectedFile(null);
            setIsRemoved(false);
            setZoom(1);
            setCrop({ x: 0, y: 0 })
        }
    }, [isOpen, currentName, currentAvatar]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Tạo URL preview nội bộ, chưa gửi lên server
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setSelectedFile(file);
            setIsRemoved(false);
        }
    };

    const handleRemovePhoto = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsRemoved(true); // Đánh dấu để API biết là cần xóa ảnh cũ
        // Reset giá trị input file để có thể chọn lại chính file đó nếu muốn
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSave = async () => {
        try {
            let finalFile = selectedFile;

            // Nếu có file mới và đang có thông số crop -> Cắt ảnh
            if (selectedFile && previewUrl && croppedAreaPixels) {
                const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
                // Chuyển Blob thành File để upload
                finalFile = new File([croppedBlob], selectedFile.name, { type: selectedFile.type });
            }

            // Truyền ngược ra ngoài: Name, File ảnh (đã crop), và cờ xóa ảnh
            onSave(name, finalFile, isRemoved); 
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    // Helper render Avatar mặc định
    const renderDefaultAvatar = () => (
        <div className="w-full h-full flex items-center justify-center 
                        bg-gradient-to-br from-green-400 to-green-600 
                        shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] 
                        animate-in fade-in duration-300">
            {/* Tạo hiệu ứng Blur/Glow phía sau chữ */}
            <span className="text-black font-black text-6xl uppercase drop-shadow-md z-10">
                {name.charAt(0) || 'U'}
            </span>
            
            {/* Lớp phủ noise hoặc blur nhẹ nếu muốn (optional) */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="m-2 bg-white dark:bg-[#282828] w-[524px] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-colors" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition"><X size={24} /></button>
                </div>

                {/* Body */}
                <div className="p-6 pt-0 flex gap-4 items-center">
                    
                    {/* --- CỘT TRÁI: AVATAR & CROPPER --- */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group">
                            <div className="w-[180px] h-[180px] rounded-full shadow-2xl overflow-hidden relative border-4 border-white dark:border-[#333]">
                                
                                {selectedFile && previewUrl ? (
                                    /* --- MODE: CROP (Đang chỉnh sửa) --- */
                                    /* Không có Overlay ở đây để kéo thả mượt mà */
                                    <Cropper
                                        image={previewUrl}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                        cropShape="round"
                                        showGrid={false}
                                        objectFit="cover"
                                    />
                                ) : (
                                    /* --- MODE: VIEW (Xem ảnh cũ) --- */
                                    <>
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            renderDefaultAvatar()
                                        )}

                                        {/* Chỉ hiện Overlay Choose Photo khi CHƯA chọn file mới */}
                                        <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-2 
                                                        bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer z-10"
                                            onClick={triggerFileSelect}>
                                            <Camera size={40} className="text-white" />
                                            <span className="text-white font-bold text-sm uppercase">Choose photo</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Input file ẩn luôn nằm đây */}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>

                            {/* Nút Remove Photo (Vẫn giữ logic cũ) */}
                            {previewUrl && !selectedFile && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                                    className="absolute -bottom-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-md 
                                            hover:bg-red-600 transition z-20 tooltip"
                                    title="Remove photo"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        {/* --- NÚT ĐỔI ẢNH KHÁC (Khi đang Crop) --- */}
                        {/* Nếu đang chọn file, hiện nút này bên ngoài để user đổi ý */}
                        {selectedFile && (
                            <button 
                                onClick={triggerFileSelect}
                                className="text-xs font-bold text-green-500 hover:text-black dark:hover:text-white transition"
                            >
                                Change Image
                            </button>
                        )}
                    </div>

                    {/* --- CỘT PHẢI: FORM & SLIDER --- */}
                    <div className="flex-1 flex flex-col gap-4">
                        <input 
                            type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="bg-gray-100 dark:bg-[#3e3e3e] border-none rounded-md px-3 py-2
                                    text-gray-900 dark:text-white font-bold focus:ring-1 focus:ring-green-500
                                    focus:outline-none w-full text-sm"
                            placeholder="Name"
                        />

                        {/* Slider Zoom */}
                        {selectedFile && (
                            <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex justify-between">
                                    <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Zoom</label>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(zoom * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Drag image to adjust position</p>
                            </div>
                        )}

                        <div className="flex-1"></div>
                        <button 
                            onClick={handleSave}
                            className="self-end px-8 py-3 bg-green-500 hover:bg-green-600 dark:bg-white dark:text-black 
                                    dark:hover:scale-105 text-white font-bold rounded-full transition shadow-lg"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="p-4 text-[11px] font-bold text-gray-500 dark:text-white/60 text-center bg-gray-50 dark:bg-[#121212]/30">
                    By proceeding, you agree to give SpringTunes access to the image you choose to upload.
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;