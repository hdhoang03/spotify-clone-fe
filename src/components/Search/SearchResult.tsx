import { Play, Heart, User, Disc, Pause, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchApi } from './useSearchApi';
import { useMusic } from '../../contexts/MusicContent';
import { useNavigate } from 'react-router-dom';
import { useLikeSong } from '../../hooks/useLikeSong';
import ArtistLinks from '../common/ArtistLinks';
import { handlePlaySongAction } from './searchUtils';
import { useTranslation } from 'react-i18next';

interface SearchResultsProps {
	query: string;
}

const SearchSongItem = ({ song, index, currentSong, isPlaying, handlePlaySong }: any) => {
	const { isLiked, toggleLike } = useLikeSong(song.id, song.isLiked);
	const isCurrent = currentSong?.id === song.id;

	return (
		<motion.div
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: index * 0.04 }}
			onClick={() => handlePlaySong(song)}
			className="group flex items-center justify-between px-2 py-2 rounded-xl
				hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
		>
			<div className="flex items-center gap-3">
				{/* Index / equalizer */}
				<div className="w-6 flex items-center justify-center shrink-0">
					{isCurrent && isPlaying ? (
						<span className="flex items-end gap-[2px] h-4">
							<span className="w-[3px] bg-green-500 rounded-sm eq-bar-1" style={{ height: 4 }} />
							<span className="w-[3px] bg-green-500 rounded-sm eq-bar-2" style={{ height: 10 }} />
							<span className="w-[3px] bg-green-500 rounded-sm eq-bar-3" style={{ height: 6 }} />
						</span>
					) : (
						<span className={`text-xs font-bold tabular-nums
							${isCurrent ? 'text-green-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
							{index + 1}
						</span>
					)}
				</div>

				{/* Cover art */}
				<div className="relative w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
					<img
						src={song.coverUrl || '/default-cover.jpg'}
						alt={song.title}
						className="w-full h-full object-cover"
						loading="lazy"
					/>
					<div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100
						transition-opacity flex items-center justify-center">
						{isCurrent && isPlaying
							? <Pause size={16} className="text-white fill-white" />
							: <Play size={16} className="text-white fill-white ml-0.5" />
						}
					</div>
				</div>

				{/* Text */}
				<div className="min-w-0">
					<h3 className={`font-semibold truncate transition-colors text-sm
						${isCurrent ? 'text-green-500 dark:text-green-400' : 'text-zinc-900 dark:text-white'}`}>
						{song.title}
					</h3>
					<ArtistLinks
						song={{
							artist: song.artistName,
							artistId: song.artistId,
							featuredArtists: song.featuredArtists
						}}
						className="max-w-[200px]"
					/>
				</div>
			</div>

			{/* Like button */}
			<button
				onClick={(e) => {
					e.stopPropagation();
					const token = localStorage.getItem('token');
					if (!token) { window.dispatchEvent(new Event('open-auth-modal')); return; }
					toggleLike();
				}}
				className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700
					transition-all opacity-0 group-hover:opacity-100"
			>
				<Heart
					size={16}
					className={isLiked ? 'text-green-500 fill-green-500' : 'text-zinc-400 hover:text-green-500'}
				/>
			</button>
		</motion.div>
	);
};

const SearchResults = ({ query }: SearchResultsProps) => {
	const { t } = useTranslation();
	const { data, isLoading, error } = useSearchApi(query);
	const { playRadio, currentSong, isPlaying } = useMusic();
	const navigate = useNavigate();

	if (!query) return null;

	if (isLoading) {
		return (
			<div className="mt-12 flex flex-col items-center gap-3 text-zinc-500">
				<div className="w-10 h-10 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
				<span className="text-sm font-medium">{t('search.searching')}</span>
			</div>
		);
	}

	if (error) {
		return <div className="mt-8 text-red-500 text-center">{error}</div>;
	}

	const hasResults = data && (
		(data.songs?.length ?? 0) > 0 ||
		(data.artists?.length ?? 0) > 0 ||
		(data.albums?.length ?? 0) > 0 ||
		(data.users?.length ?? 0) > 0
	);

	if (data && !hasResults) {
		return (
			<div className="mt-16 text-center">
				<div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
					<Music size={28} className="text-zinc-400" />
				</div>
				<h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
					{t('search.no_results', { query })}
				</h3>
				<p className="text-sm text-zinc-500 dark:text-zinc-400">
					{t('search.try_again')}
				</p>
			</div>
		);
	}

	const handlePlaySong = (song: any) => {
		handlePlaySongAction(song, data, playRadio);
	};

	return (
		<div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">

			{/* 1. Bài hát */}
			{data?.songs && data.songs.length > 0 && (
				<div className="mb-10">
					<h2 className="text-lg font-extrabold mb-3 text-zinc-900 dark:text-white tracking-tight">
						{t('search.songs')}
					</h2>
					<div className="flex flex-col gap-0.5">
						{data.songs.map((song, index) => (
							<SearchSongItem
								key={`song-${song.id}`}
								song={song}
								index={index}
								currentSong={currentSong}
								isPlaying={isPlaying}
								handlePlaySong={handlePlaySong}
							/>
						))}
					</div>
				</div>
			)}

			{/* 2. Nghệ sĩ */}
			{data?.artists && data.artists.length > 0 && (
				<div className="mb-10">
					<h2 className="text-lg font-extrabold mb-4 text-zinc-900 dark:text-white tracking-tight">
						{t('search.artists')}
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{data.artists.map((artist, index) => (
							<motion.div
								key={`artist-${artist.id}`}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.25, delay: index * 0.05 }}
								onClick={() => navigate(`/artist/${artist.id}`)}
								className="group flex flex-col items-center p-4 rounded-2xl
									bg-zinc-50 dark:bg-zinc-900/80
									hover:bg-zinc-100 dark:hover:bg-zinc-800
									border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700
									cursor-pointer transition-all duration-300 hover:shadow-lg"
							>
								<div className="relative w-24 h-24 mb-3">
									<img
										src={artist.avatarUrl || '/default-artist.png'}
										alt={artist.name}
										className="w-full h-full rounded-full object-cover shadow-md
											transition-transform duration-500 group-hover:scale-105
											ring-2 ring-transparent group-hover:ring-zinc-200 dark:group-hover:ring-zinc-600"
									/>
									{/* Hover overlay */}
									<div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100
										transition-opacity duration-300 flex items-center justify-center">
										<Play size={22} className="text-white fill-white ml-1" />
									</div>
								</div>
								<h3 className="font-bold text-zinc-900 dark:text-white truncate w-full text-center text-sm
									group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
									{artist.name}
								</h3>
								<span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-1">
									<User size={11} /> {t('home.artist_role')}
								</span>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{/* 3. Album */}
			{data?.albums && data.albums.length > 0 && (
				<div className="mb-10">
					<h2 className="text-lg font-extrabold mb-4 text-zinc-900 dark:text-white tracking-tight">
						{t('search.albums')}
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{data.albums.map((album, index) => (
							<motion.div
								key={`album-${album.id}`}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.25, delay: index * 0.05 }}
								onClick={() => navigate(`/albums/${album.id}`)}
								className="group p-3 rounded-2xl cursor-pointer transition-all duration-300
									bg-zinc-50 dark:bg-zinc-900/80
									hover:bg-zinc-100 dark:hover:bg-zinc-800
									border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700
									hover:shadow-lg"
							>
								<div className="relative aspect-square mb-3 rounded-xl overflow-hidden shadow-md">
									<img
										src={album.albumUrl || album.avatarUrl || album.coverUrl || '/default-album.png'}
										alt={album.name}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									{/* Play overlay */}
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
										transition-opacity duration-300 flex items-end justify-end p-2">
										<div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg
											translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
											<Play size={16} className="fill-black text-black ml-0.5" />
										</div>
									</div>
								</div>
								<h3 className="font-bold text-zinc-900 dark:text-white truncate text-sm">
									{album.name}
								</h3>
								<p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1 flex items-center gap-1">
									<Disc size={11} /> {album.artistName}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{/* 4. Người dùng */}
			{data?.users && data.users.length > 0 && (
				<div className="mb-10">
					<h2 className="text-lg font-extrabold mb-4 text-zinc-900 dark:text-white tracking-tight">
						{t('search.users')}
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{data.users.map((user, index) => (
							<motion.div
								key={`user-${user.id}`}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.25, delay: index * 0.05 }}
								onClick={() => navigate(`/user/${user.id}/profile`)}
								className="group flex flex-col items-center p-4 rounded-2xl
									bg-zinc-50 dark:bg-zinc-900/80
									hover:bg-zinc-100 dark:hover:bg-zinc-800
									border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700
									cursor-pointer transition-all duration-300 hover:shadow-lg"
							>
								<div className="relative w-20 h-20 mb-3">
									<img
										src={user.avatarUrl || '/default-avatar.png'}
										alt={user.username}
										className="w-full h-full rounded-full object-cover shadow-md
											transition-transform duration-500 group-hover:scale-105
											ring-2 ring-transparent group-hover:ring-zinc-200 dark:group-hover:ring-zinc-600"
									/>
								</div>
								<h3 className="font-bold text-zinc-900 dark:text-white truncate w-full text-center text-sm">
									{user.username}
								</h3>
								<span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-1">
									<User size={11} /> {t('search.profile_role')}
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