// // components/Search/SearchResults.tsx
// import React from 'react';
// import { Play, Heart, Clock } from 'lucide-react';
// import { motion } from 'framer-motion';

// interface SearchResultsProps {
//   query: string;
// }

// // Mock Data kết quả tìm kiếm
// const MOCK_RESULTS = [
//   { id: 1, title: 'Spring Boot Pro', artist: 'Java Dev', album: 'Backend Hits', duration: '3:45', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop' },
//   { id: 2, title: 'Debugging All Night', artist: 'Fullstack', album: 'Midnight Code', duration: '4:20', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop' },
//   { id: 3, title: 'React Hooks', artist: 'Frontend Team', album: 'Render Cycle', duration: '2:50', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop' },
// ];

// const SearchResults = ({ query }: SearchResultsProps) => {
//   const results = MOCK_RESULTS; //thực tế sẽ lấy từ API

//   if (!query) return null;

//   return (
//     <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Kết quả hàng đầu cho "{query}"</h2>

//       <div className="flex flex-col gap-1">
//         {results.map((song, index) => (
//           <motion.div 
//             key={song.id}
//             initial={{ opacity: 0, y: -10 }} // Bắt đầu: Ẩn và nằm thấp
//             animate={{ opacity: 1, y: 0 }}  // Kết thúc: Hiện và về vị trí chuẩn
//             transition={{ 
//                 duration: 0.3, 
//                 delay: index * 0.05 // Delay tăng dần theo thứ tự: 0s, 0.1s, 0.2s...
//             }}
//             className="group flex items-center justify-between p-2 rounded-lg 
//                        hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
//           >
//             <div className="flex items-center gap-3">
//               {/* Image & Play Overlay */}
//               <div className="relative w-12 h-12 flex-shrink-0">
//                 <img src={song.img} alt={song.title} className="w-full h-full object-cover rounded shadow-sm" loading="lazy"/>
//                 <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                    <Play size={20} className="text-white fill-white translate-y-1 group-hover:translate-y-0 transition-transform duration-200" />
//                 </div>
//               </div>

//               {/* Info */}
//               <div className="min-w-0"> {/* min-w-0 giúp text truncate hoạt động */}
//                 <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{song.title}</h3>
//                 <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{song.artist}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//                <button className="p-2 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-400 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all">
//                   <Heart size={18} />
//                </button>
//                <span className="text-sm text-gray-500">
//                   {song.duration}
//                </span>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchResults;

// components/Search/SearchResults.tsx
import { Play, Heart, User, Disc } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchApi } from './useSearchApi';
import { useMusic } from '../../contexts/MusicContent';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
	query: string;
}

const SearchResults = ({ query }: SearchResultsProps) => {
	const { data, isLoading, error } = useSearchApi(query);
	const { playPlaylist } = useMusic();
	const navigate = useNavigate();

	if (!query) return null;

	if (isLoading) {
		return (
			<div className="mt-8 flex justify-center text-zinc-500">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
			</div>
		);
	}

	if (error) {
		return <div className="mt-8 text-red-500 text-center">{error}</div>;
	}

	// Kiểm tra nếu không có kết quả nào
	const hasResults = data && (
		(data.songs?.length ?? 0) > 0 ||
		(data.artists?.length ?? 0) > 0 ||
		(data.albums?.length ?? 0) > 0 ||
		(data.users?.length ?? 0) > 0
	);

	if (data && !hasResults) {
		return (
			<div className="mt-12 text-center text-zinc-500 dark:text-zinc-400">
				<h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Không tìm thấy kết quả nào cho "{query}"</h3>
				<p>Vui lòng kiểm tra lại chính tả hoặc thử các từ khóa khác.</p>
			</div>
		);
	}

	const handlePlaySong = (song: any) => {
		playPlaylist([song], 0);
	};

	return (
		<div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

			{/* 1. KẾT QUẢ BÀI HÁT */}
			{data?.songs && data.songs.length > 0 && (
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Bài hát</h2>
					<div className="flex flex-col gap-1">
						{data.songs.map((song, index) => (
							<motion.div
								key={`song-${song.id}`}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.2, delay: index * 0.05 }}
								onClick={() => handlePlaySong(song)} // Thêm sự kiện onClick
								className="group flex items-center justify-between p-2 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
							>
								<div className="flex items-center gap-3">
									<div className="relative w-12 h-12 flex-shrink-0">
										<img src={song.coverUrl || '/default-cover.jpg'} alt={song.title} className="w-full h-full object-cover rounded shadow-sm" loading="lazy" />
										<div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
											<Play size={20} className="text-white fill-white" />
										</div>
									</div>
									<div className="min-w-0">
										<h3 className="font-semibold text-zinc-900 dark:text-white truncate">{song.title}</h3>
										<p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{song.artistName}</p>
									</div>
								</div>
								<button
									onClick={(e) => e.stopPropagation()} // Ngăn chặn nổi bọt sự kiện để không play nhạc khi ấn tim
									className="p-2 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-400 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all"
								>
									<Heart size={18} />
								</button>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{/* 2. KẾT QUẢ NGHỆ SĨ */}
			{data?.artists && data.artists.length > 0 && (
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Nghệ sĩ</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{data.artists.map((artist, index) => (
							<motion.div
								key={`artist-${artist.id}`}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: index * 0.05 }}
								onClick={() => navigate(`/artist/${artist.id}`)}
								className="flex flex-col items-center p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer transition-colors group"
							>
								<img
									src={artist.avatarUrl || '/default-artist.png'}
									alt={artist.name}
									className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg group-hover:shadow-xl transition-shadow"
								/>
								<h3 className="font-bold text-zinc-900 dark:text-white truncate w-full text-center">{artist.name}</h3>
								<span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
									<User size={14} /> Nghệ sĩ
								</span>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{/* 3. KẾT QUẢ ALBUM */}
			{data?.albums && data.albums.length > 0 && (
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Album</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{data.albums.map((album, index) => (
							<motion.div
								key={`album-${album.id}`}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: index * 0.05 }}
								onClick={() => navigate(`/albums/${album.id}`)}
								className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
							>
								<div className="relative aspect-square mb-4">
									<img src={album.avatarUrl || '/default-album.png'} alt={album.name} className="w-full h-full object-cover rounded-md shadow-md" />
								</div>
								<h3 className="font-bold text-zinc-900 dark:text-white truncate">{album.name}</h3>
								<p className="text-sm text-zinc-500 dark:text-zinc-400 truncate mt-1 flex items-center gap-1">
									<Disc size={14} /> {album.artistName}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{/* 4. KẾT QUẢ NGƯỜI DÙNG */}
			{data?.users && data.users.length > 0 && (
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Người dùng</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{data.users.map((user, index) => (
							<motion.div
								key={`user-${user.id}`}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: index * 0.05 }}
								onClick={() => navigate(`/user/${user.id}/profile`)}
								className="flex flex-col items-center p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer transition-colors group"
							>
								<img
									src={user.avatarUrl || '/default-avatar.png'} // Đảm bảo bạn có ảnh mặc định này trong thư mục public
									alt={user.username}
									className="w-24 h-24 rounded-full object-cover mb-4 shadow-md group-hover:shadow-lg transition-shadow"
								/>
								<h3 className="font-bold text-zinc-900 dark:text-white truncate w-full text-center">{user.username}</h3>
								<span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
									<User size={14} /> Hồ sơ
								</span>
							</motion.div>
						))}
					</div>
				</div>
			)}

		</div>
	);
};

export default SearchResults;