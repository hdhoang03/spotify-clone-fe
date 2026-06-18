/**
 * EqualizerBars
 * Animated 3-bar equalizer icon (like Spotify / YouTube Music)
 * Hiện khi bài hát đang phát, ẩn khi hover để nhường chỗ cho nút Pause.
 */

const EQUALIZER_STYLE_ID = 'equalizer-bars-style';

if (typeof document !== 'undefined' && !document.getElementById(EQUALIZER_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = EQUALIZER_STYLE_ID;
    style.textContent = `
        @keyframes eq-bar1 { 0%,100%{height:3px} 25%{height:12px} 50%{height:5px} 75%{height:10px} }
        @keyframes eq-bar2 { 0%,100%{height:10px} 25%{height:4px} 50%{height:14px} 75%{height:6px} }
        @keyframes eq-bar3 { 0%,100%{height:6px} 25%{height:14px} 50%{height:3px} 75%{height:12px} }
        .eq-bar1 { animation: eq-bar1 1s ease-in-out infinite; }
        .eq-bar2 { animation: eq-bar2 1.1s ease-in-out infinite 0.15s; }
        .eq-bar3 { animation: eq-bar3 0.9s ease-in-out infinite 0.3s; }
    `;
    document.head.appendChild(style);
}

const EqualizerBars = () => (
    <div className="flex items-end justify-center gap-[2px] h-4 w-4">
        <div className="eq-bar1 w-[3px] bg-green-500 rounded-sm" />
        <div className="eq-bar2 w-[3px] bg-green-500 rounded-sm" />
        <div className="eq-bar3 w-[3px] bg-green-500 rounded-sm" />
    </div>
);

export default EqualizerBars;
