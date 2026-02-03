import { chromium, type Page, type Browser } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export interface AccessibilityNode {
    role: string;
    name: string;
    description?: string;
    selector?: string;
    children?: AccessibilityNode[];
}

export interface ProjectContext {
    baseUrl: string;
    accessibilityTree: AccessibilityNode[];
    exampleTests: string;
}

export async function detectProjectUrl(): Promise<string> {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (existsSync(packageJsonPath)) {
        const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        const scripts = pkg.scripts || {};

        // Priority: dev > start > serve
        const scriptsToScan = ['dev', 'start', 'serve'];
        for (const scriptName of scriptsToScan) {
            const script = scripts[scriptName];
            if (script) {
                const portMatch = script.match(/--port\s+(\d+)|-p\s+(\d+)/);
                const port = portMatch ? (portMatch[1] || portMatch[2]) : '3000';
                return `http://localhost:${port}`;
            }
        }
    }
    return 'http://localhost:3000'; // Default
}

export async function extractAccessibilityTree(url: string, headless = true): Promise<AccessibilityNode[]> {
    const browser = await chromium.launch({ headless });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Wait a bit for slow sites like example.com
        await page.waitForTimeout(1000);

        let snapshot = null;
        try {
            snapshot = await (page as any).accessibility?.snapshot();
        } catch (e) {
            console.warn('⚠️ Playwright accessibility snapshot failed, falling back to empty tree.');
        }

        if (!snapshot) return [];

        // Recursive cleaner to filter and map tree
        const cleanNode = (node: any): AccessibilityNode | null => {
            if (!node) return null;

            const interactiveRoles = ['button', 'link', 'textbox', 'checkbox', 'searchbox', 'menuitem', 'tab', 'combobox', 'listbox'];
            const isInteresting = interactiveRoles.includes(node.role) || (node.children && node.children.length > 0);

            if (!isInteresting) return null;

            return {
                role: node.role,
                name: node.name,
                description: node.description,
                children: node.children ? node.children.map(cleanNode).filter(Boolean) as AccessibilityNode[] : undefined
            };
        };

        return snapshot ? (snapshot.children?.map(cleanNode).filter(Boolean) as AccessibilityNode[]) : [];
    } finally {
        await browser.close();
    }
}

export async function loadExampleTests(): Promise<string> {
    const testsDir = path.join(process.cwd(), 'auto-qa', 'tests');
    if (!existsSync(testsDir)) return '';

    // Implementation for loading few-shot examples could go here
    return '';
}

export async function loadContext(urlOverride?: string): Promise<ProjectContext> {
    const baseUrl = urlOverride || await detectProjectUrl();
    const accessibilityTree = await extractAccessibilityTree(baseUrl);
    const exampleTests = await loadExampleTests();

    return {
        baseUrl,
        accessibilityTree,
        exampleTests
    };
}
