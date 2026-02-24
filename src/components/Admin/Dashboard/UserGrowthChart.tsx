import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const UserGrowthChart = ({ data }: { data: any[] }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Người dùng mới</h3>
            <p className="text-sm text-gray-500 mb-6">Tăng trưởng 6 tháng gần nhất</p>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                        <XAxis dataKey="month" hide />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};