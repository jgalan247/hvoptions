# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository powers the **Haute Vallée School GCSE options chatbot** — a tool for parents and students to ask questions and raise concerns about GCSE subject choices for the 2025–2027 cycle. It contains two files:

- **`responses.json`** — the primary question bank. Keyword-matched responses served by a Cloudflare Worker (hosted separately).
- **`hv-options-chat.jsx`** — React chat UI component with the full options booklet embedded as a system prompt (`BOOKLET_CONTEXT`).

No build steps, tests, or package manager config exist in this repo. Validate JSON changes with `python3 -m json.tool responses.json`.

## Architecture — Two-tier answer flow

When a parent asks a question, the chatbot follows this priority:

1. **Keyword match (responses.json)** — the Cloudflare Worker checks the user's input against `keywords[]` arrays. If a match is found, the corresponding `response` is returned immediately. This is fast, cheap, and deterministic.
2. **Haiku fallback** — if no keyword match is found, the worker calls `claude-haiku-4-5-20251001` with the options booklet as context to generate an answer. (Model specified in `meta.model_note`.)

The JSX component (`hv-options-chat.jsx`) is a standalone chat UI that calls the Anthropic API directly (browser-side via `anthropic-dangerous-direct-browser-access`) using `claude-sonnet-4-6`. It includes a `BOOKLET_CONTEXT` string (~170 lines) containing the entire options booklet.

The JSX also flags sensitive queries (SEN/dyslexia/autism keywords) and appends a SENCO referral banner.

When updating subject info, **both files may need changes** to stay consistent.

## Structure of responses.json

- `meta` — school name, academic year, fallback model note
- `responses[]` — array of response objects, each with:
  - `id` — unique snake_case identifier (e.g. `"subjects_list"`, `"computer_science"`)
  - `keywords[]` — trigger phrases the chatbot matches against user input
  - `response` — the text returned to the user

Response entries cover: subject listings, choice rules, individual subject descriptions, exam board info, careers advice, pastoral/SEN support, and practical details (deadlines, timetabling, Highlands College courses).

## Conventions

- Keep keyword arrays broad — include common misspellings and synonyms students might use.
- Responses should be concise, factual, and written in a friendly tone suitable for Year 8 students and parents.
- IDs use snake_case and should be descriptive (e.g. `"food_nutrition"`, `"change_mind"`).
- The `meta.model_note` field specifies which Claude model the worker falls back to when no keyword match is found.
- When updating subject details, check both `responses.json` and the `BOOKLET_CONTEXT` in `hv-options-chat.jsx` for consistency.
