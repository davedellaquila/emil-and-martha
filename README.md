# Emil & Martha Dell'Aquila — In Remembrance

A public memorial site for Emil and Martha Dell'Aquila, live at
https://davedellaquila.github.io/emil-and-martha/

A warm, static page (hand-written HTML/CSS/JS, no build step) where family and
friends can remember them together and share stories and photographs.

## How stories get here — the email-intake model

There is no account system and no form. Contributing works entirely by email,
by Dave's design:

1. A visitor emails **dave@dellaquila.com** with the subject line
   **Emil and Martha**.
2. Whatever they write in the email body becomes their article on the page;
   photos attached to the email appear in the article.
3. The article is published automatically under the sender's name, with their
   email address shown — exactly as the "Share a Story" section on the page
   describes.

An intake job watches Dave's inbox for that subject, appends each story to
`stories.json` (photos land in `images/`), and pushes. The page renders purely
from `stories.json`, so each push simply appears on the wall.

### stories.json format

```json
[
  {
    "id": "2026-11-03-001",
    "name": "Contributor Name",
    "email": "contributor@example.com",
    "date": "2026-11-03",
    "title": "Optional headline",
    "paragraphs": ["First paragraph.", "Second paragraph."],
    "images": ["images/2026-11-03-001-1.jpg"]
  }
]
```

## Removing a story

Dave asks Astro. Astro deletes the story's entry from `stories.json`, deletes
its files from `images/`, and pushes — the story disappears from the wall on
the next Pages build.

## Guardrails

- Posts appear automatically; Dave does not pre-approve them.
- Dave gets a notification for each new post.
- Spam filtering happens at intake; anything off can be removed in one step
  (above).
