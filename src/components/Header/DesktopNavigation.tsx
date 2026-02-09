// components/Header/DesktopNavigation.tsx
import SearchInput from './SearchInput';

interface DesktopNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const DesktopNavigation = ({ activeTab, onTabChange }: DesktopNavProps) => {
    return (
        <div className="hidden md:flex items-center gap-3">            
            {/* Truyền onTabChange xuống SearchInput để xử lý chuyển tab tự động */}
            {/* <SearchInput onTabChange={onTabChange} activeTab={activeTab} /> */}
            <SearchInput onTabChange={onTabChange} activeTab={activeTab}/>
        </div>
    );
};

export default DesktopNavigation;