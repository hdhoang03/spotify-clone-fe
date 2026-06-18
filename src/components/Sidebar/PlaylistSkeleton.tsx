/**
 * PlaylistSkeleton
 * Skeleton loading screen cho PlaylistDetailPage.
 * Lazy-imported từ PlaylistDetailPage để giảm initial bundle size.
 * Không có logic, chỉ là UI shimmer thuần CSS.
 */

// ─── Shimmer atom ─────────────────────────────────────────────────────────────
const Shimmer = ({ className }: { className: string }) => (
    <div
        className={`relative overflow-hidden rounded-md bg-zinc-200/60 dark:bg-white/[0.06] ${className}`}
    >
        <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]
                        bg-gradient-to-r from-transparent via-white/25 dark:via-white/[0.06] to-transparent"
        />
    </div>
);

// ─── Hero skeleton ────────────────────────────────────────────────────────────
const HeroSkeleton = () => (
    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8">
        {/* Cover */}
        <Shimmer className="w-56 h-56 md:w-60 md:h-60 rounded-lg shrink-0" />

        {/* Info */}
        <div className="flex flex-col gap-3 w-full">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-14 md:h-20 w-3/4" />
            <Shimmer className="h-4 w-1/2" />
            <div className="flex items-center gap-3 mt-1">
                <Shimmer className="w-6 h-6 rounded-full" />
                <Shimmer className="h-3 w-28" />
                <Shimmer className="h-3 w-20" />
            </div>
        </div>
    </div>
);

// ─── Action bar skeleton ──────────────────────────────────────────────────────
const ActionBarSkeleton = () => (
    <div className="flex items-center gap-4 px-6 md:px-8 py-4">
        <Shimmer className="w-14 h-14 rounded-full" />
        <Shimmer className="w-10 h-10 rounded-full" />
        <Shimmer className="w-10 h-10 rounded-full" />
    </div>
);

// ─── Track row skeleton ────────────────────────────────────────────────────────
const TrackRowSkeleton = ({ opacity = 1 }: { opacity?: number }) => (
    <div
        className="grid grid-cols-[32px_1fr_auto] md:grid-cols-[32px_minmax(120px,4fr)_2fr_minmax(80px,1fr)_40px]
                   gap-3 md:gap-4 px-2 md:px-4 py-3 items-center"
        style={{ opacity }}
    >
        <Shimmer className="w-5 h-3 hidden md:block" />
        <div className="flex items-center gap-3 overflow-hidden">
            <Shimmer className="w-10 h-10 md:w-12 md:h-12 rounded-md shrink-0" />
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                <Shimmer className="h-3.5 w-4/5" />
                <Shimmer className="h-2.5 w-2/5" />
            </div>
        </div>
        <Shimmer className="h-3 w-24 hidden md:block" />
        <Shimmer className="h-3 w-12 justify-self-end" />
        <Shimmer className="w-5 h-5 rounded-full" />
    </div>
);

// ─── TrackList skeleton ───────────────────────────────────────────────────────
const TrackListSkeleton = ({ count = 8 }: { count?: number }) => (
    <div className="px-4 md:px-8">
        {/* Header row */}
        <div className="grid grid-cols-[32px_1fr_auto] md:grid-cols-[32px_minmax(120px,4fr)_2fr_minmax(80px,1fr)_40px]
                        gap-3 md:gap-4 px-2 md:px-4 py-3 border-b border-black/5 dark:border-white/5 mb-3">
            <Shimmer className="h-3 w-4 hidden md:block" />
            <Shimmer className="h-3 w-14" />
            <Shimmer className="h-3 w-14 hidden md:block" />
            <Shimmer className="h-3 w-6 justify-self-end" />
            <div />
        </div>

        <div className="space-y-1">
            {Array.from({ length: count }).map((_, i) => (
                <TrackRowSkeleton
                    key={i}
                    opacity={Math.max(0.25, 1 - i * (0.75 / count))}
                />
            ))}
        </div>
    </div>
);

// ─── Full page skeleton ───────────────────────────────────────────────────────
const PlaylistSkeleton = ({ trackCount = 8 }: { trackCount?: number }) => (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
        <HeroSkeleton />
        <ActionBarSkeleton />
        <TrackListSkeleton count={trackCount} />
    </div>
);

export default PlaylistSkeleton;
