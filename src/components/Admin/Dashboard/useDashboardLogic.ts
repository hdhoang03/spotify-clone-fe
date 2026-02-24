// src/components/Admin/Dashboard/useDashboardLogic.ts
import { useState, useEffect } from 'react';
import {
    MOCK_DASHBOARD_OVERVIEW,
    MOCK_USER_GROWTH,
    MOCK_TOP_STREAM_SONGS,
    MOCK_GENRE_DISTRIBUTION,
    getStreamDataForYear,
    getStreamDataForMonth,
    getStreamDataForWeek
} from '../../../constants/mockData';

export type TimeRangeType = 'week' | 'month' | 'year';

export const useDashboardLogic = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Static Data
    const stats = MOCK_DASHBOARD_OVERVIEW;
    const userGrowthData = MOCK_USER_GROWTH;
    const topSongs = MOCK_TOP_STREAM_SONGS;
    const genreData = MOCK_GENRE_DISTRIBUTION;

    // --- CHART LOGIC ---
    const [streamData, setStreamData] = useState<any[]>([]);

    // State quản lý bộ lọc
    const [timeRange, setTimeRange] = useState<TimeRangeType>('week');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        const loadChartData = async () => {
            // Giả lập loading nhẹ cho mượt
            // setIsLoading(true); 

            let data = [];
            if (timeRange === 'year') {
                // Xem các tháng trong năm
                data = getStreamDataForYear(selectedYear);
            } else if (timeRange === 'month') {
                // Xem các tuần trong tháng
                data = getStreamDataForMonth(selectedYear, selectedMonth);
            } else {
                // Xem 7 ngày qua
                data = getStreamDataForWeek();
            }

            setStreamData(data);
            setIsLoading(false);
        };

        loadChartData();
    }, [timeRange, selectedYear, selectedMonth]);

    return {
        isLoading,
        stats,
        streamData,
        genreData,
        userGrowthData,
        topSongs,

        // Filter States & Setters
        timeRange, setTimeRange,
        selectedYear, setSelectedYear,
        selectedMonth, setSelectedMonth
    };
};