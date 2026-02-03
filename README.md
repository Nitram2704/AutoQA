🤖 Project: AutoQA (AI-Powered E2E Testing)

AutoQA is a personal productivity tool (CLI) designed to automate the creation and execution of End-to-End (E2E) tests using Artificial Intelligence (Gemini 2.0) and Playwright. Its goal is to allow developers to describe test flows in natural language and see them executed instantly without writing a single line of test code manually.

🚀 1. Key Functionalities
Natural Language Generation: Users can run a command like auto-qa "Login with my test user and verify the profile", and the tool understands the intent.
Intelligent Context Harvester: Before generating the test, the tool crawls the application, analyzes the Accessibility Tree, and scans the DOM for interactive elements (buttons, links, inputs).
Hybrid Detection (Recent Improvement): Combines accessibility roles with DOM hints (IDs, classes, placeholders, data-testids) to ensure the AI identifies the correct elements even in complex frameworks like React, Expo Web, or custom Dashboards.
Automatic Execution (Runner): Once the Playwright code is generated, it is saved locally and executed in a real browser instance.
Self-Healing: If a test fails, the error log is sent back to Gemini. The AI then attempts to fix the script and re-run it automatically (supporting up to 3 retries).
Dry-Run Mode: Allows users to preview the generated code without launching a browser.

🛠️ 2. Technical Stack
Runtime: Node.js 22+ (TypeScript).
AI Engine: Gemini 2.0 Flash Lite (via @google/generative-ai).
Automation: Playwright (for browser navigation and test execution).
CLI Framework: Commander.js + Chalk + Ora (for a polished terminal UI).
Validation: Zod (to ensure AI responses match the required JSON schema).
Manages the connection to the Gemini API.
Prompt Engineering: Features a robust System Prompt that instructs the AI to prioritize accessibility-first locators (getByRole) but allows for robust alternatives if the context is ambiguous.

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

🏗️ 3. Architecture and Code Structure
The project follows a "Local Agent" pattern, divided into decoupled modules located in the src/ directory:

A. Context Harvester (
src/context-harvester.ts
)
The "eyes" of the tool.

Uses Playwright to navigate to the app's URL.
Core Logic: Injects a script into the browser to capture attributes like data-testid, placeholder, aria-label, and CSS selectors, providing the AI with a rich context to minimize "hallucinations."
B. LLM Client (
src/llm-client.ts
)
The "brain."


C. Runner (
src/runner.ts
)
The "muscle."

Takes the AI-generated TypeScript code.
Saves scripts to ./auto-qa/history/ with timestamps for audit and local versioning.
Triggers npx playwright test and captures outputs/errors.
D. Validator (src/validator.ts)
The "quality filter."

Uses Zod schemas to validate that the AI's response contains all necessary properties (testName, testCode, fullScript).
Cleans AI output by stripping markdown blocks or irrelevant text.

📁 4. Project File Structure
text
AutoQA/

├── src/                    # TypeScript Source Code

│   ├── cli.ts              # CLI Entry point

│   ├── context-harvester.ts # Web element extraction logic

│   ├── llm-client.ts       # Gemini AI integration

│   ├── runner.ts           # Playwright execution engine

│   └── validator.ts        # AI output validation

├── auto-qa/                # Generated artifacts

│   ├── history/            # History of generated .spec.ts files

│   └── evidence/           # Failure screenshots (if applicable)

├── package.json            # Dependencies and scripts

├── tsconfig.json           # TS Compilation settings

└── .env                    # API Keys and Model configuration



