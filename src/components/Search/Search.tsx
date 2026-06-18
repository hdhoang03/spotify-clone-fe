// components/Search/index.tsx
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CategoryCard from './CategoryCard';
import SearchResults from './SearchResult';
import { useSearchStore } from '../../hooks/useSearch';

const COLORS = [
	{ cls: 'bg-purple-600', hex: '#9333ea' },
	{ cls: 'bg-green-600', hex: '#16a34a' },
	{ cls: 'bg-orange-500', hex: '#f97316' },
	{ cls: 'bg-blue-600', hex: '#2563eb' },
	{ cls: 'bg-teal-600', hex: '#0d9488' },
	{ cls: 'bg-pink-600', hex: '#db2777' },
	{ cls: 'bg-indigo-500', hex: '#6366f1' },
	{ cls: 'bg-red-600', hex: '#dc2626' },
	{ cls: 'bg-yellow-600', hex: '#ca8a04' },
	{ cls: 'bg-cyan-600', hex: '#0891b2' },
	{ cls: 'bg-emerald-600', hex: '#059669' },
	{ cls: 'bg-rose-600', hex: '#e11d48' }
];

import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BackButton from '../common/BackButton';
import { useTranslation } from 'react-i18next';

const SearchPage = () => {
	const { t } = useTranslation();
	const { query, setQuery } = useSearchStore();
	const [isScrolled, setIsScrolled] = useState(false);
	const [categories, setCategories] = useState<any[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await api.get('/categories');
				if (res.data?.result?.content) {
					setCategories(res.data.result.content);
				}
			} catch (err) {
				console.error("Lỗi lấy danh mục:", err);
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		// Cleanup function: Tự động reset thanh search khi rời khỏi trang (chuyển tab)
		return () => {
			setQuery('');
		};
	}, [setQuery]);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className="relative min-h-screen bg-white dark:bg-[#121212] text-zinc-900 dark:text-white p-4 md:p-8 pb-24">

			{/* Ẩn thanh search này ở màn hình md (Desktop/Tablet) vì đã có trên Header */}
			<div
				className={`
          md:hidden sticky top-0 z-30 -mx-4 px-4 mb-6
          transition-all duration-300 ease-in-out
          ${isScrolled
						? 'py-3 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-sm'
						: 'py-3 bg-transparent border-transparent'
					}
        `}
			>
				<div className="flex items-center gap-3">
					<BackButton className="bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 p-2 rounded-full text-black dark:text-white transition-all shrink-0" />
					<div className="flex-1">
						<SearchBar value={query} onChange={setQuery} />
					</div>
				</div>
			</div>

			{/* Nút Back cho Desktop */}
			<div className="hidden md:flex mb-6">
				<BackButton className="bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 p-2 rounded-full text-black dark:text-white transition-all" />
			</div>
			{query ? (
				<SearchResults query={query} />
			) : (
				<div className="animate-in fade-in duration-300">
					<h2 className="text-xl font-bold mb-4">{t('search.browse_all')}</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{categories.map((cat, index) => {
							const colorObj = COLORS[index % COLORS.length];
							return (
								<div
									key={cat.id}
									onClick={() => navigate(`/category/${cat.id}`, { state: { colorHex: colorObj.hex } })}
									className="cursor-pointer"
								>
									<CategoryCard
										title={cat.name}
										color={colorObj.cls}
										index={index}
									/>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchPage;