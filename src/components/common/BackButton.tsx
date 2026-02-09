import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    label?: string; // Cho phép tùy biến chữ đi kèm (vd: "Quay lại")
    className?: string;
}

const BackButton = ({ label, className = "" }: BackButtonProps) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)} // -1 nghĩa là lùi lại 1 bước trong lịch sử trình duyệt
            className={`flex items-center gap-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all group ${className}`}
        >
            <div className="p-1 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-zinc-800">
                <ChevronLeft size={24} />
            </div>
            {label && <span className="text-sm font-medium">{label}</span>}
        </button>
    );
};

export default BackButton;