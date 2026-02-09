// // Hiển thị ảnh bìa, tên bài hát, tên ca sĩ và nút yêu thích
// import React, {useEffect} from 'react';
// import { ChevronUp, Heart } from 'lucide-react';
// import { FastAverageColor } from 'fast-average-color';

// interface PlayerTrackInfoProps {
//     currentSong: {
//         title: string;
//         artist: string;
//         coverUrl: string;
//     }| null;
//     onColorChange: (color: string) => void;
// }

// const PlayerTrackInfo = ({ currentSong, onColorChange }: PlayerTrackInfoProps) => {
//     // 2. Guard clause: Nếu chưa có bài hát thì hiện Skeleton hoặc div rỗng
//     useEffect(() => {
//         if (!currentSong) return;

//         const fac = new FastAverageColor();
//         fac.getColorAsync(currentSong.coverUrl, { algorithm: 'dominant' })
//             .then((color) => {
//                 const newColor = color.rgba.replace(',1)', ',0.7)'); 
//                 onColorChange(newColor);
//             })
//             .catch(() => {
//                 onColorChange('rgba(0, 0, 0, 0.8)'); // Fallback color
//             });
//     }, [currentSong, onColorChange]);

//     if (!currentSong) return <div className="w-[30%]"></div>;
//     return (
//         <div className="flex items-center gap-4 w-[30%]">
//             <div className="w-14 h-14 rounded overflow-hidden shadow-md relative group cursor-pointer">
//                 <img src={currentSong.coverUrl} 
//                     alt={currentSong.title} 
//                     className="object-cover w-full h-full transition group-hover:opacity-80"
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
//                     <ChevronUp size={20} className="text-white"/>
//                 </div>
//             </div>
//             <div className="hidden md:block overflow-hidden">
//                 <h4 className="text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:underline">
//                     {currentSong.title}
//                 </h4>
//                 <p className="text-xs text-gray-800 dark:text-gray-400 hover:underline cursor-pointer">
//                     {currentSong.artist}
//                 </p>
//             </div>
//             <button className="text-gray-900 dark:text-gray-400
//                             hover:text-green-400
//                             transition hidden md:block ml-2">
//                 <Heart size={18} />
//             </button>
//         </div>
//     );
// };

// export default PlayerTrackInfo;