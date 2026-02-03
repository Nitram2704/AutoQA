#!/usr/bin/env node
import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { loadContext } from './context-harvester.js';
import { generatePlaywrightTest } from './llm-client.js';
import { runPlaywrightTest } from './runner.js';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
    .name('auto-qa')
    .description('AI-powered E2E test generator and runner')
    .argument('<prompt>', 'Natural language instruction for the test')
    .option('--url <url>', 'Target URL (overrides package.json detection)')
    .option('--headless', 'Run browser in headless mode', false)
    .option('--dry-run', 'Generate test only, do not execute', false)
    .option('--retry <number>', 'Maximum retry attempts', '3')
    .action(async (prompt, options) => {
        const spinner = ora().start();
        let currentRetry = 0;
        const maxRetries = parseInt(options.retry, 10);
        let previousError: string | undefined;

        try {
            spinner.text = chalk.blue('🔍 Scanning app context...');
            const context = await loadContext(options.url);
            const totalElements = context.elements.reduce((acc, el) => acc + (el.children?.length || 0) + 1, 0);
            spinner.succeed(chalk.green(`Found context at ${context.baseUrl} (${totalElements} potential interactive points)`));

            while (currentRetry < maxRetries) {
                spinner.start(chalk.blue(currentRetry > 0 ? `🔄 Retrying (Attempt ${currentRetry + 1}/${maxRetries})...` : '🤖 Generating test plan...'));

                try {
                    const testContent = await generatePlaywrightTest(prompt, context, previousError);
                    spinner.succeed(chalk.green('Test generated successfully!'));

                    if (testContent.thought) {
                        console.log(chalk.cyan(`\n🧠 AI Thought: ${testContent.thought}\n`));
                    }

                    if (options.dryRun) {
                        console.log(chalk.yellow('\n🧪 DRY-RUN MODE: Generated Script:\n'));
                        console.log(chalk.gray('─'.repeat(50)));
                        console.log(testContent.fullScript);
                        console.log(chalk.gray('─'.repeat(50)));
                        return;
                    }

                    spinner.start(chalk.blue(currentRetry > 0 ? '🔄 Attempting to self-heal...' : '🚀 Running test...'));
                    const result = await runPlaywrightTest(testContent.fullScript, {
                        headless: options.headless,
                        url: context.baseUrl
                    });

                    if (result.success) {
                        spinner.succeed(chalk.green('Test passed! ✨'));
                        console.log(chalk.gray(result.output));
                        return;
                    } else {
                        spinner.fail(chalk.red('Test failed.'));
                        console.error(chalk.yellow(`\n❌ Error Detail:\n${result.error}\n`));
                        previousError = result.error;
                        currentRetry++;

                        if (currentRetry >= maxRetries) {
                            console.log(chalk.red('\n❌ Max retries reached. Implementation failed.'));
                            process.exit(1);
                        }
                    }
                } catch (e: any) {
                    spinner.fail(chalk.red('Error during generation or execution.'));
                    console.error(e.message);
                    currentRetry++;
                }
            }
        } catch (err: any) {
            spinner.fail(chalk.red('Initialization error.'));
            console.error(err.message);
            process.exit(1);
        }
    });

program.parse(process.argv);
