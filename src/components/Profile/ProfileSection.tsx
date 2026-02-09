import CardItem from "../common/CardItem";

export interface SectionItem {
    id: string;
    title: string;
    subTitle: string;
    imageUrl: string;
    rounded?: boolean;
    onClick?: () => void;
    type?: string; 
}

interface ProfileSectionProps {
    title?: string;
    subTitle?: string;
    items: SectionItem[];
    onShowAll?: () => void;
    className?: string;
}

const ProfileSection = ({ title, subTitle, items, onShowAll, className = "mb-8" }: ProfileSectionProps) => {
    if (!items || items.length === 0) return null;
    const isScrollable = items.length > 2;

    return (
        <section className={className}>
            {/* Header */}
            {title && (
                <div className="flex justify-between items-end mb-4 px-0">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white
                                        hover:underline cursor-pointer tracking-tight">
                            {title}
                        </h2>
                        {subTitle && <p className="text-sm text-gray-500 dark:text-[#b3b3b3] mt-1">{subTitle}</p>}
                    </div>

                    {onShowAll && (
                        <button 
                            onClick={onShowAll}
                            className="text-xs font-bold text-gray-500 hover:text-black
                                    dark:text-[#b3b3b3] dark:hover:text-white uppercase
                                    tracking-widest transition"
                        >
                            Show all
                        </button>
                    )}
                </div>
            )}

            {/* Container */}
            <div className={
                isScrollable 
                ? `flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 
                   -mx-2 px-6 md:mx-0 md:px-0
                   no-scrollbar md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-6 md:pb-0`
                
                : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            }>
                {items.map((item) => (
                    <div 
                        key={item.id} 
                        className={isScrollable ? 'flex-shrink-0 w-[40vw] min-w-[150px] md:w-auto snap-start' : 'w-auto'}
                    >
                        {/* Image */}
                        <CardItem 
                            title={item.title}
                            description={item.subTitle} // Map props: subTitle -> description
                            imageUrl={item.imageUrl}
                            isRound={item.rounded}      // Map props: rounded -> isRound
                            onClick={item.onClick}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProfileSection;