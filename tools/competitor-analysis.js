const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const cheerio = require('cheerio');
const axios = require('axios');
const chalk = require('chalk').default;
const fs = require('fs-extra');

class CompetitorAnalyzer {
    constructor(config, projectConfig) {
        this.config = config;
        this.projectConfig = projectConfig;
        this.browser = null;
        this.results = {
            competitors: {},
            comparison: {},
            recommendations: []
        };
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: this.config.puppeteer.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async analyzeCompetitors() {
        console.log(chalk.blue('🔍 Starting competitor analysis...'));
        
        await this.initialize();
        
        const competitors = this.projectConfig.competitors;
        const results = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0,
            criticalIssues: 0,
            competitors: {},
            comparison: {},
            recommendations: []
        };

        for (const competitor of competitors) {
            console.log(chalk.cyan(`\n📊 Analyzing ${competitor.name} (${competitor.url})`));
            
            try {
                const analysis = await this.analyzeCompetitor(competitor);
                results.competitors[competitor.name] = analysis;
                results.totalTests += analysis.totalTests || 0;
                results.passedTests += analysis.passedTests || 0;
                results.failedTests += analysis.failedTests || 0;
                results.warnings += analysis.warnings || 0;
            } catch (error) {
                console.error(chalk.red(`Error analyzing ${competitor.name}:`), error.message);
                results.competitors[competitor.name] = { error: error.message };
            }
        }

        // Generate comparison and recommendations
        results.comparison = await this.generateComparison(results.competitors);
        results.recommendations = this.generateRecommendations(results.competitors);

        await this.browser.close();
        
        this.results = results;
        this.displayResults(results);
        
        return results;
    }

    async analyzeCompetitor(competitor) {
        const analysis = {
            name: competitor.name,
            url: competitor.url,
            focus: competitor.focus,
            timestamp: new Date().toISOString(),
            performance: {},
            content: {},
            seo: {},
            accessibility: {},
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0
        };

        try {
            // Performance analysis
            analysis.performance = await this.analyzePerformance(competitor.url);
            
            // Content analysis
            analysis.content = await this.analyzeContent(competitor.url);
            
            // SEO analysis
            analysis.seo = await this.analyzeSEO(competitor.url);
            
            // Accessibility analysis
            analysis.accessibility = await this.analyzeAccessibility(competitor.url);

            // Count test results
            this.countTestResults(analysis);

        } catch (error) {
            analysis.error = error.message;
        }

        return analysis;
    }

    async analyzePerformance(url) {
        const performance = {
            lighthouse: {},
            loadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0
        };

        try {
            // Lighthouse audit
            const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
            const options = {
                logLevel: 'info',
                output: 'json',
                onlyCategories: ['performance'],
                port: chrome.port
            };

            const runnerResult = await lighthouse(url, options);
            const report = JSON.parse(runnerResult.report);
            
            performance.lighthouse = {
                performance: Math.round(report.categories.performance.score * 100),
                firstContentfulPaint: report.audits['first-contentful-paint'].numericValue,
                largestContentfulPaint: report.audits['largest-contentful-paint'].numericValue,
                cumulativeLayoutShift: report.audits['cumulative-layout-shift'].numericValue,
                totalBlockingTime: report.audits['total-blocking-time'].numericValue
            };

            await chrome.kill();

            // Puppeteer performance metrics
            const page = await this.browser.newPage();
            await page.setViewport(this.config.puppeteer.viewport);
            
            const startTime = Date.now();
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            const loadTime = Date.now() - startTime;
            
            const metrics = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                return {
                    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
                };
            });

            performance.loadTime = loadTime;
            performance.domMetrics = metrics;

            await page.close();

        } catch (error) {
            performance.error = error.message;
        }

        return performance;
    }

    async analyzeContent(url) {
        const content = {
            title: '',
            description: '',
            headings: [],
            wordCount: 0,
            images: 0,
            links: 0,
            forms: 0,
            ctaButtons: 0
        };

        try {
            const page = await this.browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            const contentData = await page.evaluate(() => {
                const title = document.title;
                const description = document.querySelector('meta[name="description"]')?.content || '';
                const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
                    .map(h => ({ level: h.tagName, text: h.textContent.trim() }));
                const wordCount = document.body.textContent.trim().split(/\s+/).length;
                const images = document.querySelectorAll('img').length;
                const links = document.querySelectorAll('a').length;
                const forms = document.querySelectorAll('form').length;
                const ctaButtons = document.querySelectorAll('button, .btn, .cta, [class*="button"]').length;

                return {
                    title,
                    description,
                    headings,
                    wordCount,
                    images,
                    links,
                    forms,
                    ctaButtons
                };
            });

            Object.assign(content, contentData);
            await page.close();

        } catch (error) {
            content.error = error.message;
        }

        return content;
    }

    async analyzeSEO(url) {
        const seo = {
            metaTags: {},
            openGraph: {},
            twitter: {},
            structuredData: [],
            ssl: false,
            mobileFriendly: false
        };

        try {
            const page = await this.browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            const seoData = await page.evaluate(() => {
                const metaTags = {};
                document.querySelectorAll('meta').forEach(meta => {
                    const name = meta.getAttribute('name') || meta.getAttribute('property');
                    if (name) {
                        metaTags[name] = meta.getAttribute('content');
                    }
                });

                const openGraph = {};
                document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
                    const property = meta.getAttribute('property');
                    openGraph[property] = meta.getAttribute('content');
                });

                const twitter = {};
                document.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
                    const name = meta.getAttribute('name');
                    twitter[name] = meta.getAttribute('content');
                });

                const structuredData = [];
                document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
                    try {
                        structuredData.push(JSON.parse(script.textContent));
                    } catch (e) {
                        // Invalid JSON
                    }
                });

                const ssl = location.protocol === 'https:';
                const mobileFriendly = window.innerWidth <= 768;

                return {
                    metaTags,
                    openGraph,
                    twitter,
                    structuredData,
                    ssl,
                    mobileFriendly
                };
            });

            Object.assign(seo, seoData);
            await page.close();

        } catch (error) {
            seo.error = error.message;
        }

        return seo;
    }

    async analyzeAccessibility(url) {
        const accessibility = {
            axeResults: {},
            colorContrast: [],
            keyboardNavigation: false,
            screenReader: false
        };

        try {
            const page = await this.browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Basic accessibility checks
            const a11yData = await page.evaluate(() => {
                const issues = [];
                
                // Check for alt text on images
                document.querySelectorAll('img').forEach(img => {
                    if (!img.alt && !img.getAttribute('aria-label')) {
                        issues.push('Image missing alt text');
                    }
                });

                // Check for form labels
                document.querySelectorAll('input, select, textarea').forEach(input => {
                    if (!input.labels.length && !input.getAttribute('aria-label')) {
                        issues.push('Form control missing label');
                    }
                });

                // Check for heading structure
                const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                let previousLevel = 0;
                headings.forEach(heading => {
                    const level = parseInt(heading.tagName.charAt(1));
                    if (level > previousLevel + 1) {
                        issues.push('Heading structure skipped levels');
                    }
                    previousLevel = level;
                });

                // Check for language attribute
                if (!document.documentElement.lang) {
                    issues.push('Missing language attribute');
                }

                return {
                    issues,
                    totalIssues: issues.length
                };
            });

            accessibility.issues = a11yData.issues;
            accessibility.totalIssues = a11yData.totalIssues;
            await page.close();

        } catch (error) {
            accessibility.error = error.message;
        }

        return accessibility;
    }

    countTestResults(analysis) {
        let total = 0;
        let passed = 0;
        let failed = 0;
        let warnings = 0;

        // Performance tests
        if (analysis.performance.lighthouse) {
            total += 4; // performance, FCP, LCP, CLS
            if (analysis.performance.lighthouse.performance >= 90) passed++;
            else failed++;
        }

        // Content tests
        if (analysis.content.title) total++;
        if (analysis.content.description) total++;
        if (analysis.content.wordCount > 300) passed++;
        else warnings++;

        // SEO tests
        if (analysis.seo.ssl) passed++;
        else failed++;
        if (analysis.seo.metaTags.description) passed++;
        else warnings++;

        // Accessibility tests
        if (analysis.accessibility.totalIssues === 0) passed++;
        else failed += analysis.accessibility.totalIssues;

        analysis.totalTests = total;
        analysis.passedTests = passed;
        analysis.failedTests = failed;
        analysis.warnings = warnings;
    }

    async generateComparison(competitors) {
        const comparison = {
            performance: {},
            content: {},
            seo: {},
            accessibility: {}
        };

        // Performance comparison
        const performanceScores = Object.values(competitors)
            .filter(c => c.performance?.lighthouse?.performance)
            .map(c => ({ name: c.name, score: c.performance.lighthouse.performance }));

        comparison.performance = {
            average: performanceScores.reduce((sum, c) => sum + c.score, 0) / performanceScores.length,
            best: Math.max(...performanceScores.map(c => c.score)),
            worst: Math.min(...performanceScores.map(c => c.score))
        };

        // Content comparison
        const wordCounts = Object.values(competitors)
            .filter(c => c.content?.wordCount)
            .map(c => ({ name: c.name, count: c.content.wordCount }));

        comparison.content = {
            averageWords: wordCounts.reduce((sum, c) => sum + c.count, 0) / wordCounts.length,
            mostContent: Math.max(...wordCounts.map(c => c.count)),
            leastContent: Math.min(...wordCounts.map(c => c.count))
        };

        return comparison;
    }

    generateRecommendations(competitors) {
        const recommendations = [];

        // Performance recommendations
        const avgPerformance = Object.values(competitors)
            .filter(c => c.performance?.lighthouse?.performance)
            .reduce((sum, c) => sum + c.performance.lighthouse.performance, 0) / 
            Object.values(competitors).filter(c => c.performance?.lighthouse?.performance).length;

        if (avgPerformance < 80) {
            recommendations.push({
                category: 'Performance',
                priority: 'High',
                recommendation: 'Focus on improving Core Web Vitals and page load speeds',
                impact: 'User experience and search rankings'
            });
        }

        // Content recommendations
        const avgWordCount = Object.values(competitors)
            .filter(c => c.content?.wordCount)
            .reduce((sum, c) => sum + c.content.wordCount, 0) / 
            Object.values(competitors).filter(c => c.content?.wordCount).length;

        if (avgWordCount < 500) {
            recommendations.push({
                category: 'Content',
                priority: 'Medium',
                recommendation: 'Increase content depth and provide more detailed service information',
                impact: 'SEO and user engagement'
            });
        }

        // SEO recommendations
        const sslCount = Object.values(competitors)
            .filter(c => c.seo?.ssl).length;

        if (sslCount < Object.keys(competitors).length) {
            recommendations.push({
                category: 'SEO',
                priority: 'High',
                recommendation: 'Ensure all competitors have SSL certificates',
                impact: 'Security and search rankings'
            });
        }

        return recommendations;
    }

    displayResults(results) {
        console.log(chalk.blue.bold('\n📊 Competitor Analysis Results'));
        console.log(chalk.gray('─'.repeat(60)));

        // Display individual competitor results
        Object.entries(results.competitors).forEach(([name, data]) => {
            if (data.error) {
                console.log(chalk.red(`❌ ${name}: ${data.error}`));
                return;
            }

            console.log(chalk.cyan(`\n🏢 ${name}`));
            console.log(`   URL: ${data.url}`);
            console.log(`   Performance: ${data.performance?.lighthouse?.performance || 'N/A'}%`);
            console.log(`   Content Words: ${data.content?.wordCount || 'N/A'}`);
            console.log(`   SSL: ${data.seo?.ssl ? '✅' : '❌'}`);
            console.log(`   A11y Issues: ${data.accessibility?.totalIssues || 'N/A'}`);
        });

        // Display comparison
        if (results.comparison) {
            console.log(chalk.blue.bold('\n📈 Market Comparison'));
            console.log(chalk.gray('─'.repeat(40)));
            
            if (results.comparison.performance) {
                console.log(`Average Performance: ${results.comparison.performance.average.toFixed(1)}%`);
                console.log(`Best Performance: ${results.comparison.performance.best}%`);
                console.log(`Worst Performance: ${results.comparison.performance.worst}%`);
            }

            if (results.comparison.content) {
                console.log(`Average Content: ${results.comparison.content.averageWords.toFixed(0)} words`);
                console.log(`Most Content: ${results.comparison.content.mostContent} words`);
                console.log(`Least Content: ${results.comparison.content.leastContent} words`);
            }
        }

        // Display recommendations
        if (results.recommendations.length > 0) {
            console.log(chalk.blue.bold('\n💡 Strategic Recommendations'));
            console.log(chalk.gray('─'.repeat(40)));
            
            results.recommendations.forEach((rec, index) => {
                const priorityColor = rec.priority === 'High' ? chalk.red : chalk.yellow;
                console.log(`${index + 1}. ${priorityColor(rec.priority)} - ${rec.category}`);
                console.log(`   ${rec.recommendation}`);
                console.log(`   Impact: ${rec.impact}\n`);
            });
        }

        // Summary
        console.log(chalk.blue.bold('\n📋 Analysis Summary'));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(`Total Competitors Analyzed: ${Object.keys(results.competitors).length}`);
        console.log(`Total Tests: ${results.totalTests}`);
        console.log(`Passed: ${chalk.green(results.passedTests)}`);
        console.log(`Failed: ${chalk.red(results.failedTests)}`);
        console.log(`Warnings: ${chalk.yellow(results.warnings)}`);
    }
}

module.exports = CompetitorAnalyzer; 