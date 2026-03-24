import { Track } from "./types";

interface ITunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl?: string;
  trackViewUrl: string;
  primaryGenreName: string;
}

interface ITunesResponse {
  resultCount: number;
  results: ITunesResult[];
}

function normalizeTrack(result: ITunesResult): Track {
  return {
    id: result.trackId,
    title: result.trackName,
    artist: result.artistName,
    album: result.collectionName,
    artworkUrl: result.artworkUrl100?.replace("100x100", "300x300") ?? "",
    previewUrl: result.previewUrl ?? null,
    trackUrl: result.trackViewUrl,
    genre: result.primaryGenreName,
  };
}

async function searchSingle(query: string): Promise<Track[]> {
  const params = new URLSearchParams({
    term: query,
    media: "music",
    entity: "song",
    limit: "25",
  });

  const url = `https://itunes.apple.com/search?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`iTunes search failed for "${query}": ${response.status}`);
    return [];
  }

  const data: ITunesResponse = await response.json();
  return data.results
    .filter((r) => r.trackId && r.trackName && r.artistName)
    .map(normalizeTrack);
}

export async function searchTracks(queries: string[]): Promise<Track[]> {
  const results = await Promise.all(queries.map(searchSingle));
  const allTracks = results.flat();

  const seen = new Set<number>();
  const deduplicated: Track[] = [];
  for (const track of allTracks) {
    if (!seen.has(track.id)) {
      seen.add(track.id);
      deduplicated.push(track);
    }
  }

  return deduplicated;
}
