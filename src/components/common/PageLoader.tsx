import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
    /** Size của spinner, default 40 */
    size?: number;
}

/**
 * PageLoader
 * Fullscreen loading spinner dùng chung.
 * Dùng khi đang fetch dữ liệu chính của trang.
 *
 * @example
 * if (isLoading) return <PageLoader />;
 */
const PageLoader = ({ size = 40 }: PageLoaderProps) => (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#121212]">
        <Loader2 className="animate-spin text-green-500" size={size} />
    </div>
);

export default PageLoader;
