// src/components/Account/AccountPage.tsx
import Footer from '../HomePage/Footer';
import ProfileCard from './ProfileCard';
import PlanCard from './PlanCard';
import SecurityCard from './SecurityCard';
import BackButton from '../../components/common/BackButton';


const AccountPage = () => {
    return (
        <div>
            <div className="p-4 md:p-10 pb-32 max-w-5xl mx-auto text-zinc-900 dark:text-white">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    {/* Nút Back: Chỉ hiện ở Mobile (md:hidden) */}
                    <div className="md:hidden">
                        <BackButton className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
                    </div>

                    {/* Tiêu đề */}
                    <h1 className="text-3xl font-bold">Tài khoản</h1>
                </div>
                {/* <p className="text-zinc-500 mb-8">Quản lý hồ sơ cá nhân và gói dịch vụ của bạn</p> */}

                <div className="space-y-6">
                    {/* Hàng 1: Profile (Full width) */}
                    <ProfileCard />

                    {/* Hàng 2: Grid 2 cột (Plan & Security) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PlanCard />
                        <SecurityCard />
                    </div>

                    {/* Hàng 3: Danger Zone */}
                    <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-red-500 font-bold mb-2">Vùng nguy hiểm</h3>
                        <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">Xóa tài khoản vĩnh viễn</p>
                                <p className="text-sm text-zinc-500">Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị mất.</p>
                            </div>
                            <button className="px-4 py-2 bg-white dark:bg-zinc-900 text-red-500 font-bold text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AccountPage;