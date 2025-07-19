const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const chalk = require('chalk').default;

class PerformanceAuditor {
    constructor(config, projectConfig) {
        this.config = config;
        this.projectConfig = projectConfig;
        this.browser = null;
        this.results = {
            pages: {},
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0,
            criticalIssues: 0
        };
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: this.config.puppeteer.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async auditAllPages() {
        console.log(chalk.blue('⚡ Starting performance audit...'));
        
        await this.initialize();
        
        const pages = this.projectConfig.pages;
        const results = {
            pages: {},
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0,
            criticalIssues: 0,
            summary: {}
        };

        for (const pagePath of pages) {
            const fullUrl = `${this.projectConfig.siteUrl}${pagePath}`;
            console.log(chalk.cyan(`\n📊 Auditing ${pagePath}`));
            
            try {
                const audit = await this.auditPage(fullUrl, pagePath);
                results.pages[pagePath] = audit;
                results.totalTests += audit.totalTests || 0;
                results.passedTests += audit.passedTests || 0;
                results.failedTests += audit.failedTests || 0;
                results.warnings += audit.warnings || 0;
                if (audit.criticalIssues) results.criticalIssues += audit.criticalIssues;
            } catch (error) {
                console.error(chalk.red(`Error auditing ${pagePath}:`), error.message);
                results.pages[pagePath] = { error: error.message };
            }
        }

        // Generate summary
        results.summary = this.generateSummary(results.pages);

        await this.browser.close();
        
        this.results = results;
        this.displayResults(results);
        
        return results;
    }

    async auditPage(url, pagePath) {
        const audit = {
            url,
            pagePath,
            timestamp: new Date().toISOString(),
            lighthouse: {},
            puppeteer: {},
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0,
            criticalIssues: 0,
            issues: []
        };

        try {
            // Lighthouse audit
            audit.lighthouse = await this.runLighthouseAudit(url);
            
            // Puppeteer performance metrics
            audit.puppeteer = await this.runPuppeteerAudit(url);

            // Count test results
            this.countAuditResults(audit);

        } catch (error) {
            audit.error = error.message;
            audit.criticalIssues = 1;
        }

        return audit;
    }

    async runLighthouseAudit(url) {
        const lighthouseResults = {
            performance: 0,
            accessibility: 0,
            bestPractices: 0,
            seo: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            totalBlockingTime: 0,
            speedIndex: 0,
            timeToInteractive: 0,
            issues: []
        };

        try {
            const chrome = await chromeLauncher.launch({ 
                chromeFlags: ['--headless', '--no-sandbox'] 
            });
            
            const options = {
                logLevel: 'info',
                output: 'json',
                onlyCategories: this.config.lighthouse.categories,
                port: chrome.port,
                throttling: {
                    rttMs: 40,
                    throughputKbps: 10240,
                    cpuSlowdownMultiplier: 1,
                    requestLatencyMs: 0,
                    downloadThroughputKbps: 0,
                    uploadThroughputKbps: 0
                }
            };

            const runnerResult = await lighthouse(url, options);
            const report = JSON.parse(runnerResult.report);
            
            // Extract scores
            lighthouseResults.performance = Math.round(report.categories.performance.score * 100);
            lighthouseResults.accessibility = Math.round(report.categories.accessibility.score * 100);
            lighthouseResults.bestPractices = Math.round(report.categories['best-practices'].score * 100);
            lighthouseResults.seo = Math.round(report.categories.seo.score * 100);

            // Extract Core Web Vitals
            lighthouseResults.firstContentfulPaint = report.audits['first-contentful-paint'].numericValue;
            lighthouseResults.largestContentfulPaint = report.audits['largest-contentful-paint'].numericValue;
            lighthouseResults.cumulativeLayoutShift = report.audits['cumulative-layout-shift'].numericValue;
            lighthouseResults.totalBlockingTime = report.audits['total-blocking-time'].numericValue;
            lighthouseResults.speedIndex = report.audits['speed-index'].numericValue;
            lighthouseResults.timeToInteractive = report.audits['interactive'].numericValue;

            // Check for issues
            if (lighthouseResults.performance < this.config.lighthouse.performance) {
                lighthouseResults.issues.push(`Performance score too low: ${lighthouseResults.performance}%`);
            }
            if (lighthouseResults.accessibility < this.config.lighthouse.accessibility) {
                lighthouseResults.issues.push(`Accessibility score too low: ${lighthouseResults.accessibility}%`);
            }
            if (lighthouseResults.bestPractices < this.config.lighthouse.bestPractices) {
                lighthouseResults.issues.push(`Best practices score too low: ${lighthouseResults.bestPractices}%`);
            }
            if (lighthouseResults.seo < this.config.lighthouse.seo) {
                lighthouseResults.issues.push(`SEO score too low: ${lighthouseResults.seo}%`);
            }

            await chrome.kill();

        } catch (error) {
            lighthouseResults.error = error.message;
        }

        return lighthouseResults;
    }

    async runPuppeteerAudit(url) {
        const puppeteerResults = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            resourceCount: 0,
            resourceSize: 0,
            issues: []
        };

        try {
            const page = await this.browser.newPage();
            await page.setViewport(this.config.puppeteer.viewport);
            
            // Enable performance monitoring
            await page.setCacheEnabled(false);
            
            const startTime = Date.now();
            await page.goto(url, { 
                waitUntil: this.config.puppeteer.waitUntil, 
                timeout: this.config.puppeteer.timeout 
            });
            const loadTime = Date.now() - startTime;
            
            // Get performance metrics
            const metrics = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                const firstPaint = paint.find(entry => entry.name === 'first-paint');
                const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint');
                
                const resources = performance.getEntriesByType('resource');
                const resourceSize = resources.reduce((total, resource) => total + resource.transferSize, 0);
                
                return {
                    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    firstPaint: firstPaint ? firstPaint.startTime : 0,
                    firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : 0,
                    resourceCount: resources.length,
                    resourceSize
                };
            });

            Object.assign(puppeteerResults, metrics);
            puppeteerResults.loadTime = loadTime;

            // Check for performance issues
            if (loadTime > this.config.performance.maxLoadTime) {
                puppeteerResults.issues.push(`Load time too slow: ${loadTime}ms`);
            }
            if (metrics.firstContentfulPaint > this.config.performance.maxFirstContentfulPaint) {
                puppeteerResults.issues.push(`First Contentful Paint too slow: ${metrics.firstContentfulPaint}ms`);
            }
            if (metrics.resourceSize > 5000000) { // 5MB
                puppeteerResults.issues.push(`Page size too large: ${(metrics.resourceSize / 1000000).toFixed(2)}MB`);
            }

            await page.close();

        } catch (error) {
            puppeteerResults.error = error.message;
        }

        return puppeteerResults;
    }

    countAuditResults(audit) {
        let total = 0;
        let passed = 0;
        let failed = 0;
        let warnings = 0;
        let critical = 0;

        // Lighthouse tests
        if (audit.lighthouse.performance !== undefined) {
            total += 4; // performance, accessibility, best practices, seo
            
            if (audit.lighthouse.performance >= this.config.lighthouse.performance) passed++;
            else failed++;
            
            if (audit.lighthouse.accessibility >= this.config.lighthouse.accessibility) passed++;
            else failed++;
            
            if (audit.lighthouse.bestPractices >= this.config.lighthouse.bestPractices) passed++;
            else failed++;
            
            if (audit.lighthouse.seo >= this.config.lighthouse.seo) passed++;
            else failed++;
        }

        // Core Web Vitals tests
        if (audit.lighthouse.firstContentfulPaint !== undefined) {
            total += 3; // FCP, LCP, CLS
            
            if (audit.lighthouse.firstContentfulPaint <= this.config.performance.maxFirstContentfulPaint) passed++;
            else failed++;
            
            if (audit.lighthouse.largestContentfulPaint <= this.config.performance.maxLargestContentfulPaint) passed++;
            else failed++;
            
            if (audit.lighthouse.cumulativeLayoutShift <= this.config.performance.maxCumulativeLayoutShift) passed++;
            else failed++;
        }

        // Puppeteer tests
        if (audit.puppeteer.loadTime !== undefined) {
            total += 1;
            if (audit.puppeteer.loadTime <= this.config.performance.maxLoadTime) passed++;
            else failed++;
        }

        // Count issues
        const allIssues = [
            ...(audit.lighthouse.issues || []),
            ...(audit.puppeteer.issues || [])
        ];

        warnings = allIssues.filter(issue => 
            issue.includes('too slow') || issue.includes('too large')
        ).length;
        
        critical = allIssues.filter(issue => 
            issue.includes('score too low')
        ).length;

        audit.totalTests = total;
        audit.passedTests = passed;
        audit.failedTests = failed;
        audit.warnings = warnings;
        audit.criticalIssues = critical;
    }

    generateSummary(pages) {
        const summary = {
            averagePerformance: 0,
            averageAccessibility: 0,
            averageBestPractices: 0,
            averageSEO: 0,
            averageLoadTime: 0,
            slowestPage: null,
            fastestPage: null,
            issues: []
        };

        const validPages = Object.values(pages).filter(page => !page.error);
        
        if (validPages.length === 0) return summary;

        // Calculate averages
        const performanceScores = validPages.map(page => page.lighthouse.performance).filter(Boolean);
        const accessibilityScores = validPages.map(page => page.lighthouse.accessibility).filter(Boolean);
        const bestPracticesScores = validPages.map(page => page.lighthouse.bestPractices).filter(Boolean);
        const seoScores = validPages.map(page => page.lighthouse.seo).filter(Boolean);
        const loadTimes = validPages.map(page => page.puppeteer.loadTime).filter(Boolean);

        summary.averagePerformance = performanceScores.length > 0 ? 
            performanceScores.reduce((a, b) => a + b, 0) / performanceScores.length : 0;
        summary.averageAccessibility = accessibilityScores.length > 0 ? 
            accessibilityScores.reduce((a, b) => a + b, 0) / accessibilityScores.length : 0;
        summary.averageBestPractices = bestPracticesScores.length > 0 ? 
            bestPracticesScores.reduce((a, b) => a + b, 0) / bestPracticesScores.length : 0;
        summary.averageSEO = seoScores.length > 0 ? 
            seoScores.reduce((a, b) => a + b, 0) / seoScores.length : 0;
        summary.averageLoadTime = loadTimes.length > 0 ? 
            loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0;

        // Find slowest and fastest pages
        if (loadTimes.length > 0) {
            const maxLoadTime = Math.max(...loadTimes);
            const minLoadTime = Math.min(...loadTimes);
            
            summary.slowestPage = Object.entries(pages).find(([path, page]) => 
                page.puppeteer?.loadTime === maxLoadTime
            )?.[0];
            
            summary.fastestPage = Object.entries(pages).find(([path, page]) => 
                page.puppeteer?.loadTime === minLoadTime
            )?.[0];
        }

        // Collect common issues
        const allIssues = validPages.flatMap(page => [
            ...(page.lighthouse.issues || []),
            ...(page.puppeteer.issues || [])
        ]);

        const issueCounts = {};
        allIssues.forEach(issue => {
            issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        });

        summary.issues = Object.entries(issueCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([issue, count]) => ({ issue, count }));

        return summary;
    }

    displayResults(results) {
        console.log(chalk.blue.bold('\n⚡ Performance Audit Results'));
        console.log(chalk.gray('─'.repeat(50)));

        Object.entries(results.pages).forEach(([pagePath, audit]) => {
            if (audit.error) {
                console.log(chalk.red(`❌ ${pagePath}: ${audit.error}`));
                return;
            }

            const status = audit.criticalIssues > 0 ? '🔴' : 
                          audit.failedTests > 0 ? '🟡' : '🟢';
            
            console.log(chalk.cyan(`\n${status} ${pagePath}`));
            
            if (audit.lighthouse) {
                console.log(`   Performance: ${audit.lighthouse.performance}%`);
                console.log(`   Accessibility: ${audit.lighthouse.accessibility}%`);
                console.log(`   Best Practices: ${audit.lighthouse.bestPractices}%`);
                console.log(`   SEO: ${audit.lighthouse.seo}%`);
            }
            
            if (audit.puppeteer) {
                console.log(`   Load Time: ${audit.puppeteer.loadTime}ms`);
                console.log(`   FCP: ${audit.lighthouse.firstContentfulPaint}ms`);
                console.log(`   LCP: ${audit.lighthouse.largestContentfulPaint}ms`);
            }
            
            console.log(`   Tests: ${audit.passedTests}/${audit.totalTests} passed`);
        });

        // Summary
        if (results.summary) {
            console.log(chalk.blue.bold('\n📊 Performance Summary'));
            console.log(chalk.gray('─'.repeat(30)));
            console.log(`Average Performance: ${results.summary.averagePerformance.toFixed(1)}%`);
            console.log(`Average Accessibility: ${results.summary.averageAccessibility.toFixed(1)}%`);
            console.log(`Average Best Practices: ${results.summary.averageBestPractices.toFixed(1)}%`);
            console.log(`Average SEO: ${results.summary.averageSEO.toFixed(1)}%`);
            console.log(`Average Load Time: ${results.summary.averageLoadTime.toFixed(0)}ms`);
            
            if (results.summary.slowestPage) {
                console.log(`Slowest Page: ${results.summary.slowestPage}`);
            }
            if (results.summary.fastestPage) {
                console.log(`Fastest Page: ${results.summary.fastestPage}`);
            }
        }

        // Overall summary
        console.log(chalk.blue.bold('\n📋 Audit Summary'));
        console.log(chalk.gray('─'.repeat(30)));
        console.log(`Total Pages: ${Object.keys(results.pages).length}`);
        console.log(`Total Tests: ${results.totalTests}`);
        console.log(`Passed: ${chalk.green(results.passedTests)}`);
        console.log(`Failed: ${chalk.red(results.failedTests)}`);
        console.log(`Warnings: ${chalk.yellow(results.warnings)}`);
        console.log(`Critical Issues: ${chalk.red(results.criticalIssues)}`);
        
        const passRate = results.totalTests > 0 ? (results.passedTests / results.totalTests * 100).toFixed(1) : 0;
        console.log(`Pass Rate: ${chalk.cyan(passRate)}%`);
    }
}

module.exports = PerformanceAuditor; 