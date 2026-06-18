import React, { useState, useEffect } from 'react';
import { X, Mic2, Save, Loader2, Info } from 'lucide-react';
import api from '../../../services/api';

interface LyricLine {
    t: number;
    text: string;
}

interface LyricsModalProps {
    isOpen: boolean;
    onClose: () => void;
    songId: string | null;
    songTitle: string;
}

const LyricsModal = ({ isOpen, onClose, songId, songTitle }: LyricsModalProps) => {
    const [lrcText, setLrcText] = useState('');
    const [isInstrumental, setIsInstrumental] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const parseJSONToLRC = (lines: LyricLine[]) => {
        if (!lines || lines.length === 0) return '';
        return lines.map(line => {
            const minutes = Math.floor(line.t / 60).toString().padStart(2, '0');
            const seconds = (line.t % 60).toFixed(2).padStart(5, '0');
            return `[${minutes}:${seconds}] ${line.text}`;
        }).join('\n');
    };

    const parseLRCToJSON = (text: string): LyricLine[] => {
        const lines = text.split('\n');
        const lyricsData: LyricLine[] = [];
        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

        lines.forEach(line => {
            const match = timeRegex.exec(line);
            if (match) {
                const min = parseInt(match[1], 10);
                const sec = parseInt(match[2], 10);
                const ms = parseInt(match[3], 10);
                const timeInSeconds = min * 60 + sec + ms / (match[3].length === 2 ? 100 : 1000);
                const lyricText = line.replace(timeRegex, '').trim();
                lyricsData.push({ t: timeInSeconds, text: lyricText });
            }
        });
        return lyricsData.sort((a, b) => a.t - b.t);
    };

    useEffect(() => {
        if (!isOpen || !songId) {
            setLrcText('');
            setIsInstrumental(false);
            return;
        }

        const fetchLyrics = async () => {
            setIsLoading(true);
            try {
                // Đã sửa lại endpoint khớp với Controller: /lyrics/{songId}/get
                const res = await api.get(`/lyrics/${songId}/get`);
                if (res.data.result) {
                    // Xử lý trường hợp backend trả về isInstrumental hoặc instrumental do Jackson parse
                    const isInst = res.data.result.isInstrumental || res.data.result.instrumental || false;
                    setIsInstrumental(isInst);
                    setLrcText(parseJSONToLRC(res.data.result.content || []));
                }
            } catch (error) {
                console.log("Bài hát chưa có lời hoặc lỗi fetch");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLyrics();
    }, [isOpen, songId]);

    const handleSave = async () => {
        if (!songId) return;
        setIsSaving(true);
        try {
            const payload = {
                isInstrumental,
                content: isInstrumental ? [] : parseLRCToJSON(lrcText)
            };
            // Đã sửa lại endpoint khớp với Controller: /lyrics/{songId}
            await api.post(`/lyrics/${songId}`, payload);
            alert("Đã lưu lời bài hát thành công!");
            onClose();
        } catch (error) {
            console.error("Lỗi khi lưu lyrics:", error);
            alert("Có lỗi xảy ra khi lưu lời bài hát.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />
            <div className="relative z-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh]">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-800/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Mic2 size={20} className="text-purple-500" />
                            Quản lý lời bài hát
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Bài hát: <span className="font-semibold text-purple-600 dark:text-purple-400">{songTitle}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition"><X size={20} /></button>
                </div>

                <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                        <input
                            type="checkbox"
                            checked={isInstrumental}
                            onChange={(e) => setIsInstrumental(e.target.checked)}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">Đây là nhạc không lời (Instrumental)</span>
                    </label>

                    {!isInstrumental && (
                        <div className="flex-1 flex flex-col min-h-[400px]">
                            <div className="flex items-center gap-2 mb-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                <Info size={16} />
                                <span>Paste nội dung file LRC vào đây. Cú pháp chuẩn: <b>[mm:ss.xx] Lời hát</b></span>
                            </div>

                            {isLoading ? (
                                <div className="flex-1 flex items-center justify-center border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900/50">
                                    <Loader2 className="animate-spin text-purple-500" size={30} />
                                </div>
                            ) : (
                                <textarea
                                    value={lrcText}
                                    onChange={(e) => setLrcText(e.target.value)}
                                    placeholder="[00:00.00] Lời bài hát bắt đầu..."
                                    className="flex-1 w-full p-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none font-mono resize-none leading-relaxed"
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3 bg-gray-50/50 dark:bg-zinc-800/50">
                    <button onClick={onClose} className="px-4 py-2 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition">Đóng</button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition flex items-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Lưu Lời Bài Hát
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LyricsModal;