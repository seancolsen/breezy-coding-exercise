import OpenAI from "openai";
import { PlaylistIntent, Track } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a music playlist curator. Given a natural-language playlist request, produce a JSON object with:

- "title": a creative, short playlist title (3-6 words)
- "explanation": 1-2 sentences explaining why this playlist fits the request
- "searchQueries": an array of 4-6 diverse search terms for the iTunes Search API. Each should be a specific artist name, song title, or "artist genre" combo that matches the vibe. Be specific — use real artist and song names, not generic mood words.
- "excludeTerms": an array of artist names or genres the user wants to avoid
- "count": number of songs to include (between 8 and 15)

Respond ONLY with valid JSON matching this schema. No markdown, no explanation outside the JSON.`;

export async function interpretPrompt(
  prompt: string,
  context?: { pinnedTracks?: Track[]; excludedTrackIds?: number[] }
): Promise<PlaylistIntent> {
  let userMessage = prompt;

  if (context?.pinnedTracks?.length) {
    const pinned = context.pinnedTracks
      .map((t) => `${t.artist} - ${t.title}`)
      .join(", ");
    userMessage += `\n\nThe user has pinned these songs (keep them and find similar ones): ${pinned}`;
  }

  if (context?.excludedTrackIds?.length) {
    userMessage += `\n\nAvoid repeating previously suggested songs. Generate fresh, different search queries from before.`;
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    max_tokens: 500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(content) as PlaylistIntent;

  if (
    !parsed.title ||
    !parsed.searchQueries?.length ||
    !parsed.explanation ||
    typeof parsed.count !== "number"
  ) {
    throw new Error("Invalid playlist intent from OpenAI");
  }

  parsed.count = Math.max(8, Math.min(15, parsed.count));

  return parsed;
}
