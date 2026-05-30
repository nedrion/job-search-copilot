# Job Search Copilot

Analyze job descriptions against your CV and get a markdown report with skill match scores, gaps, and CV improvement hints.

## Setup

```bash
npm install
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

## Output

A markdown report containing:

- **Match percentages** — overall, required skills, preferred skills
- **Skill breakdown table** — every skill marked matched/missing with your CV proficiency level
- **Strengths & gaps** — what you already have and what needs work
- **CV hints** — actionable suggestions tailored to the specific job

## Project Structure

```
src/
  index.ts     — CLI entry point
  cv.ts        — CV parser (regex-based)
  analyzer.ts  — Job parser + match engine
  reporter.ts  — Markdown report generator
  types.ts     — Shared type definitions
cvs/           — Place your cv.txt here
jobs/          — Place job description .txt files here
reports/       — Generated reports (gitignored)
```
