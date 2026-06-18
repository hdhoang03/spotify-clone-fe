// src/components/Account/Account.tsx
import Footer from '../HomePage/Footer';
import ProfileCard from './components/ProfileCard';
import PlanCard from './components/PlanCard';
import SecurityCard from './components/SecurityCard';
import BackButton from '../../components/common/BackButton';
import { useTranslation } from 'react-i18next';

const AccountPage = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full min-h-screen flex flex-col bg-transparent">
            <div className="flex-1 p-4 md:p-10 pb-32 max-w-5xl mx-auto w-full text-zinc-900 dark:text-white selection:bg-green-500/30">
                <div className="flex items-center gap-4 mb-10 md:mb-12">
                    {/* Nút Back: Chỉ hiện ở Mobile (md:hidden) */}
                    <div>
                        <BackButton className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
                    </div>

                    {/* Tiêu đề */}
                    <h1 className="text-3xl font-bold">{t('account.title')}</h1>
                </div>

                <div className="space-y-8">
                    {/* Hàng 1: Profile (Full width) */}
                    <ProfileCard />

                    {/* Hàng 2: Grid 2 cột (Plan & Security) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PlanCard />
                        <SecurityCard />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AccountPage;