# Swiss Law GPT

Small educational project that aim to process swiss law books like the CO (https://www.fedlex.admin.ch/eli/cc/27/317_321_377/en)
in embedding in a SQLite database. You can then do RAG (Retrieval-Augmented Generation) with Gemini to have sourced answer
from the Swiss Law.

# How to use
## With source code

- `cp .env.example .env`
- fill the file with your Gemini Key
- `deno run boot`
- `deno run ask "<Your Question>"`