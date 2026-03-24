# AI playlist generator

90-Minute Take-Home Challenge
Playlist Copilot
Build a small product that turns a natural-language playlist request into a useful result. The goal is to show
how you scope, build, and iterate with AI tools under real time pressure.
Duration
90 minutes hard limit
Required AI tooling
Use Claude Code, Codex, Cursor, or a similar AI
coding tool
Required integration
Use at least one real music-related external API
or service
Primary output
A working prototype plus a short recording of
your workflow
Challenge
Build a small product that helps a user turn a vague prompt into a playlist. The result should feel like a
usable product, not just a code demo.
Example prompts
- Late-night coding playlist: moody, energetic, no obvious pop
- Dinner party playlist that feels upbeat but not cheesy
- Workout playlist that ramps up fast, but no EDM
Requirements
-
 Accept a natural-language request for a playlist.
-
 Use an AI coding tool during the build. Your use of that tool must be visible in the recording.
-
 Integrate with at least one real music-related external API or service. Examples: Spotify Web API, iTunes
Search API, Deezer API, Last.fm, or a similar service.
-
 Generate a playlist of 8-15 songs, a playlist title, and a short explanation of why the result fits the request.
-
 Support at least one human-in-the-loop editing action, such as removing a song, pinning a song, or
changing the prompt and regenerating.
-
 You may use any language, framework, or stack. You may use an LLM API, but it is not required.
Constraints and expectations
-
 The time limit is strict. Please stop at 90 minutes.
-
 Do not spend time on deployment unless it directly helps the demo.
-
 A narrow, polished solution is better than an ambitious unfinished one.
-
 Prefer a thoughtful solution where AI is used selectively, not everywhere.
-
 We care about the product loop: prompt -> result -> refinement.
AI Product Engineering Take-Home
 Page 1
Deliverables
-
 A working project.
-
 A short README that covers: what you built; what you prioritized; what you would do next with more time;
which external integration you chose and why; the 2-3 most useful prompts you gave your AI tool; and
one example of AI output you rejected or corrected.
-
 A screen recording of your 90-minute session showing your workflow with AI tools.
What we will evaluate
Area
AI tool fluency
Integration judgment
Product and UX thinking
Engineering fundamentals
Scope and execution
What we are looking for
How effectively you use AI tools to scope, scaffold, debug, iterate, and correct bad
output.
How quickly you navigate external docs, normalize external data, and avoid
integration dead ends.
Whether the result feels usable and whether the user has a sensible refine/edit
loop.
Data modeling, state flow, decomposition, and the split between deterministic logic
and AI-driven behavior.
How well you prioritize under time pressure and whether you ship a coherent
outcome.
Optional stretch ideas
- Create a real Spotify playlist
- Add a 'more like this' or 'less like this'
refinement loop
- Handle API failure or missing data gracefully
- Save multiple playlists or share the result
Submission note
This exercise is intentionally open-ended. There is
no single right architecture. What matters most is
your judgment: what you choose to build, how you
use AI tools, and how coherent the finished result
feels after 90 minutes.
