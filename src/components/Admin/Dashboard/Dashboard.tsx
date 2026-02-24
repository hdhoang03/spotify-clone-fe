// src/components/Admin/Dashboard/Dashboard.tsx
import { useDashboardLogic } from './useDashboardLogic';
import { StatsOverview } from './StatsOverview';
import { StreamChart } from './StreamChart';
import { UserGrowthChart } from './UserGrowthChart';
import { TopSongsTable } from './TopSongsTable';
import { GenrePieChart } from './GenrePieChart'; // Import mới

const Dashboard = () => {
    const {
        stats, streamData, genreData, userGrowthData, topSongs,
        timeRange, setTimeRange,
        selectedYear, setSelectedYear,
        selectedMonth, setSelectedMonth
    } = useDashboardLogic();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* 1. Stats Cards */}
            <StatsOverview data={stats} />

            {/* 2. Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- CỘT TRÁI (2/3) --- */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Biểu đồ lượt nghe (Có filter) */}
                    <div>
                        <StreamChart
                            data={streamData}
                            timeRange={timeRange} setTimeRange={setTimeRange}
                            year={selectedYear} setYear={setSelectedYear}
                            month={selectedMonth} setMonth={setSelectedMonth}
                        />
                    </div>

                    {/* Hàng dưới: PieChart + Tip (Chia đôi) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GenrePieChart data={genreData} />

                        {/* Thẻ phụ (Tip hoặc Hoạt động) */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">Thống kê nhanh</h3>
                            <p className="opacity-90 text-sm mb-4 leading-relaxed">
                                Lượt nghe tháng này tăng trưởng <strong>12%</strong> so với tháng trước.
                                Thể loại <strong>Pop</strong> vẫn chiếm ưu thế lớn nhất.
                            </p>
                            <button className="bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg text-sm font-bold w-fit transition">
                                Xuất báo cáo PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI (1/3) --- */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1">
                        <UserGrowthChart data={userGrowthData} />
                    </div>
                    <div className="flex-1">
                        <TopSongsTable data={topSongs} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;