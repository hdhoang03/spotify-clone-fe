import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import api from '../../../services/api';
import type { ArtistResponse } from '../../../types/backend';

interface AsyncArtistSelectProps {
    label: string;
    icon: React.ReactNode;
    isMulti?: boolean;
    value: string | string[]; // ID(s)
    onChange: (value: any) => void;
    required?: boolean;
    placeholder?: string;
    initialOptions?: any[]; // Thêm prop này để truyền dữ liệu khởi tạo
}

const EMPTY_ARRAY: any[] = [];

const AsyncArtistSelect = ({ label, icon, isMulti = false, value, onChange, required = false, placeholder = "Tìm kiếm nghệ sĩ...", initialOptions = EMPTY_ARRAY }: AsyncArtistSelectProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<ArtistResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedArtists, setSelectedArtists] = useState<ArtistResponse[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync selectedArtists with value prop and fetch missing details if needed
    useEffect(() => {
        const ids = isMulti ? (value as string[] || []) : (value ? [value as string] : []);
        
        setSelectedArtists(prevSelected => {
            // 1. Remove artists that are no longer in value
            const updatedSelected = prevSelected.filter(artist => ids.includes(artist.id));
            
            // 2. Find IDs that are in value but not in updatedSelected
            const existingIds = updatedSelected.map(a => a.id);
            const missingIds = ids.filter(id => !existingIds.includes(id));
            
            if (missingIds.length > 0) {
                const fetchMissing = async () => {
                    try {
                        const fetched = await Promise.all(
                            missingIds.map(async (id) => {
                                const initialMatch = initialOptions.find(o => o.id === id);
                                if (initialMatch) return initialMatch;
                                
                                const res = await api.get(`/artist/${id}`);
                                return res.data?.result;
                            })
                        );
                        
                        const validFetched = fetched.filter(Boolean) as ArtistResponse[];
                        setSelectedArtists(current => {
                            const stillValid = current.filter(artist => ids.includes(artist.id));
                            const merged = [...stillValid];
                            validFetched.forEach(fetchedArt => {
                                if (!merged.some(m => m.id === fetchedArt.id)) {
                                    merged.push(fetchedArt);
                                }
                            });
                            return merged;
                        });
                    } catch (err) {
                        console.error("Lỗi khi tải thông tin nghệ sĩ:", err);
                    }
                };
                fetchMissing();
            }
            
            return updatedSelected;
        });
    }, [value, isMulti, initialOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (!searchTerm.trim()) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            try {
                // Thử gọi /search nếu backend có
                const res = await api.get('/search', { params: { keyword: searchTerm, type: 'artist' } });
                const artists = res.data?.result?.artists || [];
                // Nếu /search không trả artists, có thể gọi /artist/list
                if (artists.length === 0) {
                     const listRes = await api.get('/artist/list', { params: { size: 10, keyword: searchTerm } });
                     setResults(listRes.data?.result?.content || []);
                } else {
                     setResults(artists);
                }
            } catch (err) {
                console.error("Lỗi tìm kiếm nghệ sĩ:", err);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSelect = (artist: ArtistResponse) => {
        if (isMulti) {
            const currentValues = (value as string[]) || [];
            if (!currentValues.includes(artist.id)) {
                const newValues = [...currentValues, artist.id];
                onChange(newValues);
                setSelectedArtists([...selectedArtists, artist]);
            }
        } else {
            onChange(artist.id);
            setSelectedArtists([artist]);
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    const handleRemove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMulti) {
            const currentValues = (value as string[]) || [];
            onChange(currentValues.filter(v => v !== id));
            setSelectedArtists(selectedArtists.filter(a => a.id !== id));
        } else {
            onChange('');
            setSelectedArtists([]);
        }
    };

    return (
        <div className="space-y-1 relative" ref={wrapperRef}>
            <label className="text-xs font-bold text-gray-500 uppercase">{label} {required && '*'}</label>
            
            {/* Selected Tags */}
            {selectedArtists.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedArtists.map(artist => (
                        <div key={artist.id} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md text-sm border border-blue-200 dark:border-blue-800">
                            <span className="truncate max-w-[150px]">{artist.name}</span>
                            <button type="button" onClick={(e) => handleRemove(artist.id, e)} className="hover:text-red-500 transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Field */}
            {(!selectedArtists.length || isMulti) && (
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                    {isLoading && <Loader2 size={16} className="absolute right-3 top-3 animate-spin text-gray-400" />}
                </div>
            )}

            {/* Dropdown Results */}
            {isOpen && searchTerm.trim() && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {results.length === 0 && !isLoading ? (
                        <div className="p-3 text-sm text-gray-500 text-center">Không tìm thấy nghệ sĩ nào</div>
                    ) : (
                        results.map(artist => (
                            <div 
                                key={artist.id} 
                                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-3 transition-colors"
                                onClick={() => handleSelect(artist)}
                            >
                                <img src={artist.avatarUrl || 'https://via.placeholder.com/32'} alt={artist.name} className="w-8 h-8 rounded-full object-cover" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{artist.name}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AsyncArtistSelect;
