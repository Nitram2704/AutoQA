import { z } from 'zod';

export const PlaywrightTestSchema = z.object({
  testName: z.string().describe('Descriptive name of the test'),
  imports: z.string().describe('Required imports for the test file'),
  testCode: z.string().describe('The actual test code including assertions'),
  fullScript: z.string().describe('The complete runnable .spec.ts content')
});

export type PlaywrightTestContent = z.infer<typeof PlaywrightTestSchema>;

export function validateGeneratedTest(aiOutput: string): PlaywrightTestContent {
  try {
    // Attempt to parse as JSON first
    const parsed = JSON.parse(aiOutput);
    return PlaywrightTestSchema.parse(parsed);
  } catch (e) {
    // If not JSON, try to extract from markdown code blocks
    const codeBlockRegex = /```(?:typescript|javascript|ts|js)?\s*([\s\S]*?)```/g;
    const matches = Array.from(aiOutput.matchAll(codeBlockRegex));
    
    if (matches.length > 0) {
      const code = matches[0][1].trim();
      return {
        testName: 'Generated Test',
        imports: "import { test, expect } from '@playwright/test';",
        testCode: code,
        fullScript: code.includes('import') ? code : `import { test, expect } from '@playwright/test';\n\n${code}`
      };
    }
    
    throw new Error('Could not parse AI output as valid test code.');
  }
}
