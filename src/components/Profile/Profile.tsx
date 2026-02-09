import { useNavigate } from 'react-router-dom';
import { useMusic } from '../../contexts/MusicContent';
import ProfileHeader from './ProfileHeader';
import ProfileSection from './ProfileSection';
import type { SectionItem } from './ProfileSection';
import { MOCK_SONGS } from '../../constants/mockData';
import TrackRow from './TrackRow';
import Footer from '../HomePage/Footer';
import BackButton from '../../components/common/BackButton';
import { useUserProfile } from '../../hooks/useUserProfile';

interface ProfilePageProps {
    onNavigate?: (tab: string) => void;
}

// Giữ lại Mock Data cho các phần chưa có API (Artist, Playlist khác)
const MOCK_ARTISTS = [
    { id: '1', name: 'Taylor Swift', imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.uhLeKFFHYzK16GgPfKatXQHaLI?w=755&h=1135&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Artist' },
    { id: '2', name: 'Sơn Tùng M-TP', imageUrl: 'https://i.vgt.vn/2023/7/14/son-tung-tai-xuat-voi-dien-mao-moi-dong-thai-cua-hai-tu-con-gay-chu-y-hon-a5c-6944100.png', type: 'Artist' },
    { id: '3', name: 'Phuong Ly', imageUrl: 'https://i.vgt.vn/2024/1/5/phuong-ly-lo-anh-ben-con-trai-dua-be-gio-o-dau-danh-tinh-nguoi-bo-khong-ngo-b03-7066114.jpg', type: 'Artist' },
    { id: '4', name: 'ILLIT', imageUrl: 'https://0.soompi.io/wp-content/uploads/2024/02/06075033/ILLIT-2-2.jpeg', type: 'Artist' },
];

const MOCK_PLAYLISTS = [
    { id: 'p1', name: 'Kpop', imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.0vBZdbQMidBucCMPWCmfiwHaNH?rs=1&pid=ImgDetMain&o=7&rm=3', owner: 'Hoang' },
    { id: 'p2', name: 'Code Java', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.PU6aHyccCGL19WbrYRAL3QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', owner: 'Hoang' },
];

const ProfilePage = ({ onNavigate }: ProfilePageProps) => {
    const { playPlaylist } = useMusic();
    const navigate = useNavigate();

    // 2. SỬ DỤNG HOOK (Thay thế cho state local cũ)
    const { user, isLoading, updateInfo, updateAvatar } = useUserProfile();

    // 3. XỬ LÝ LOADING
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Nếu không có user (Lỗi hoặc chưa đăng nhập)
    if (!user) return null;

    const topTracks = MOCK_SONGS.slice(0, 4);
    // Vì hook useUserProfile giả lập người dùng hiện tại, nên isOwnProfile luôn là true ở trang này
    const isOwnProfile = true;

    const handlePlayTrack = (index: number) => {
        playPlaylist(topTracks, index);
    };

    // 4. HÀM UPDATE MỚI (Sử dụng các hàm từ Hook)
    const handleUpdateProfile = async (newName: string, newFile: File | null, isRemoved?: boolean) => {
        // Cập nhật tên nếu có thay đổi
        if (newName !== user.name) {
            await updateInfo({ name: newName });
        }

        // Cập nhật Avatar
        if (newFile) {
            await updateAvatar(newFile);
        } else if (isRemoved) {
            // Logic xóa avatar (cập nhật thành chuỗi rỗng)
            await updateInfo({ avatarUrl: '' });
        }
    };

    // --- CÁC PHẦN DƯỚI GIỮ NGUYÊN ---
    const artistItems: SectionItem[] = MOCK_ARTISTS.slice(0, 5).map(a => ({
        id: a.id,
        title: a.name,
        subTitle: 'Artist',
        imageUrl: a.imageUrl,
        rounded: true,
        onClick: () => navigate(`/artist/${a.id}`)
    }));

    const playlistItems: SectionItem[] = MOCK_PLAYLISTS.map(p => ({
        id: p.id,
        title: p.name,
        subTitle: `By ${p.owner}`,
        imageUrl: p.imageUrl,
        rounded: false,
        onClick: () => console.log('Click playlist', p.name)
    }));

    return (
        <div className="bg-white dark:bg-[#121212] min-h-screen transition-colors duration-300">
            <div className="relative">
                <div className="absolute top-4 left-4 z-10 lg:hidden">
                    <BackButton className="bg-black/20 backdrop-blur-sm p-1 rounded-full text-white" />
                </div>

                <ProfileHeader
                    user={user} // Truyền user từ hook vào đây
                    isOwnProfile={isOwnProfile}
                    onUpdateProfile={handleUpdateProfile} // Truyền hàm xử lý mới
                />
            </div>

            <div className="p-4 md:px-8 space-y-10 mt-8">
                {isOwnProfile && (
                    <ProfileSection
                        title="Top artists this month"
                        subTitle="Only visible to you"
                        items={artistItems}
                    />
                )}

                {isOwnProfile && (
                    <section>
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top tracks this month</h2>
                            <button className="text-xs font-bold text-gray-500 hover:text-black dark:text-[#b3b3b3] dark:hover:text-white uppercase tracking-widest">
                                Show all
                            </button>
                        </div>
                        <div className="flex flex-col">
                            {topTracks.map((song, index) => (
                                <TrackRow
                                    key={song.id}
                                    index={index}
                                    coverUrl={song.coverUrl}
                                    title={song.title}
                                    artist={song.artist}
                                    duration={song.duration || 0}
                                    onClick={() => handlePlayTrack(index)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <ProfileSection
                    title="Public Playlists"
                    items={playlistItems}
                    onShowAll={MOCK_PLAYLISTS.length > 4 ? () => console.log('Show all playlist') : undefined}
                />

                <ProfileSection
                    title="Following"
                    items={artistItems.slice(0, 4)}
                    onShowAll={() => console.log('Show all following')}
                />
            </div>

            <Footer />
        </div>
    );
};

export default ProfilePage;