// // src/components/Admin/Dashboard/useDashboardLogic.ts
// import { useState, useEffect } from 'react';
// import {
//     MOCK_DASHBOARD_OVERVIEW,
//     MOCK_USER_GROWTH,
//     MOCK_TOP_STREAM_SONGS,
//     MOCK_GENRE_DISTRIBUTION,
//     getStreamDataForYear,
//     getStreamDataForMonth,
//     getStreamDataForWeek
// } from '../../../constants/mockData';

// export type TimeRangeType = 'week' | 'month' | 'year';

// export const useDashboardLogic = () => {
//     const [isLoading, setIsLoading] = useState(true);

//     // Static Data
//     const stats = MOCK_DASHBOARD_OVERVIEW;
//     const userGrowthData = MOCK_USER_GROWTH;
//     const topSongs = MOCK_TOP_STREAM_SONGS;
//     const genreData = MOCK_GENRE_DISTRIBUTION;

//     // --- CHART LOGIC ---
//     const [streamData, setStreamData] = useState<any[]>([]);

//     // State quản lý bộ lọc
//     const [timeRange, setTimeRange] = useState<TimeRangeType>('week');
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

//     useEffect(() => {
//         const loadChartData = async () => {
//             // Giả lập loading nhẹ cho mượt
//             // setIsLoading(true); 

//             let data = [];
//             if (timeRange === 'year') {
//                 // Xem các tháng trong năm
//                 data = getStreamDataForYear(selectedYear);
//             } else if (timeRange === 'month') {
//                 // Xem các tuần trong tháng
//                 data = getStreamDataForMonth(selectedYear, selectedMonth);
//             } else {
//                 // Xem 7 ngày qua
//                 data = getStreamDataForWeek();
//             }

//             setStreamData(data);
//             setIsLoading(false);
//         };

//         loadChartData();
//     }, [timeRange, selectedYear, selectedMonth]);

//     return {
//         isLoading,
//         stats,
//         streamData,
//         genreData,
//         userGrowthData,
//         topSongs,

//         // Filter States & Setters
//         timeRange, setTimeRange,
//         selectedYear, setSelectedYear,
//         selectedMonth, setSelectedMonth
//     };
// };

import { useState, useEffect } from 'react';
import api from '../../../services/api';

export type TimeRangeType = 'week' | 'month' | 'year';

export const useDashboardLogic = () => {
    const [isLoading, setIsLoading] = useState(true);

    // State thống kê tổng quan (Khớp với StatsOverview.tsx)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSongs: 0,
        totalArtists: 0,
        totalAlbums: 0,
        monthlyStreams: "0", // Dùng string để format dấu phẩy (vd: 1,000)
    });

    const [streamData, setStreamData] = useState<any[]>([]);
    const [genreData, setGenreData] = useState<any[]>([]);
    const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
    const [topSongs, setTopSongs] = useState<any[]>([]);

    const [timeRange, setTimeRange] = useState<TimeRangeType>('week');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    // ==============================================================
    // 1. LẤY SỐ LIỆU TỔNG QUAN & TOP BÀI HÁT (Chỉ gọi 1 lần khi vào trang)
    // ==============================================================
    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                // Tận dụng API search/list với size=1 để lấy thuộc tính totalElements cho nhẹ server
                const [usersRes, songsRes, artistsRes, albumsRes, topSongsRes] = await Promise.allSettled([
                    api.get('/user/list', { params: { size: 1 } }),
                    api.get('/song/advanced-search', { params: { size: 1 } }),
                    api.get('/artist/search', { params: { size: 1 } }),
                    api.get('/albums/list', { params: { size: 1 } }),
                    api.get('/stream/top')
                ]);

                // Cập nhật 4 thẻ Card phía trên
                setStats(prev => ({
                    ...prev,
                    totalUsers: usersRes.status === 'fulfilled' ? usersRes.value.data.result?.totalElements || 0 : 0,
                    totalSongs: songsRes.status === 'fulfilled' ? songsRes.value.data.result?.totalElements || 0 : 0,
                    totalArtists: artistsRes.status === 'fulfilled' ? artistsRes.value.data.result?.totalElements || 0 : 0,
                    totalAlbums: albumsRes.status === 'fulfilled' ? albumsRes.value.data.result?.totalElements || 0 : 0,
                }));

                // Cập nhật danh sách Top bài hát nghe nhiều
                if (topSongsRes.status === 'fulfilled' && topSongsRes.value.data.result) {
                    const mappedTop = topSongsRes.value.data.result.map((item: any) => ({
                        id: item.songId,
                        title: item.songTitle,
                        artist: item.artistName,
                        cover: item.coverUrl,
                        streams: item.count || 0
                    }));
                    setTopSongs(mappedTop);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu tổng quan:", error);
            }
        };
        fetchOverviewData();
    }, []);


    // ==============================================================
    // 2. LẤY DỮ LIỆU BIỂU ĐỒ (Chạy lại mỗi khi User đổi Filter: Tuần/Tháng/Năm)
    // ==============================================================
    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                // Gọi tới AnalyticsController vừa tạo ở Backend
                const res = await api.get('/analytics/dashboard', {
                    params: { timeRange, year: selectedYear, month: selectedMonth }
                });

                if (res.data.result) {
                    const data = res.data.result;
                    setStreamData(data.streamData || []);
                    setGenreData(data.genreData || []);
                    setUserGrowthData(data.userGrowthData || []);

                    // Cập nhật riêng con số Lượt nghe (có format dấu phẩy cho đẹp)
                    setStats(prev => ({
                        ...prev,
                        monthlyStreams: (data.totalStreams || 0).toLocaleString()
                    }));
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu biểu đồ:", error);
                setStreamData([]);
                setGenreData([]);
                setUserGrowthData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange, selectedYear, selectedMonth]);

    return {
        isLoading,
        stats,
        streamData,
        genreData,
        userGrowthData,
        topSongs,
        timeRange, setTimeRange,
        selectedYear, setSelectedYear,
        selectedMonth, setSelectedMonth
    };
};