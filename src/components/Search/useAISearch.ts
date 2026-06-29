import { useState, useCallback } from 'react';

export const useAISearch = () => {
    const [isAISearching, setIsAISearching] = useState(false);
    const [aiSearchResults, setAiSearchResults] = useState<string[]>([]);
    const [aiSearchError, setAiSearchError] = useState<string | null>(null);

    const performAISearch = useCallback(async (query: string, systemSongs: any[]) => {
        if (!query.trim() || systemSongs.length === 0) return;
        
        setIsAISearching(true);
        setAiSearchError(null);
        setAiSearchResults([]);

        const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
        if (!apiKey) {
            setAiSearchError('Vui lòng cấu hình API Key để sử dụng AI Search.');
            setIsAISearching(false);
            return;
        }

        try {
            const songsContext = systemSongs.map(s => {
                const featured = s.featuredArtists && s.featuredArtists.length > 0 
                    ? ` ft. ${s.featuredArtists.map((fa: any) => fa.name || fa).join(', ')}` 
                    : '';
                const lyricsInfo = s.lyrics ? ` | Lời bài hát: ${s.lyrics.substring(0, 500).replace(/\n/g, ' ')}...` : '';
                return `- ID: ${s.id} | "${s.title}" (bởi ${s.artist}${featured})${lyricsInfo}`;
            }).join('\n');
            const systemInstruction = 
                `Bạn là máy chủ tìm kiếm âm nhạc thông minh. Dưới đây là danh sách các bài hát có sẵn:\n${songsContext}\n\n` +
                `Nhiệm vụ của bạn là đọc yêu cầu tìm kiếm của người dùng và lọc ra CÁC ID BÀI HÁT phù hợp nhất với yêu cầu đó.\n` +
                `CHỈ TRẢ VỀ một mảng chuỗi (array of strings) chứa ID các bài hát bằng định dạng JSON. KHÔNG giải thích, KHÔNG markdown. Ví dụ: ["123", "456"]`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: query }] }],
                        systemInstruction: { parts: [{ text: systemInstruction }] },
                        generationConfig: {
                            responseMimeType: "application/json",
                        }
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Lỗi kết nối Gemini API');
            }

            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) {
                try {
                    const parsedIds = JSON.parse(replyText);
                    if (Array.isArray(parsedIds)) {
                        setAiSearchResults(parsedIds.map(String));
                    } else {
                        setAiSearchResults([]);
                    }
                } catch (e) {
                    console.error("AI Search JSON parse error:", e);
                    setAiSearchResults([]);
                }
            } else {
                setAiSearchResults([]);
            }

        } catch (error: any) {
            console.error('Error calling Gemini API for Search:', error);
            setAiSearchError('Lỗi kết nối AI. Vui lòng thử lại sau.');
        } finally {
            setIsAISearching(false);
        }
    }, []);

    const clearAISearch = useCallback(() => {
        setAiSearchResults([]);
        setAiSearchError(null);
    }, []);

    return { performAISearch, isAISearching, aiSearchResults, aiSearchError, clearAISearch };
};
