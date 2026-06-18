import { Search, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
	value: string;
	onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isFocused, setIsFocused] = useState(false);

	const { t } = useTranslation();

	// Lấy đường dẫn hiện tại để biết khi nào người dùng chuyển tab
	const location = useLocation();

	// 2. EFFECT: KHI CHUYỂN TAB -> TỰ ĐỘNG THU GỌN VÀ XÓA CHỮ
	useEffect(() => {
		setIsFocused(false);
		inputRef.current?.blur();
		onChange('');
	}, [location.pathname, onChange]);

	// Thanh chỉ mở rộng khi đang click vào (isFocused) HOẶC đang có chữ
	const isActive = isFocused || value.length > 0;

	const handleClear = () => {
		onChange('');
		inputRef.current?.focus(); // Giữ focus để người dùng gõ từ khóa mới ngay
	};

	return (
		<div
			className={`relative transition-all duration-300 ease-in-out group ${isActive ? 'w-full max-w-md' : 'w-11' // Mở rộng w-full, thu gọn w-11
				}`}
		>
			{/* Icon Search cố định bên trái */}
			<div
				className={`absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none transition-colors z-10 w-11
          ${isActive ? 'text-zinc-500 group-focus-within:text-zinc-900 dark:group-focus-within:text-white' : 'text-zinc-900 dark:text-white'}
        `}
			>
				<Search size={20} />
			</div>

			{/* Ô Input chính */}
			<input
				ref={inputRef}
				type="text"
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)} // Khi click ra ngoài -> tự tắt isFocused
				className={`
          w-full h-11 transition-all duration-300 ease-in-out
          text-zinc-900 dark:text-white
          border rounded-full !outline-none
          font-medium text-base shadow-sm
          ${isActive
						? 'pl-11 pr-11 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-600 placeholder-zinc-500 cursor-text'
						: 'pl-11 pr-0 bg-zinc-100 dark:bg-zinc-800/50 border-transparent placeholder-transparent cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700'
					}
        `}
				placeholder={t('search.placeholder')}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>

			{/* Nút X */}
			{value && (
				<button
					// Dùng onMouseDown + preventDefault để khi bấm nút X, input KHÔNG bị mất focus
					onMouseDown={(e) => {
						e.preventDefault();
						handleClear();
					}}
					className="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-zinc-500 hover:text-black dark:hover:text-white transition-colors z-10"
				>
					<X size={20} />
				</button>
			)}
		</div>
	);
};

export default SearchBar;