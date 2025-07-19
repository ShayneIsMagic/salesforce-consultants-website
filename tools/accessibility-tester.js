const puppeteer = require('puppeteer');
const axe = require('axe-core');
const chalk = require('chalk').default;

class AccessibilityTester {
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

    async testAllPages() {
        console.log(chalk.blue('♿ Starting accessibility tests...'));
        
        await this.initialize();
        
        const pages = this.projectConfig.pages;
        const results = {
            pages: {},
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0,
            criticalIssues: 0
        };

        for (const pagePath of pages) {
            const fullUrl = `${this.projectConfig.siteUrl}${pagePath}`;
            console.log(chalk.cyan(`\n♿ Testing ${pagePath}`));
            
            try {
                const test = await this.testPage(fullUrl, pagePath);
                results.pages[pagePath] = test;
                results.totalTests += test.totalTests || 0;
                results.passedTests += test.passedTests || 0;
                results.failedTests += test.failedTests || 0;
                results.warnings += test.warnings || 0;
                if (test.criticalIssues) results.criticalIssues += test.criticalIssues;
            } catch (error) {
                console.error(chalk.red(`Error testing ${pagePath}:`), error.message);
                results.pages[pagePath] = { error: error.message };
            }
        }

        await this.browser.close();
        
        this.results = results;
        this.displayResults(results);
        
        return results;
    }

    async testPage(url, pagePath) {
        const test = {
            url,
            pagePath,
            timestamp: new Date().toISOString(),
            axeResults: {},
            manualChecks: {},
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0,
            criticalIssues: 0,
            issues: []
        };

        try {
            const page = await this.browser.newPage();
            await page.setViewport(this.config.puppeteer.viewport);
            
            // Navigate to page
            await page.goto(url, { 
                waitUntil: this.config.puppeteer.waitUntil, 
                timeout: this.config.puppeteer.timeout 
            });

            // Run axe-core tests
            test.axeResults = await this.runAxeTests(page);
            
            // Run manual accessibility checks
            test.manualChecks = await this.runManualChecks(page);

            // Count test results
            this.countTestResults(test);

            await page.close();

        } catch (error) {
            test.error = error.message;
            test.criticalIssues = 1;
        }

        return test;
    }

    async runAxeTests(page) {
        const axeResults = {
            violations: [],
            passes: [],
            incomplete: [],
            inapplicable: [],
            totalIssues: 0,
            criticalIssues: 0,
            moderateIssues: 0,
            minorIssues: 0
        };

        try {
            // Inject axe-core
            await page.addScriptTag({
                path: require.resolve('axe-core')
            });

            // Run axe analysis
            const results = await page.evaluate(() => {
                return new Promise((resolve) => {
                    axe.run((err, results) => {
                        if (err) {
                            resolve({ error: err.message });
                        } else {
                            resolve(results);
                        }
                    });
                });
            });

            if (results.error) {
                axeResults.error = results.error;
                return axeResults;
            }

            // Process violations
            axeResults.violations = results.violations.map(violation => ({
                id: violation.id,
                impact: violation.impact,
                description: violation.description,
                help: violation.help,
                helpUrl: violation.helpUrl,
                tags: violation.tags,
                nodes: violation.nodes.length
            }));

            // Process passes
            axeResults.passes = results.passes.map(pass => ({
                id: pass.id,
                impact: pass.impact,
                description: pass.description,
                help: pass.help
            }));

            // Count issues by impact
            axeResults.totalIssues = results.violations.length;
            axeResults.criticalIssues = results.violations.filter(v => v.impact === 'critical').length;
            axeResults.moderateIssues = results.violations.filter(v => v.impact === 'serious').length;
            axeResults.minorIssues = results.violations.filter(v => v.impact === 'moderate' || v.impact === 'minor').length;

        } catch (error) {
            axeResults.error = error.message;
        }

        return axeResults;
    }

    async runManualChecks(page) {
        const manualChecks = {
            keyboardNavigation: { valid: false, issues: [] },
            colorContrast: { valid: false, issues: [] },
            focusManagement: { valid: false, issues: [] },
            semanticStructure: { valid: false, issues: [] },
            formAccessibility: { valid: false, issues: [] },
            imageAccessibility: { valid: false, issues: [] },
            linkAccessibility: { valid: false, issues: [] }
        };

        try {
            // Keyboard navigation test
            const keyboardTest = await page.evaluate(() => {
                const issues = [];
                let focusableElements = 0;
                let accessibleElements = 0;

                // Check for focusable elements
                const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
                focusableElements = focusable.length;

                // Check for proper focus indicators
                focusable.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const outline = style.outline;
                    const boxShadow = style.boxShadow;
                    
                    if (outline === 'none' && !boxShadow.includes('rgba')) {
                        issues.push(`Element missing focus indicator: ${el.tagName} ${el.className || ''}`);
                    } else {
                        accessibleElements++;
                    }
                });

                return {
                    focusableElements,
                    accessibleElements,
                    issues
                };
            });

            manualChecks.keyboardNavigation.valid = keyboardTest.accessibleElements === keyboardTest.focusableElements;
            manualChecks.keyboardNavigation.issues = keyboardTest.issues;

            // Color contrast test (basic check)
            const contrastTest = await page.evaluate(() => {
                const issues = [];
                const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
                let lowContrastCount = 0;

                textElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const color = style.color;
                    const backgroundColor = style.backgroundColor;
                    
                    // Basic contrast check (simplified)
                    if (color === backgroundColor) {
                        lowContrastCount++;
                        issues.push(`Low contrast text: ${el.tagName} ${el.className || ''}`);
                    }
                });

                return {
                    lowContrastCount,
                    issues
                };
            });

            manualChecks.colorContrast.valid = contrastTest.lowContrastCount === 0;
            manualChecks.colorContrast.issues = contrastTest.issues;

            // Focus management test
            const focusTest = await page.evaluate(() => {
                const issues = [];
                
                // Check for skip links
                const skipLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');
                if (skipLinks.length === 0) {
                    issues.push('No skip navigation links found');
                }

                // Check for proper heading structure
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                let previousLevel = 0;
                headings.forEach(heading => {
                    const level = parseInt(heading.tagName.charAt(1));
                    if (level > previousLevel + 1) {
                        issues.push(`Heading structure skipped levels: H${level} after H${previousLevel}`);
                    }
                    previousLevel = level;
                });

                return { issues };
            });

            manualChecks.focusManagement.valid = focusTest.issues.length === 0;
            manualChecks.focusManagement.issues = focusTest.issues;

            // Semantic structure test
            const semanticTest = await page.evaluate(() => {
                const issues = [];
                
                // Check for semantic HTML elements
                const semanticElements = document.querySelectorAll('nav, main, article, section, aside, header, footer');
                if (semanticElements.length < 3) {
                    issues.push('Insufficient semantic HTML structure');
                }

                // Check for proper list structure
                const lists = document.querySelectorAll('ul, ol');
                lists.forEach(list => {
                    const listItems = list.querySelectorAll('li');
                    if (listItems.length === 0) {
                        issues.push('List without list items');
                    }
                });

                // Check for proper table structure
                const tables = document.querySelectorAll('table');
                tables.forEach(table => {
                    const headers = table.querySelectorAll('th');
                    if (headers.length === 0) {
                        issues.push('Table without headers');
                    }
                });

                return { issues };
            });

            manualChecks.semanticStructure.valid = semanticTest.issues.length === 0;
            manualChecks.semanticStructure.issues = semanticTest.issues;

            // Form accessibility test
            const formTest = await page.evaluate(() => {
                const issues = [];
                
                const formControls = document.querySelectorAll('input, select, textarea');
                formControls.forEach(control => {
                    const id = control.id;
                    const name = control.name;
                    const type = control.type;
                    
                    // Check for labels
                    const hasLabel = control.labels.length > 0 || 
                                   control.getAttribute('aria-label') || 
                                   control.getAttribute('aria-labelledby');
                    
                    if (!hasLabel) {
                        issues.push(`Form control missing label: ${type} ${id || name}`);
                    }

                    // Check for required field indicators
                    if (control.required && !control.getAttribute('aria-required')) {
                        issues.push(`Required field missing aria-required: ${type} ${id || name}`);
                    }
                });

                return { issues };
            });

            manualChecks.formAccessibility.valid = formTest.issues.length === 0;
            manualChecks.formAccessibility.issues = formTest.issues;

            // Image accessibility test
            const imageTest = await page.evaluate(() => {
                const issues = [];
                
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    const alt = img.alt;
                    const src = img.src;
                    
                    if (!alt && !img.getAttribute('aria-label')) {
                        issues.push(`Image missing alt text: ${src}`);
                    }
                });

                return { issues };
            });

            manualChecks.imageAccessibility.valid = imageTest.issues.length === 0;
            manualChecks.imageAccessibility.issues = imageTest.issues;

            // Link accessibility test
            const linkTest = await page.evaluate(() => {
                const issues = [];
                
                const links = document.querySelectorAll('a[href]');
                links.forEach(link => {
                    const href = link.href;
                    const text = link.textContent.trim();
                    
                    // Check for descriptive link text
                    if (text.length < 3 || text === href) {
                        issues.push(`Link needs descriptive text: ${href}`);
                    }

                    // Check for external link indicators
                    if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                        const hasExternalIndicator = link.querySelector('[aria-label*="external"], [title*="external"]');
                        if (!hasExternalIndicator) {
                            issues.push(`External link missing indicator: ${href}`);
                        }
                    }
                });

                return { issues };
            });

            manualChecks.linkAccessibility.valid = linkTest.issues.length === 0;
            manualChecks.linkAccessibility.issues = linkTest.issues;

        } catch (error) {
            manualChecks.error = error.message;
        }

        return manualChecks;
    }

    countTestResults(test) {
        let total = 0;
        let passed = 0;
        let failed = 0;
        let warnings = 0;
        let critical = 0;

        // Axe test results
        if (test.axeResults.totalIssues !== undefined) {
            total += 1; // Overall axe compliance
            if (test.axeResults.totalIssues === 0) {
                passed++;
            } else {
                failed++;
                critical += test.axeResults.criticalIssues;
                warnings += test.axeResults.moderateIssues + test.axeResults.minorIssues;
            }
        }

        // Manual check results
        Object.values(test.manualChecks).forEach(check => {
            if (check.valid !== undefined) {
                total++;
                if (check.valid) {
                    passed++;
                } else {
                    failed++;
                    if (check.issues.some(issue => 
                        issue.includes('missing') || issue.includes('critical')
                    )) {
                        critical++;
                    } else {
                        warnings++;
                    }
                }
            }
        });

        test.totalTests = total;
        test.passedTests = passed;
        test.failedTests = failed;
        test.warnings = warnings;
        test.criticalIssues = critical;
    }

    displayResults(results) {
        console.log(chalk.blue.bold('\n♿ Accessibility Test Results'));
        console.log(chalk.gray('─'.repeat(50)));

        Object.entries(results.pages).forEach(([pagePath, test]) => {
            if (test.error) {
                console.log(chalk.red(`❌ ${pagePath}: ${test.error}`));
                return;
            }

            const status = test.criticalIssues > 0 ? '🔴' : 
                          test.failedTests > 0 ? '🟡' : '🟢';
            
            console.log(chalk.cyan(`\n${status} ${pagePath}`));
            
            if (test.axeResults) {
                console.log(`   Axe Issues: ${test.axeResults.totalIssues}`);
                console.log(`   Critical: ${test.axeResults.criticalIssues}`);
                console.log(`   Moderate: ${test.axeResults.moderateIssues}`);
                console.log(`   Minor: ${test.axeResults.minorIssues}`);
            }
            
            if (test.manualChecks) {
                const passedChecks = Object.values(test.manualChecks)
                    .filter(check => check.valid).length;
                const totalChecks = Object.values(test.manualChecks)
                    .filter(check => check.valid !== undefined).length;
                console.log(`   Manual Checks: ${passedChecks}/${totalChecks} passed`);
            }
            
            console.log(`   Tests: ${test.passedTests}/${test.totalTests} passed`);
        });

        // Overall summary
        console.log(chalk.blue.bold('\n📋 Accessibility Summary'));
        console.log(chalk.gray('─'.repeat(30)));
        console.log(`Total Pages: ${Object.keys(results.pages).length}`);
        console.log(`Total Tests: ${results.totalTests}`);
        console.log(`Passed: ${chalk.green(results.passedTests)}`);
        console.log(`Failed: ${chalk.red(results.failedTests)}`);
        console.log(`Warnings: ${chalk.yellow(results.warnings)}`);
        console.log(`Critical Issues: ${chalk.red(results.criticalIssues)}`);
        
        const passRate = results.totalTests > 0 ? (results.passedTests / results.totalTests * 100).toFixed(1) : 0;
        console.log(`Pass Rate: ${chalk.cyan(passRate)}%`);

        if (results.criticalIssues > 0) {
            console.log(chalk.red.bold('\n⚠️  Critical accessibility issues found!'));
            console.log('These must be addressed for WCAG compliance.');
        } else if (results.failedTests > 0) {
            console.log(chalk.yellow.bold('\n⚠️  Some accessibility issues found.'));
            console.log('Review the detailed results for improvement opportunities.');
        } else {
            console.log(chalk.green.bold('\n✅ Excellent accessibility compliance!'));
        }
    }
}

module.exports = AccessibilityTester; 