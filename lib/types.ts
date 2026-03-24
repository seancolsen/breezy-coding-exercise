export interface PlaylistIntent {
  title: string;
  explanation: string;
  searchQueries: string[];
  excludeTerms: string[];
  count: number;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  artworkUrl: string;
  previewUrl: string | null;
  trackUrl: string;
  genre: string;
}

export interface Playlist {
  title: string;
  explanation: string;
  tracks: Track[];
}

export interface GenerateRequest {
  prompt: string;
  excludedTrackIds?: number[];
}

export interface GenerateResponse {
  playlist: Playlist;
}
