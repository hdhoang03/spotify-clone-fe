// // components/Artist/RelatedArtists.tsx
// import React, { useState } from 'react';
// import ProfileSection from '../Profile/ProfileSection';
// import type { SectionItem } from '../Profile/ProfileSection';

// interface RelatedArtistsProps {
//     artists: SectionItem[];
// }

// const RelatedArtists = ({ artists }: RelatedArtistsProps) => {
//     const [isExpanded, setIsExpanded] = useState(false);

//     if (!artists || artists.length === 0) return null;

//     // Logic cắt danh sách:
//     // Nếu chưa mở rộng (isExpanded = false) -> Cắt lấy 5 nghệ sĩ đầu (đủ 1 dòng desktop)
//     // Nếu đã mở rộng -> Lấy hết
//     // Lưu ý: Trên Mobile do dùng 'overflow-x-auto' nên kể cả cắt 5 người thì vẫn scroll ngang được 5 người đó.
//     const visibleArtists = isExpanded ? artists : artists.slice(0, 5);

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
//             <ProfileSection 
//                 title="Fans also like"
//                 items={visibleArtists}
//                 // Nếu danh sách gốc dài hơn 5, thì hiện nút Show All
//                 onShowAll={artists.length > 5 ? () => setIsExpanded(!isExpanded) : undefined}
//             />
//             {/* Nếu muốn đổi chữ nút Show All thành Show Less khi đã mở, bạn cần sửa prop onShowAll trong ProfileSection để nhận text, hoặc handle state bên trong ProfileSection */}
//         </div>
//     );
// };

// export default RelatedArtists;

// components/Artist/RelatedArtists.tsx
import React, { useState } from 'react';
import ProfileSection from '../Profile/ProfileSection';
import type { SectionItem } from '../Profile/ProfileSection';

interface RelatedArtistsProps {
    artists: SectionItem[];
}

const RelatedArtists = ({ artists }: RelatedArtistsProps) => {
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
                title="Fans also like"
                items={visibleArtists}
                onShowAll={artists.length > 5 ? () => setIsExpanded(!isExpanded) : undefined}
            />
        </div>
    );
};

export default RelatedArtists;