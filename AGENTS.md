# AGENTS.md

Guidance for AI coding agents working in this repository.

## Code comments

This applies to the site's code (`src/app`, `src/components`, `src/lib`, `scripts`, config files) and to the code surrounding examples, not to documentation prose. Code samples shown to readers in the docs content may keep comments that teach the reader.

- Do not add comments. Code should explain itself through names and structure; put the reasoning in the PR description or commit message.
- Allowed: tool/linter/compiler directives, license headers, and a one-line doc comment on an exported API when its contract is not obvious from the signature.
- Never add commented-out code, TODO notes, narrative explanations, change history, or references to issues/incidents in comments.
- When editing a file, do not add comments to it; existing comments that violate this rule may be removed.
