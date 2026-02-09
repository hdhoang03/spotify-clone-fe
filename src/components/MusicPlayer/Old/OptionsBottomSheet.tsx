// import React from 'react';
// import { motion } from 'framer-motion';
// import type { PanInfo } from 'framer-motion';
// import { ListPlus, Disc, Mic2, Share2, Info, Heart } from 'lucide-react';
// import ScrollingText from './ScrollingText';

// interface OptionsBottomSheetProps {
//     isOpen: boolean;
//     onClose: () => void;
//     song: any; // Dữ liệu bài hát
//     onShare: () => void; // Hàm share từ cha truyền vào
// }

// const OptionsBottomSheet = ({ isOpen, onClose, song, onShare }: OptionsBottomSheetProps) => {
//     // Cấu hình danh sách options
//     const options = [
//         {
//             id: 'add_playlist',
//             icon: ListPlus,
//             label: 'Thêm vào Playlist',
//             action: () => {
//                 // TODO: Call API add to playlist
//                 console.log('API: Add to playlist');
//             }
//         },
//         {
//             id: 'go_artist',
//             icon: Mic2,
//             label: 'Xem Nghệ sĩ',
//             action: () => {
//                 // TODO: Navigate to Artist Page
//                 console.log('Nav: Go to Artist');
//             }
//         },
//         {
//             id: 'go_album',
//             icon: Disc,
//             label: 'Xem Album',
//             action: () => {
//                 // TODO: Navigate to Album Page
//                 console.log('Nav: Go to Album');
//             }
//         },
//         {
//             id: 'share',
//             icon: Share2,
//             label: 'Chia sẻ',
//             action: () => {
//                 onShare();
//                 onClose();
//             }
//         },
//         {
//             id: 'credits',
//             icon: Info,
//             label: 'Thông tin bài hát',
//             action: () => {
//                 // TODO: Show credits modal
//                 console.log('Modal: Show Credits');
//             }
//         }
//     ];

//     if (!isOpen) return null;

//     return (
//         <>
//             {/* Backdrop: Bấm vào vùng tối để đóng */}
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={onClose}
//                 className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
//             />

//             {/* Bottom Sheet */}
//             <motion.div
//                 initial={{ y: "100%" }}
//                 animate={{ y: 0 }}
//                 exit={{ y: "100%" }}
//                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
//                 drag="y"
//                 dragConstraints={{ top: 0 }} // Không cho kéo lên quá cao
//                 dragElastic={0.2} // Độ đàn hồi khi kéo quá giới hạn
//                 onDragEnd={(e, info: PanInfo) => {
//                     // Nếu kéo xuống quá 100px hoặc vận tốc nhanh -> Đóng
//                     if (info.offset.y > 100 || info.velocity.y > 500) {
//                         onClose();
//                     }
//                 }}
//                 className="fixed bottom-0 left-0 right-0 z-[70] bg-zinc-900 rounded-t-[2rem] overflow-hidden flex flex-col max-h-[85vh]"
//                 style={{ boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}
//             >
//                 {/* Drag Handle */}
//                 <div className="w-full flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
//                     <div className="w-12 h-1.5 bg-zinc-600 rounded-full" />
//                 </div>

//                 {/* Content Container (Scrollable) */}
//                 <div className="flex-1 overflow-y-auto px-6 pb-12 pt-2 scrollbar-hide">
                    
//                     {/* Header: Song Info Preview */}
//                     <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
//                         <img 
//                             src={song.coverUrl} 
//                             alt="thumb" 
//                             className="w-16 h-16 rounded-md object-cover shadow-lg"
//                         />
//                         <div className="flex-1 min-w-0 flex flex-col justify-center">
//                             <ScrollingText content={song.title} className="text-lg font-bold text-white"/>
//                             <ScrollingText content={song.artist} className="text-zinc-400 mt-0.5"/>
//                         </div>

//                         {/* Nút Love nhanh */}
//                         <button className="p-2 text-green-500 hover:scale-110 transition">
//                             <Heart fill="currentColor" size={24} />
//                         </button>
//                     </div>

//                     {/* Options List */}
//                     <div className="flex flex-col gap-2">
//                         {options.map((opt) => (
//                             <button
//                                 key={opt.id}
//                                 onClick={opt.action}
//                                 className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all text-left group"
//                             >
//                                 <opt.icon className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
//                                 <span className="text-base font-medium text-zinc-200 group-hover:text-white">{opt.label}</span>
//                             </button>
//                         ))}
//                     </div>

//                     {/* Footer Close Button (Optional - cho ai không thích vuốt) */}
//                     {/* <button 
//                         onClick={onClose}
//                         className="mt-8 w-full py-4 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs hover:text-white transition"
//                     >
//                         Đóng
//                     </button> */}
//                 </div>
//             </motion.div>
//         </>
//     );
// };

// export default OptionsBottomSheet;