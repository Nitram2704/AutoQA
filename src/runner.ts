import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export interface TestResult {
    success: boolean;
    output: string;
    error?: string;
    screenshotPath?: string;
}

export async function runPlaywrightTest(
    testCode: string,
    options: { headless: boolean; url: string }
): Promise<TestResult> {
    const timestamp = Date.now();
    const tempFile = path.join(os.tmpdir(), `auto-qa-test-${timestamp}.spec.ts`);
    const historyDir = path.join(process.cwd(), 'auto-qa', 'history');
    const evidenceDir = path.join(process.cwd(), 'auto-qa', 'evidence');

    // Ensure directories exist
    if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true });
    if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

    // Write test to temp and history
    fs.writeFileSync(tempFile, testCode);
    const historyFile = path.join(historyDir, `test-${timestamp}.spec.ts`);
    fs.writeFileSync(historyFile, testCode);

    try {
        const headlessFlag = options.headless ? '' : '--headed'; // Use --headed only if NOT headless
        const output = execSync(`npx playwright test ${tempFile} ${headlessFlag}`, {
            encoding: 'utf8',
            env: { ...process.env, BASE_URL: options.url }
        });

        return {
            success: true,
            output: output
        };
    } catch (error: any) {
        const screenshotName = `failure-${timestamp}.png`;
        const screenshotPath = path.join(evidenceDir, screenshotName);

        // Playwright captures screenshots automatically if configured, 
        // but here we might need to handle it or rely on the test code itself.

        return {
            success: false,
            output: error.stdout || '',
            error: error.stderr || error.message,
            screenshotPath: screenshotPath
        };
    }
}
