#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk').default;
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

// Import QA modules
const ContentValidator = require('./content-validator');
const PerformanceAuditor = require('./performance-auditor');
const AccessibilityTester = require('./accessibility-tester');
const VisualTester = require('./visual-tester');
const CompetitorAnalyzer = require('./competitor-analysis');

class QARunner {
    constructor() {
        this.config = null;
        this.projectConfig = null;
        this.results = {
            content: {},
            performance: {},
            accessibility: {},
            visual: {},
            competitor: {}
        };
    }

    async initialize() {
        const spinner = ora('Loading QA configuration...').start();
        
        try {
            this.config = await fs.readJson('./config/qa-config.json');
            this.projectConfig = await fs.readJson('./config/project-config.json');
            spinner.succeed('QA configuration loaded');
        } catch (error) {
            spinner.fail('Failed to load configuration');
            console.error(chalk.red('Error loading configuration:'), error.message);
            process.exit(1);
        }
    }

    async runContentValidation() {
        const spinner = ora('Running content validation...').start();
        
        try {
            const validator = new ContentValidator(this.config, this.projectConfig);
            this.results.content = await validator.validateAllPages();
            spinner.succeed('Content validation completed');
            return this.results.content;
        } catch (error) {
            spinner.fail('Content validation failed');
            console.error(chalk.red('Content validation error:'), error.message);
            return { error: error.message };
        }
    }

    async runPerformanceAudit() {
        const spinner = ora('Running performance audit...').start();
        
        try {
            const auditor = new PerformanceAuditor(this.config, this.projectConfig);
            this.results.performance = await auditor.auditAllPages();
            spinner.succeed('Performance audit completed');
            return this.results.performance;
        } catch (error) {
            spinner.fail('Performance audit failed');
            console.error(chalk.red('Performance audit error:'), error.message);
            return { error: error.message };
        }
    }

    async runAccessibilityTest() {
        const spinner = ora('Running accessibility tests...').start();
        
        try {
            const tester = new AccessibilityTester(this.config, this.projectConfig);
            this.results.accessibility = await tester.testAllPages();
            spinner.succeed('Accessibility tests completed');
            return this.results.accessibility;
        } catch (error) {
            spinner.fail('Accessibility tests failed');
            console.error(chalk.red('Accessibility test error:'), error.message);
            return { error: error.message };
        }
    }

    async runVisualTests() {
        const spinner = ora('Running visual regression tests...').start();
        
        try {
            const tester = new VisualTester(this.config, this.projectConfig);
            this.results.visual = await tester.testAllPages();
            spinner.succeed('Visual tests completed');
            return this.results.visual;
        } catch (error) {
            spinner.fail('Visual tests failed');
            console.error(chalk.red('Visual test error:'), error.message);
            return { error: error.message };
        }
    }

    async runCompetitorAnalysis() {
        const spinner = ora('Running competitor analysis...').start();
        
        try {
            const analyzer = new CompetitorAnalyzer(this.config, this.projectConfig);
            this.results.competitor = await analyzer.analyzeCompetitors();
            spinner.succeed('Competitor analysis completed');
            return this.results.competitor;
        } catch (error) {
            spinner.fail('Competitor analysis failed');
            console.error(chalk.red('Competitor analysis error:'), error.message);
            return { error: error.message };
        }
    }

    async runAllTests() {
        console.log(chalk.blue.bold('\n🚀 Starting comprehensive QA suite for Salesforce Consultants\n'));
        
        await this.initialize();
        
        const tests = [
            { name: 'Content Validation', fn: () => this.runContentValidation() },
            { name: 'Performance Audit', fn: () => this.runPerformanceAudit() },
            { name: 'Accessibility Tests', fn: () => this.runAccessibilityTest() },
            { name: 'Visual Regression Tests', fn: () => this.runVisualTests() },
            { name: 'Competitor Analysis', fn: () => this.runCompetitorAnalysis() }
        ];

        for (const test of tests) {
            console.log(chalk.cyan(`\n📋 Running ${test.name}...`));
            await test.fn();
        }

        await this.generateReport();
    }

    async generateReport() {
        const spinner = ora('Generating QA report...').start();
        
        try {
            const report = {
                timestamp: new Date().toISOString(),
                project: this.projectConfig.projectName,
                siteUrl: this.projectConfig.siteUrl,
                results: this.results,
                summary: this.generateSummary()
            };

            const reportPath = './qa-report.json';
            await fs.writeJson(reportPath, report, { spaces: 2 });
            
            spinner.succeed('QA report generated');
            console.log(chalk.green(`\n📊 Report saved to: ${reportPath}`));
            
            this.displaySummary(report.summary);
        } catch (error) {
            spinner.fail('Failed to generate report');
            console.error(chalk.red('Report generation error:'), error.message);
        }
    }

    generateSummary() {
        const summary = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0,
            criticalIssues: 0
        };

        // Count results from each test type
        Object.values(this.results).forEach(result => {
            if (result && typeof result === 'object') {
                if (result.totalTests) summary.totalTests += result.totalTests;
                if (result.passedTests) summary.passedTests += result.passedTests;
                if (result.failedTests) summary.failedTests += result.failedTests;
                if (result.warnings) summary.warnings += result.warnings;
                if (result.criticalIssues) summary.criticalIssues += result.criticalIssues;
            }
        });

        return summary;
    }

    displaySummary(summary) {
        console.log(chalk.blue.bold('\n📈 QA Summary'));
        console.log(chalk.gray('─'.repeat(50)));
        
        console.log(`Total Tests: ${chalk.white(summary.totalTests)}`);
        console.log(`Passed: ${chalk.green(summary.passedTests)}`);
        console.log(`Failed: ${chalk.red(summary.failedTests)}`);
        console.log(`Warnings: ${chalk.yellow(summary.warnings)}`);
        console.log(`Critical Issues: ${chalk.red(summary.criticalIssues)}`);
        
        const passRate = summary.totalTests > 0 ? (summary.passedTests / summary.totalTests * 100).toFixed(1) : 0;
        console.log(`Pass Rate: ${chalk.cyan(passRate)}%`);
        
        if (summary.criticalIssues > 0) {
            console.log(chalk.red.bold('\n⚠️  Critical issues found! Please address before deployment.'));
        } else if (summary.failedTests > 0) {
            console.log(chalk.yellow.bold('\n⚠️  Some tests failed. Review the report for details.'));
        } else {
            console.log(chalk.green.bold('\n✅ All tests passed! Ready for deployment.'));
        }
    }
}

// CLI setup
program
    .name('qa-runner')
    .description('Zero Barriers QA Suite for Salesforce Consultants')
    .version('1.0.0');

program
    .command('all')
    .description('Run all QA tests')
    .action(async () => {
        const runner = new QARunner();
        await runner.runAllTests();
    });

program
    .command('content')
    .description('Run content validation only')
    .action(async () => {
        const runner = new QARunner();
        await runner.initialize();
        await runner.runContentValidation();
        await runner.generateReport();
    });

program
    .command('performance')
    .description('Run performance audit only')
    .action(async () => {
        const runner = new QARunner();
        await runner.initialize();
        await runner.runPerformanceAudit();
        await runner.generateReport();
    });

program
    .command('accessibility')
    .description('Run accessibility tests only')
    .action(async () => {
        const runner = new QARunner();
        await runner.initialize();
        await runner.runAccessibilityTest();
        await runner.generateReport();
    });

program
    .command('visual')
    .description('Run visual regression tests only')
    .action(async () => {
        const runner = new QARunner();
        await runner.initialize();
        await runner.runVisualTests();
        await runner.generateReport();
    });

program
    .command('competitor')
    .description('Run competitor analysis only')
    .action(async () => {
        const runner = new QARunner();
        await runner.initialize();
        await runner.runCompetitorAnalysis();
        await runner.generateReport();
    });

// Handle legacy --all flag
if (process.argv.includes('--all')) {
    const runner = new QARunner();
    runner.runAllTests();
} else if (process.argv.includes('--content')) {
    const runner = new QARunner();
    runner.initialize().then(() => runner.runContentValidation()).then(() => runner.generateReport());
} else if (process.argv.includes('--performance')) {
    const runner = new QARunner();
    runner.initialize().then(() => runner.runPerformanceAudit()).then(() => runner.generateReport());
} else if (process.argv.includes('--accessibility')) {
    const runner = new QARunner();
    runner.initialize().then(() => runner.runAccessibilityTest()).then(() => runner.generateReport());
} else if (process.argv.includes('--visual')) {
    const runner = new QARunner();
    runner.initialize().then(() => runner.runVisualTests()).then(() => runner.generateReport());
} else {
    program.parse();
} 