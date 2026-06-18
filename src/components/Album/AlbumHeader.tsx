import { Calendar } from 'lucide-react';
import BackButton from '../common/BackButton';
import HeroBackground from '../common/HeroBackground';
import TiltCover from '../common/TiltCover';
import type { AlbumResponse } from '../../types/backend.d';
import { useTranslation } from 'react-i18next';

interface AlbumHeaderProps {
    album: AlbumResponse;
    totalElements: number;
}

const AlbumHeader = ({ album, totalElements }: AlbumHeaderProps) => {
    const { t } = useTranslation();
    return (
        <div className="relative overflow-visible pb-8" style={{ minHeight: 320 }}>
            {/* Màu chủ đạo + gradient fade — tái sử dụng HeroBackground */}
            <HeroBackground imageUrl={album.albumUrl || album.avatarUrl} bleedPx={100} />

            {/* Nội dung nổi trên background */}
            <div className="relative z-10 px-6 md:px-10 lg:px-16 pt-4 md:pt-8">
                <BackButton label={t('album.back')} className="mb-6 text-zinc-700 dark:text-zinc-300" />

                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-end">
                    {/* Ảnh bìa 3D tilt — tái sử dụng TiltCover */}
                    <TiltCover
                        src={album.albumUrl || album.avatarUrl}
                        alt={album.name}
                        sizeClass="w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60"
                    />

                    {/* Thông tin album */}
                    <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-widest">Album</span>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
                            {album.name}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-zinc-600 dark:text-zinc-400 pt-1">
                            {album.artistName && (
                                <span className="font-semibold text-zinc-900 dark:text-white">{album.artistName}</span>
                            )}
                            {album.releaseDate && (
                                <>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={13} /> {album.releaseDate}
                                    </span>
                                </>
                            )}
                            <span className="opacity-50">·</span>
                            <span>{totalElements} {t('album.total_elements')}</span>
                        </div>

                        {album.description && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed pt-1">
                                {album.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumHeader;
