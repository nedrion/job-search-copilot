# Job Search Copilot

Analyze job descriptions against your CV and get a markdown report with skill match scores, gaps, and CV improvement hints.

Comes with two matching strategies — **regex** (fast, offline, deterministic) and **LLM** (context-aware, semantic matching via OpenAI).

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and configure (only needed for the LLM matcher):

```bash
cp .env.example .env
```

Place your CV at `cvs/cv.txt` using this format:

```markdown
# Name — Title

## Skills
- Skill1, Skill2, ...

## Experience
### Role — Company (duration)
- Achievement bullet point

## Education
- Degree — Institution (year)
```

## Usage

```bash
npm start -- <job-file>
```

The job file goes in `jobs/`. Reports are written to `reports/`.

### Examples

```bash
npm start -- senior-fullstack-engineer.txt
npm start -- devops-engineer.txt
```

You can also pass an absolute path: `npm start -- C:\path\to\job.txt`.

## Matching Strategies

| Strategy | Env Value | Description |
|---|---|---|
| **Regex** (default) | `MATCHER_TYPE=regex` | Fast keyword matching — compares parsed skill lists from CV and job description |
| **LLM** | `MATCHER_TYPE=llm` | Semantic analysis via OpenAI — understands context, synonyms, and transferable skills |

Set the strategy via environment variable:

```bash
# PowerShell
$env:MATCHER_TYPE="llm"; npm start -- job.txt

# CMD
set MATCHER_TYPE=llm && npm start -- job.txt
```

## Output

A markdown report containing:

- **Match percentages** — overall, required skills, preferred skills
- **Skill breakdown table** — every skill marked matched/missing with your CV proficiency level
- **Strengths & gaps** — what you already have and what needs work
- **CV hints** — actionable suggestions tailored to the specific job

## Architecture (Strategy Pattern)

```
src/
  index.ts              — CLI entry point
  config.ts             — Environment-based configuration
  cv.ts                 — CV parser (regex-based)
  job-parser.ts         — Job description parser (regex-based)
  reporter.ts           — Markdown report generator
  types.ts              — Shared type definitions
  matchers/
    matcher.ts          — MatcherStrategy interface
    regex-matcher.ts    — Regex-based strategy
    llm-matcher.ts      — OpenAI-based strategy
    factory.ts          — Creates the right strategy from config
cvs/                    — Place your cv.txt here
jobs/                   — Place job description .txt files here
reports/                — Generated reports (gitignored)
```

The `MatcherStrategy` interface lets you plug in new matching algorithms without touching the pipeline. Implement the interface, register it in the factory, and you're done.
