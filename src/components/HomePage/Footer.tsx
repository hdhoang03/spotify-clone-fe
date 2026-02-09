import { Copyright } from 'lucide-react';
import { ICONS } from '../../constants/icons';

// Style chung cho Link để dễ sửa sau này
const LINK_STYLE = "text-zinc-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-white hover:underline text-sm transition-colors cursor-pointer";

const FooterColumn = ({ title, links }: { title: string, links: string[] }) => (
    <div className="flex flex-col gap-3">
        <h4 className="font-bold text-zinc-900 dark:text-white text-base">
            {title}
        </h4>
        <div className="flex flex-col gap-2">
            {links.map((link, index) => (
                <a key={index} href="#" className={LINK_STYLE}>
                    {link}
                </a>
            ))}
        </div>
    </div>
);

const SocialIcon = ({ path }: { path: string }) => (
    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    bg-zinc-200 dark:bg-zinc-800 
                    hover:bg-zinc-300 dark:hover:bg-zinc-700 group cursor-pointer">
        <svg viewBox="0 0 24 24" fill="currentColor"
            className="w-5 h-5 text-zinc-900 dark:text-white transition-transform group-hover:scale-110">
            <path d={path} />
        </svg>
    </div>
);

const Footer = () => {
    return (
        <footer className="mt-20 pt-10 pb-20 border-t transition-colors duration-300
                        bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 p-6">

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 mb-12 px-6">
                <FooterColumn title="Công ty" links={['Giới thiệu', 'Việc làm', 'For the Record']} />
                <FooterColumn title="Cộng đồng" links={['Dành cho Nghệ sĩ', 'Nhà phát triển', 'Quảng cáo', 'Nhà đầu tư', 'Nhà cung cấp']} />
                <FooterColumn title="Liên kết hữu ích" links={['Hỗ trợ', 'Trình phát Web miễn phí', 'Sách nói']} />

                {/* Social Icons - Move to separate column or span */}
                <div className="col-span-2 md:col-span-1 lg:col-span-2 flex justify-start md:justify-end gap-4">
                    <a href="http://www.instagram.com/hoang.ho3/" target="_blank" rel="noreferrer">
                        <SocialIcon path={ICONS.instagram} />
                    </a>

                    <a href="http://www.facebook.com/thotslayer213" target="_blank" rel="noreferrer">
                        <SocialIcon path={ICONS.facebook} />
                    </a>

                    <a href="https://www.reddit.com/user/Hide_on_bush003/" target="_blank" rel="noreferrer">
                        <SocialIcon path={ICONS.reddit} />
                    </a>
                </div>
            </div>

            <div className="px-6"><hr className="mb-8 border-zinc-200 dark:border-zinc-800" /></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs px-6 pb-8
                            text-zinc-500 dark:text-zinc-400">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {['Pháp lý', 'Trung tâm bảo mật', 'Quyền riêng tư', 'Cookie', 'Quảng cáo'].map(item => (
                        <a key={item} href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{item}</a>
                    ))}
                </div>
                <div className="flex items-center gap-1 opacity-80">
                    <Copyright size={14} />
                    <span>2025 SpringTunes with ❤️</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;