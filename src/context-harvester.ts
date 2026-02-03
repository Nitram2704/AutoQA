import { chromium, type Page, type Browser } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export interface AccessibilityNode {
    role: string;
    name: string;
    description?: string;
    selector?: string;
    attributes?: Record<string, string>;
    children?: AccessibilityNode[];
}

export interface ProjectContext {
    baseUrl: string;
    elements: AccessibilityNode[]; // Renamed from accessibilityTree for clarity
    exampleTests: string;
}

export async function detectProjectUrl(): Promise<string> {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (existsSync(packageJsonPath)) {
        const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        const scripts = pkg.scripts || {};

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
    return 'http://localhost:3000';
}

export async function extractHybridContext(url: string, headless = true): Promise<AccessibilityNode[]> {
    const browser = await chromium.launch({
        headless,
        args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    try {
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
            page.goto(url, { waitUntil: 'load', timeout: 30000 })
        );

        await page.waitForTimeout(2000);

        // 1. Accessibility Snapshot with error handling from remote
        let snapshot = null;
        try {
            snapshot = await (page as any).accessibility?.snapshot();
        } catch (e) {
            console.warn('⚠️ Playwright accessibility snapshot failed, falling back to DOM hints.');
        }

        // 2. DOM-based Interactive Element Discovery
        const domElements = await page.evaluate(() => {
            const interactiveSelectors = [
                'button', 'a[href]', 'input', 'select', 'textarea',
                '[role="button"]', '[role="link"]', '[role="checkbox"]',
                '[role="menuitem"]', '[role="tab"]', '[onclick]',
                '.btn', '.button', 'button-container'
            ];

            const elements = document.querySelectorAll(interactiveSelectors.join(','));
            return Array.from(elements).map((el: any) => {
                const rect = el.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return null;

                const attrs: Record<string, string> = {};
                if (el.id) attrs.id = el.id;
                if (el.className) attrs.class = typeof el.className === 'string' ? el.className : '';
                if (el.getAttribute('placeholder')) attrs.placeholder = el.getAttribute('placeholder')!;
                if (el.getAttribute('data-testid')) attrs.testid = el.getAttribute('data-testid')!;
                if (el.getAttribute('aria-label')) attrs.ariaLabel = el.getAttribute('aria-label')!;

                return {
                    role: el.tagName.toLowerCase(),
                    name: el.textContent?.trim().substring(0, 50) || el.getAttribute('aria-label') || '',
                    attributes: attrs,
                    isVisible: true
                };
            }).filter(Boolean);
        });

        const cleanNode = (node: any): AccessibilityNode | null => {
            if (!node) return null;

            const interactiveRoles = [
                'button', 'link', 'textbox', 'checkbox', 'searchbox',
                'menuitem', 'tab', 'combobox', 'listbox', 'gridcell',
                'row', 'cell', 'listitem', 'img', 'heading', 'dialog', 'alert'
            ];

            const isInteresting = node.name || interactiveRoles.includes(node.role);
            if (!isInteresting && (!node.children || node.children.length === 0)) return null;

            return {
                role: node.role,
                name: node.name,
                description: node.description,
                children: node.children ? node.children.map(cleanNode).filter(Boolean) as AccessibilityNode[] : undefined
            };
        };

        const accessibilityTree = snapshot?.children?.map(cleanNode).filter(Boolean) as AccessibilityNode[] || [];

        const finalContext = [...accessibilityTree];

        if (domElements.length > 0) {
            finalContext.push({
                role: 'complementary_context',
                name: 'DOM_INTERACTIVE_ELEMENTS',
                description: 'Interactive elements found by scanning the DOM structure',
                children: domElements as any[]
            });
        }

        return finalContext;
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
    const elements = await extractHybridContext(baseUrl);
    const exampleTests = await loadExampleTests();

    return {
        baseUrl,
        elements,
        exampleTests
    };
}
