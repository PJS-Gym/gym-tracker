## Repo layout

- `frontend/`: Next.js app (bun). Read `frontend/AGENTS.md` before touching it.
- `backend/`: FastAPI app (uv). Run with `uv run fastapi dev`.

## Git

- Do not sign off commits as an AI agent: no `Co-Authored-By: Claude ...` or similar attribution trailers in commit messages.

## Pull requests

Follow `.github/pull_request_template.md`. The body has, in order:

1. **`Closes #<issue>`** on the first line, in the body (not the title), so the issue closes on merge into `main`.
2. **The TLDR.** Two to four sentences with no heading. Say what now exists and why it matters to the person using the app, in the app's words. A reviewer who reads only this should know what a user can do that they couldn't before, and what this PR leaves out.
3. **`## What this PR implements`**, as a bullet list. One line per thing built, in the reader's terms, not a changelog of files. Point at the module a reviewer should open first (e.g. `frontend/src/app/`).

   A decision that needs a paragraph gets its own heading after the list, named after the decision (e.g. "Restart asks before throwing work away"). Headings come from the change. Don't add a `## Summary` or `## Testing` because a form has one.
