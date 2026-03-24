# Playlist Copilot

## How to run

1. Set your OPENAI_API_KEY in `.env.local`

1. Run:

    ```
    npm run dev
    ```

1. Go to http://localhost:3000/

## Q&A

### What you built

I built an AI-powered playlist generator

### What you prioritized

Following the specs, creating a good user experience.

### What you would do next with more time

Figure out how to play the full track, not just 30 seconds. I imagine this would require a different integration.

### Which external integration you chose and why

- Used OpenAI for feeding the user's prompt into an LLM. I chose this because the agent (using Opus 4.6) recommended it because it's fast.

- Used iTunes search API because it doesn't require auth.

### The 2-3 most useful prompts you gave your AI tool

- Perhaps this is cheating (I hope not), but the first prompt I gave the agent leaned heavily on the text directly from the PDF. I said:

    > Read `README.md` and create an architectural outline for how to build this project.

    and then:

    > Generate a plan to build this.

### One example of AI output you rejected or corrected

- I didn't like the "pin" feature that it implemented. The UX was weird. I removed this.
