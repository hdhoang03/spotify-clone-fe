export interface Message {
    role: 'user' | 'model';
    text: string;
}

export interface SongInfo {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl: string;
}
