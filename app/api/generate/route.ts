import { NextRequest, NextResponse } from "next/server";
import { interpretPrompt } from "@/lib/openai";
import { searchTracks } from "@/lib/itunes";
import { GenerateRequest } from "@/lib/types";

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.prompt?.trim()) {
      return NextResponse.json(
        { error: "A playlist prompt is required" },
        { status: 400 }
      );
    }

    const intent = await interpretPrompt(body.prompt, {
      excludedTrackIds: body.excludedTrackIds,
    });

    const searchResults = await searchTracks(intent.searchQueries);

    const excludeSet = new Set(body.excludedTrackIds ?? []);

    let filtered = searchResults.filter(
      (t) => !excludeSet.has(t.id)
    );

    if (intent.excludeTerms?.length) {
      const lowerExcludes = intent.excludeTerms.map((e) => e.toLowerCase());
      filtered = filtered.filter((t) => {
        const artistLower = t.artist.toLowerCase();
        const genreLower = t.genre.toLowerCase();
        return !lowerExcludes.some(
          (ex) => artistLower.includes(ex) || genreLower.includes(ex)
        );
      });
    }

    const shuffled = shuffle(filtered);
    const tracks = shuffled.slice(0, intent.count);

    return NextResponse.json({
      playlist: {
        title: intent.title,
        explanation: intent.explanation,
        tracks,
      },
    });
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate playlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
