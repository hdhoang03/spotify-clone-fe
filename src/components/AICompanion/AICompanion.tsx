import React, { useState, useEffect } from 'react';
import { useMusic } from '../../contexts/MusicContent';
import { useSystemSongs } from './useSystemSongs';
import { ChatFAB } from './ChatFAB';
import { ChatDrawer } from './ChatDrawer';
import type { Message } from './types';

export const AICompanion: React.FC = () => {
    const { currentSong, playSong, setIsFullScreenPlayerOpen } = useMusic();
    const { systemSongs, likedSongs } = useSystemSongs();

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
        return [
            {
                role: 'model',
                text: 'Chào bạn! Mình là Springtunes AI đây. Mình có thể dịch lời, kể chuyện về nghệ sĩ, hoặc tìm cho bạn một giai điệu hợp mood hôm nay. Bạn muốn nghe gì nè?'
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
                text: 'Đã xóa lịch sử trò chuyện nha. Tụi mình bắt đầu lại nhé, bạn muốn nghe nhạc gì nào?'
            }
        ]);
    };

    const handleSend = async (textToSend?: string) => {
        if (!textToSend) return;

        const newMessages: Message[] = [...messages, { role: 'user', text: textToSend }];
        setMessages(newMessages);
        setIsLoading(true);
        setErrorMsg(null);

        if (!apiKey) {
            setIsLoading(false);
            setErrorMsg('Vui lòng cấu hình API Key để tiếp tục trò chuyện.');
            return;
        }

        try {
            // Build the system instruction context with current playing song and the available songs list
            let systemInstruction =
                `Bạn là Springtunes AI, một người bạn đồng hành nghe nhạc thân thiện, hiểu biết, trò chuyện tự nhiên như một người bạn có thể hơi GenZ hòa nhập người chat (xưng hô là "mình" và "bạn", hoặc "AI" tuỳ lúc). ` +
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
            let userFriendlyError = 'Xin lỗi, kết nối với máy chủ hơi chập chờn. Bạn thử lại sau nhé.';
            if (error.message?.includes('API_KEY_INVALID')) {
                userFriendlyError = 'Hình như API Key không đúng rồi. Bạn kiểm tra lại cài đặt nhé.';
            } else if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
                userFriendlyError = 'AI đang bị quá tải xíu (hết lượt gọi miễn phí trong phút này). Bạn đợi khoảng 1 phút rồi hỏi lại mình nha! ⏳';
            }
            setErrorMsg(userFriendlyError);
            setMessages(prev => [...prev, { role: 'model', text: `❌ Lỗi: ${userFriendlyError}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerQuickAction = (actionType: 'explain' | 'translate' | 'recommend' | 'chat' | 'recommend_taste') => {
        if (!currentSong && actionType !== 'chat' && actionType !== 'recommend_taste') return;

        let promptText = '';
        switch (actionType) {
            case 'explain':
                promptText = `Giải thích ngắn gọn ý nghĩa của bài hát "${currentSong?.title}" giúp mình với.`;
                break;
            case 'translate':
                promptText = `Bạn có thể dịch bài "${currentSong?.title}" sang tiếng Việt giúp mình được không?`;
                break;
            case 'recommend':
                promptText = `Có bài hát nào có sẵn trong hệ thống mang phong cách giống bài này không? Gợi ý cho mình vài bài nhé.`;
                break;
            case 'recommend_taste':
                promptText = `Gợi ý nhạc dựa theo gu của mình nhé! (Dựa vào những bài hát mình đã thích)`;
                break;
            case 'chat':
                promptText = `Gợi ý cho mình một bài hát vui tươi trong hệ thống để nghe ngay lúc này đi!`;
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
            />
        </>
    );
};
