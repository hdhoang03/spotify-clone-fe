import React, { useState } from 'react';
import ProfileSection from '../Profile/components/ProfileSection';
import type { SectionItem } from '../Profile/components/ProfileSection';
import { useTranslation } from 'react-i18next';

interface RelatedArtistsProps {
    artists: SectionItem[];
}

const RelatedArtists = ({ artists }: RelatedArtistsProps) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!artists || artists.length === 0) return null;

    // Logic hiển thị:
    // - Mobile: Thường người dùng thích scroll ngang hết danh sách luôn thay vì bị cắt.
    // - Desktop: Cần cắt để gọn 1 dòng.

    // Tuy nhiên, để giữ sự đồng bộ đơn giản (và code cũ của bạn), ta vẫn dùng slice.
    // ProfileSection sẽ tự động kích hoạt scroll ngang (lấp ló) nếu items > 2.
    // Lưu ý: Nếu slice(0, 5) -> có 5 item -> 5 > 2 -> Vẫn scroll ngang tốt.

    const visibleArtists = isExpanded ? artists : artists.slice(0, 5);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <ProfileSection
                title={t('artist.fans_also_like')}
                items={visibleArtists}
                onShowAll={artists.length > 5 ? () => setIsExpanded(!isExpanded) : undefined}
            />
        </div>
    );
};

export default RelatedArtists;