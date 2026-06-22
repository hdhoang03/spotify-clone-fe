// Re-export from new location for backward compatibility
// The canonical source is now: Search/hooks/useSearchApi.ts
export { useSearchApi } from './hooks/useSearchApi';
export type {
    SearchSongResponse,
    ArtistSearchResponse as ArtistResponse,
    AlbumSearchResponse as AlbumResponse,
    UserSearchResponse,
    SearchResponseData,
} from './types/search.types';