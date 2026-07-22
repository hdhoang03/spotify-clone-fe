import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const UserGrowthChart = ({ data }: { data: any[] }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Người dùng mới</h3>
            <p className="text-sm text-gray-500 mb-6">Tăng trưởng trong năm</p>

            <div className="flex-1 min-h-[200px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        {/* Lưới ngang mờ giúp dóng hàng dễ hơn */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.2} />

                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#888' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#888' }}
                        />

                        {/* Tooltip đen mượt mà khi hover */}
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                            cursor={{ stroke: '#888', strokeWidth: 1, strokeDasharray: '5 5' }} // Cột gióng dọc khi hover
                        />

                        {/* Đường cong Line */}
                        <Line
                            type="monotone" // Làm mềm đường gấp khúc
                            dataKey="users"
                            stroke="#3b82f6" // Màu xanh dương đậm
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} // Chấm tại mỗi tháng
                            activeDot={{ r: 7, strokeWidth: 0, fill: '#22c55e' }} // Chấm to lên, đổi màu xanh lá khi di chuột vào
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};