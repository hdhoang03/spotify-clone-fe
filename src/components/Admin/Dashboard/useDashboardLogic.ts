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
    // Gọi 1 API duy nhất /analytics/overview (đã cache Redis 5 phút)
    // ==============================================================
    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                const res = await api.get('/analytics/overview');
                if (res.data.result) {
                    const data = res.data.result;

                    // Cập nhật 4 thẻ Card phía trên
                    setStats(prev => ({
                        ...prev,
                        totalUsers: data.totalUsers || 0,
                        totalSongs: data.totalSongs || 0,
                        totalArtists: data.totalArtists || 0,
                        totalAlbums: data.totalAlbums || 0,
                    }));

                    // Cập nhật danh sách Top bài hát nghe nhiều
                    if (data.topSongs) {
                        const mappedTop = data.topSongs.map((item: any) => ({
                            id: item.songId,
                            title: item.songTitle,
                            artist: item.artistName,
                            cover: item.coverUrl,
                            streams: item.count || 0
                        }));
                        setTopSongs(mappedTop);
                    }
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