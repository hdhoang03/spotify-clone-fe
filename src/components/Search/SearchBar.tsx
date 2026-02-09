// components/Search/SearchBar.tsx
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5
                      pointer-events-none text-zinc-500 group-focus-within:text-zinc-900
                      dark:group-focus-within:text-white transition-colors">
        <Search size={20} />
      </div>
      <input 
        type="text" 
        className="
          w-full py-2.5 pl-10 pr-10
          bg-zinc-100 dark:bg-zinc-800 
          text-zinc-900 dark:text-white 
          border border-zinc-200 dark:border-zinc-700
          rounded-full focus:outline-none
          focus:border-green-500 dark:focus:border-green-500
          focus:ring-2 focus:ring-green-500/20
          placeholder-zinc-500 font-medium text-base transition-all shadow-sm
        "
        placeholder="Bạn muốn nghe gì?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;