import { motion } from 'framer-motion';

interface CategoryCardProps {
    title: string;
    /** Tailwind bg class e.g. 'bg-purple-600' */
    color: string;
    /** Hex color for glow effect */
    hex?: string;
    onClick?: () => void;
    index?: number;
    coverUrl?: string;
}

const CategoryCard = ({ title, color, hex, onClick, index = 0, coverUrl }: CategoryCardProps) => {
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.045 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`${color} group relative overflow-hidden rounded-xl
                aspect-[16/9] sm:aspect-square cursor-pointer p-4
                shadow-md hover:shadow-2xl transition-shadow duration-300`}
            style={hex ? { boxShadow: `0 4px 24px -6px ${hex}55` } : undefined}
        >
            {/* Category name */}
            <h3 className="text-xl md:text-2xl font-black text-white break-words max-w-[70%]
                leading-tight z-10 relative drop-shadow-sm tracking-tight">
                {title}
            </h3>

            {/* Optional cover image (tilted) */}
            {coverUrl ? (
                <img
                    src={coverUrl}
                    alt={title}
                    className="absolute -bottom-3 -right-4 w-20 h-20 sm:w-24 sm:h-24
                        object-cover rotate-[20deg] rounded-lg shadow-2xl
                        transition-transform duration-500 ease-out
                        group-hover:rotate-[25deg] group-hover:scale-110 group-hover:-translate-y-1"
                    loading="lazy"
                />
            ) : (
                /* Decorative shape fallback */
                <>
                    <div className="absolute -bottom-3 -right-5 w-20 h-20 sm:w-24 sm:h-24 bg-black/20
                        rotate-[22deg] rounded-xl shadow-xl
                        transition-transform duration-500 ease-out
                        group-hover:rotate-[28deg] group-hover:scale-110 group-hover:-translate-y-1" />
                    <div className="absolute -bottom-6 -right-2 w-14 h-14 sm:w-16 sm:h-16 bg-white/10
                        rotate-[10deg] rounded-lg
                        transition-transform duration-500 ease-out group-hover:rotate-[16deg]" />
                </>
            )}

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </motion.div>
    );
};

export default CategoryCard;