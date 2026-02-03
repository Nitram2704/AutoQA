import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProjectContext } from './context-harvester.js';
import { validateGeneratedTest, PlaywrightTestContent } from './validator.js';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite-preview-02-05';

if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from .env');
}

const genAI = new GoogleGenerativeAI(API_KEY!);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export async function generatePlaywrightTest(
    userPrompt: string,
    context: ProjectContext,
    previousError?: string
): Promise<PlaywrightTestContent> {
    const systemPrompt = `
You are an expert QA Automation Engineer. Generate a Playwright TypeScript test.
CONTEXT:
- Base URL: ${context.baseUrl}
- Accessibility Tree: ${JSON.stringify(context.accessibilityTree || {}, null, 2)}
- Examples: ${context.exampleTests || 'None provided.'}

RULES:
1. Output ONLY valid TypeScript code.
2. Use getByRole, getByLabel, getByText (accessibility-first).
3. Include assertions with expect().
4. Prioritize resilient selectors.
5. If an iframe is detected in context, use frameLocator().

${previousError ? `🚨 PREVIOUS ATTEMPT FAILED:\nError: "${previousError}"\nFix the test to resolve this error.` : ''}

Return the response in JSON format matching this schema:
{
  "testName": "string",
  "imports": "string",
  "testCode": "string",
  "fullScript": "string"
}
`;

    const result = await model.generateContent([
        { text: systemPrompt },
        { text: `User Goal: ${userPrompt}` }
    ]);

    const response = await result.response;
    const text = response.text();

    return validateGeneratedTest(text);
}
