# AutoQA CLI Tool 🚀

AutoQA is an AI-powered CLI tool that generates and executes Playwright E2E tests from natural language prompts using Gemini 2.0 Flash Lite.

## Features
- **Context Harvester**: Automatically extracts the accessibility tree from your web app.
- **Smart Generation**: Uses Gemini to write resilient, accessibility-first Playwright tests.
- **Self-Healing**: Automatically retries failed tests with error feedback.
- **Autonomous Loop**: Generates, validates, and executes tests in a single command.

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment:
   Create a `.env` file with your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
4. Build the project:
   ```bash
   npm run build
   ```

## Usage

Generate and run a test:
```bash
npx auto-qa "Click on the login button and verify the dashboard header appears"
```

### Options
- `--url <url>`: Override the target URL (defaults to detecting from `package.json`).
- `--headless`: Run the browser in headless mode.
- `--dry-run`: Generate the test code without executing it.
- `--retry <number>`: Maximum retry attempts (default: 3).

## Project Structure
- `src/`: TypeScript source code.
- `dist/`: Compiled JavaScript.
- `auto-qa/history/`: Auditing of all generated tests.
- `auto-qa/tests/`: Permanent storage for saved tests.
- `auto-qa/evidence/`: Failure screenshots.

## License
MIT
