import { useState, useEffect } from 'react';
import api from '../../../services/api';
import type { SearchResponseData } from '../types/search.types';

// Debounce delay (ms) before sending API request
const DEBOUNCE_DELAY = 600;

export const useSearchApi = (keyword: string) => {
    const [data, setData] = useState<SearchResponseData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!keyword.trim()) {
            setData(null);
            setIsLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
                if (response.data.code === 1000) {
                    setData(response.data.result);
                }
            } catch (err) {
                console.error('[Search] API error:', err);
                setError('search_error');
            } finally {
                setIsLoading(false);
            }
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [keyword]);

    return { data, isLoading, error };
};
