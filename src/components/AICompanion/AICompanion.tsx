import React, { useState, useEffect } from 'react';
import { useMusic } from '../../contexts/MusicContent';
import { useSystemSongs } from './useSystemSongs';
import { ChatFAB } from './ChatFAB';
import { ChatDrawer } from './ChatDrawer';
import type { Message } from './types';
import { i18n } from './i18n';
import type { ChatLanguage } from './i18n'

export const AICompanion: React.FC = () => {
    const { currentSong, playSong, setIsFullScreenPlayerOpen } = useMusic();
    const { systemSongs, likedSongs } = useSystemSongs();

    const [language, setLanguage] = useState<ChatLanguage>(() => {
        return (localStorage.getItem('gemini_chat_lang') as ChatLanguage) || 'vi';
    });

    const [isOpen, setIsOpen] = useState(false);
    const [apiKey, setApiKey] = useState<string>(() => {
        return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
    });

    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = sessionStorage.getItem('gemini_chat_history');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) { }
        }
        const initialLang = (localStorage.getItem('gemini_chat_lang') as ChatLanguage) || 'vi';
        return [
            {
                role: 'model',
                text: i18n[initialLang].welcome
            }
        ];
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        sessionStorage.setItem('gemini_chat_history', JSON.stringify(messages));
    }, [messages]);

    const handleSaveKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
        setErrorMsg(null);
    };

    const handleClearChat = () => {
        setMessages([
            {
                role: 'model',
                text: i18n[language].clearChat
            }
        ]);
    };

    const handleLanguageChange = (lang: ChatLanguage) => {
        setLanguage(lang);
        localStorage.setItem('gemini_chat_lang', lang);
    };

    const handleSend = async (textToSend?: string) => {
        if (!textToSend) return;

        const newMessages: Message[] = [...messages, { role: 'user', text: textToSend }];
        setMessages(newMessages);
        setIsLoading(true);
        setErrorMsg(null);

        if (!apiKey) {
            setIsLoading(false);
            setErrorMsg(i18n[language].errorKey);
            return;
        }

        try {
            // Build the system instruction context with current playing song and the available songs list
            let systemInstruction =
                `${i18n[language].systemInstruction}\n` +
                `Không dùng quá nhiều icon hay định dạng rườm rà. Hãy trả lời ngắn gọn (khoảng 3-4 câu) và tự nhiên nhất có thể.\n\n`;

            if (currentSong) {
                systemInstruction += `[Ngữ cảnh]: Bạn ấy đang nghe bài "${currentSong.title}" của "${currentSong.artist}". Nếu hỏi "bài này", "bài hát này", tự động hiểu là bài đang nghe.\n\n`;
            }

            if (likedSongs && likedSongs.length > 0) {
                const likedContext = likedSongs.join(', ');
                systemInstruction += `[Ngữ cảnh Sở thích]: Người dùng yêu thích các bài hát sau: ${likedContext}. Hãy ưu tiên gợi ý các bài hát có phong cách, thể loại tương đồng nếu được yêu cầu.\n\n`;
            }

            if (systemSongs.length > 0) {
                const songsContext = systemSongs.map(s => {
                    const featured = s.featuredArtists && s.featuredArtists.length > 0
                        ? ` ft. ${s.featuredArtists.map((fa: any) => fa.name || fa).join(', ')}`
                        : '';
                    const lyricsInfo = s.lyrics ? ` | Lời bài hát: ${s.lyrics.substring(0, 500).replace(/\n/g, ' ')}...` : '';
                    return `- ID: ${s.id} | "${s.title}" (bởi ${s.artist}${featured})${lyricsInfo}`;
                }).join('\n');
                systemInstruction += `[Danh sách nhạc hệ thống]: Dưới đây là các bài hát CÓ SẴN trong Springtunes. KHI NGƯỜI DÙNG YÊU CẦU GỢI Ý HOẶC TÌM NHẠC, hãy CHỈ CHỌN từ danh sách này và ĐỪNG giới thiệu bài hát bên ngoài:\n${songsContext}\n\n`;
                systemInstruction += `[QUAN TRỌNG - TƯƠNG TÁC HỆ THỐNG]: Nếu người dùng yêu cầu "mở bài", "bật bài", "phát bài", "nghe bài", hãy tìm ID bài hát phù hợp trong danh sách trên và TRẢ VỀ CHÍNH XÁC chuỗi [PLAY_SONG:id_bài_hát] ở cuối câu trả lời của bạn. Trợ lý hãy xác nhận việc bật nhạc và chèn thẻ đó vào. Ví dụ: "Mình bật bài hát này cho bạn nhé! [PLAY_SONG:12345]"\n\n`;
            }

            const formattedContents = newMessages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: formattedContents,
                        systemInstruction: { parts: [{ text: systemInstruction }] }
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Lỗi kết nối Gemini API');
            }

            let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Mình không nghe rõ, bạn nói lại được không?';

            // Xử lý tự động phát nhạc nếu có tag [PLAY_SONG:id]
            const playSongMatch = replyText.match(/\[PLAY_SONG:(.+?)\]/);
            if (playSongMatch) {
                const songId = playSongMatch[1].trim();
                const songToPlay = systemSongs.find(s => s.id === songId);
                if (songToPlay && songToPlay.audioUrl) {
                    playSong(songToPlay as any);
                    // Tự động mở FullScreenPlayer để trải nghiệm tốt hơn
                    setIsFullScreenPlayerOpen(true);
                }
                // Xoá tag ẩn khỏi giao diện
                replyText = replyText.replace(/\[PLAY_SONG:(.+?)\]/g, '').trim();
            }

            setMessages(prev => [...prev, { role: 'model', text: replyText }]);

        } catch (error: any) {
            console.error('Error calling Gemini API:', error);
            let userFriendlyError = i18n[language].errorNetwork;
            if (error.message?.includes('API_KEY_INVALID')) {
                userFriendlyError = i18n[language].errorInvalidKey;
            } else if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
                userFriendlyError = i18n[language].errorQuota;
            }
            setErrorMsg(userFriendlyError);
            setMessages(prev => [...prev, { role: 'model', text: `❌ ${userFriendlyError}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerQuickAction = (actionType: 'explain' | 'translate' | 'recommend' | 'chat' | 'recommend_taste') => {
        if (!currentSong && actionType !== 'chat' && actionType !== 'recommend_taste') return;

        let promptText = '';
        const title = currentSong?.title || '';
        switch (actionType) {
            case 'explain':
                promptText = i18n[language].promptExplain.replace('$TITLE', title);
                break;
            case 'translate':
                promptText = i18n[language].promptTranslate.replace('$TITLE', title);
                break;
            case 'recommend':
                promptText = i18n[language].promptRecommend;
                break;
            case 'recommend_taste':
                promptText = i18n[language].promptTaste;
                break;
            case 'chat':
                promptText = i18n[language].promptChat;
                break;
        }
        handleSend(promptText);
    };

    return (
        <>
            <ChatFAB isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

            <ChatDrawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                apiKey={apiKey}
                onSaveKey={handleSaveKey}
                messages={messages}
                onClearChat={handleClearChat}
                onSendMessage={handleSend}
                isLoading={isLoading}
                errorMsg={errorMsg}
                currentSong={currentSong}
                triggerQuickAction={triggerQuickAction}
                language={language}
                onLanguageChange={handleLanguageChange}
            />
        </>
    );
};
