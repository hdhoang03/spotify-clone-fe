// src/components/Admin/Dashboard/StreamChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimeRangeType } from './useDashboardLogic'; // Import type nếu cần

interface StreamChartProps {
    data: any[];
    timeRange: TimeRangeType;
    setTimeRange: (v: TimeRangeType) => void;
    year: number; setYear: (v: number) => void;
    month: number; setMonth: (v: number) => void;
}

export const StreamChart = ({ data, timeRange, setTimeRange, year, setYear, month, setMonth }: StreamChartProps) => {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm h-full flex flex-col">

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {timeRange === 'year' ? `Thống kê năm ${year}`
                        : timeRange === 'month' ? `Thống kê tháng ${month}/${year}`
                            : '7 ngày vừa qua'}
                </h3>

                <div className="flex flex-wrap gap-2">
                    {/* 1. Chọn Chế độ xem */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRangeType)}
                        className="bg-gray-100 dark:bg-zinc-800 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer"
                    >
                        <option value="week">7 Ngày</option>
                        <option value="month">Theo Tháng</option>
                        <option value="year">Theo Năm</option>
                    </select>

                    {/* 2. Chọn Năm (Hiện khi xem Month hoặc Year) */}
                    {timeRange !== 'week' && (
                        <select
                            value={year} onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-gray-50 dark:bg-zinc-800 border-none text-xs rounded-lg px-2 py-2 outline-none cursor-pointer"
                        >
                            <option value={2024}>2024</option>
                            <option value={2025}>2025</option>
                            <option value={2026}>2026</option>
                        </select>
                    )}

                    {/* 3. Chọn Tháng (Chỉ hiện khi xem Month) */}
                    {timeRange === 'month' && (
                        <select
                            value={month} onChange={(e) => setMonth(Number(e.target.value))}
                            className="bg-gray-50 dark:bg-zinc-800 border-none text-xs rounded-lg px-2 py-2 outline-none cursor-pointer"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>Tháng {m}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            stroke="#888"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value / 1000}k`} // Format số liệu (50k)
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: 'transparent' }}
                            labelFormatter={(label, payload) => {
                                // Hiển thị fullDate nếu có trong payload
                                if (payload && payload.length > 0 && payload[0].payload.fullDate) {
                                    return payload[0].payload.fullDate;
                                }
                                return label;
                            }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                            barSize={timeRange === 'year' ? 20 : 40} // Năm nhiều cột thì bar nhỏ lại
                            animationDuration={500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};