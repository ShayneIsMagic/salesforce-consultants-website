const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const chalk = require('chalk').default;

class VisualTester {
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
        console.log(chalk.blue('🖼️  Starting visual regression tests...'));
        
        await this.initialize();
        
        // Ensure directories exist
        await fs.ensureDir(this.config.visual.screenshotDir);
        await fs.ensureDir(this.config.visual.baselineDir);
        
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
            console.log(chalk.cyan(`\n🖼️  Testing ${pagePath}`));
            
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
            devices: {},
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0,
            criticalIssues: 0,
            issues: []
        };

        try {
            // Test each device configuration
            for (const device of this.config.visual.devices) {
                console.log(chalk.gray(`   Testing ${device.name} (${device.width}x${device.height})`));
                
                const deviceTest = await this.testDevice(url, pagePath, device);
                test.devices[device.name] = deviceTest;
            }

            // Count test results
            this.countTestResults(test);

        } catch (error) {
            test.error = error.message;
            test.criticalIssues = 1;
        }

        return test;
    }

    async testDevice(url, pagePath, device) {
        const deviceTest = {
            device: device.name,
            viewport: `${device.width}x${device.height}`,
            screenshot: null,
            baseline: null,
            diff: null,
            passed: false,
            issues: []
        };

        try {
            const page = await this.browser.newPage();
            await page.setViewport({
                width: device.width,
                height: device.height
            });

            // Navigate to page
            await page.goto(url, { 
                waitUntil: this.config.puppeteer.waitUntil, 
                timeout: this.config.puppeteer.timeout 
            });

            // Wait for any animations to complete
            await page.waitForTimeout(2000);

            // Take screenshot
            const screenshotPath = path.join(
                this.config.visual.screenshotDir,
                `${pagePath.replace(/\//g, '_')}_${device.name}.png`
            );
            
            await page.screenshot({
                path: screenshotPath,
                fullPage: true
            });

            deviceTest.screenshot = screenshotPath;

            // Check for baseline
            const baselinePath = path.join(
                this.config.visual.baselineDir,
                `${pagePath.replace(/\//g, '_')}_${device.name}.png`
            );

            if (await fs.pathExists(baselinePath)) {
                // Compare with baseline
                const comparison = await this.compareScreenshots(screenshotPath, baselinePath);
                deviceTest.baseline = baselinePath;
                deviceTest.diff = comparison;
                deviceTest.passed = comparison.diffPercentage <= this.config.visual.threshold;
                
                if (!deviceTest.passed) {
                    deviceTest.issues.push(`Visual regression detected: ${comparison.diffPercentage.toFixed(2)}% difference`);
                }
            } else {
                // Create baseline
                await fs.copy(screenshotPath, baselinePath);
                deviceTest.baseline = baselinePath;
                deviceTest.passed = true;
                deviceTest.issues.push('Baseline created for future comparison');
            }

            // Additional visual checks
            const visualChecks = await this.runVisualChecks(page, device);
            deviceTest.issues.push(...visualChecks.issues);

            await page.close();

        } catch (error) {
            deviceTest.error = error.message;
            deviceTest.passed = false;
        }

        return deviceTest;
    }

    async compareScreenshots(currentPath, baselinePath) {
        const comparison = {
            diffPercentage: 0,
            diffPixels: 0,
            totalPixels: 0,
            diffImage: null
        };

        try {
            // Read images
            const current = PNG.sync.read(await fs.readFile(currentPath));
            const baseline = PNG.sync.read(await fs.readFile(baselinePath));

            // Ensure same dimensions
            if (current.width !== baseline.width || current.height !== baseline.height) {
                comparison.diffPercentage = 100;
                comparison.diffPixels = current.width * current.height;
                comparison.totalPixels = current.width * current.height;
                return comparison;
            }

            // Create diff image
            const diff = new PNG({ width: current.width, height: current.height });
            
            // Compare pixels
            const diffPixels = pixelmatch(
                current.data,
                baseline.data,
                diff.data,
                current.width,
                current.height,
                { threshold: 0.1 }
            );

            comparison.diffPixels = diffPixels;
            comparison.totalPixels = current.width * current.height;
            comparison.diffPercentage = (diffPixels / comparison.totalPixels) * 100;

            // Save diff image if there are differences
            if (diffPixels > 0) {
                const diffPath = currentPath.replace('.png', '_diff.png');
                await fs.writeFile(diffPath, PNG.sync.write(diff));
                comparison.diffImage = diffPath;
            }

        } catch (error) {
            comparison.error = error.message;
        }

        return comparison;
    }

    async runVisualChecks(page, device) {
        const checks = {
            issues: []
        };

        try {
            // Check for layout issues
            const layoutIssues = await page.evaluate(() => {
                const issues = [];
                
                // Check for horizontal overflow
                const body = document.body;
                const html = document.documentElement;
                const maxWidth = Math.max(
                    body.scrollWidth,
                    body.offsetWidth,
                    html.clientWidth,
                    html.scrollWidth,
                    html.offsetWidth
                );
                
                if (maxWidth > window.innerWidth) {
                    issues.push('Horizontal overflow detected');
                }

                // Check for broken images
                const images = document.querySelectorAll('img');
                const brokenImages = Array.from(images).filter(img => 
                    img.naturalWidth === 0 || img.naturalHeight === 0
                );
                
                if (brokenImages.length > 0) {
                    issues.push(`${brokenImages.length} broken images detected`);
                }

                // Check for text overflow
                const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
                const overflowElements = Array.from(textElements).filter(el => {
                    const style = window.getComputedStyle(el);
                    return el.scrollWidth > el.clientWidth || 
                           el.scrollHeight > el.clientHeight;
                });
                
                if (overflowElements.length > 0) {
                    issues.push(`${overflowElements.length} text overflow elements detected`);
                }

                return issues;
            });

            checks.issues.push(...layoutIssues);

            // Check for responsive design issues on mobile
            if (device.width <= 768) {
                const mobileIssues = await page.evaluate(() => {
                    const issues = [];
                    
                    // Check for touch targets
                    const touchTargets = document.querySelectorAll('a, button, input, select, textarea');
                    const smallTargets = Array.from(touchTargets).filter(el => {
                        const rect = el.getBoundingClientRect();
                        return rect.width < 44 || rect.height < 44;
                    });
                    
                    if (smallTargets.length > 0) {
                        issues.push(`${smallTargets.length} touch targets too small (< 44px)`);
                    }

                    // Check for viewport meta tag
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (!viewport) {
                        issues.push('Missing viewport meta tag');
                    }

                    return issues;
                });

                checks.issues.push(...mobileIssues);
            }

        } catch (error) {
            checks.issues.push(`Visual check error: ${error.message}`);
        }

        return checks;
    }

    countTestResults(test) {
        let total = 0;
        let passed = 0;
        let failed = 0;
        let warnings = 0;
        let critical = 0;

        Object.values(test.devices).forEach(device => {
            total++;
            if (device.passed) {
                passed++;
            } else {
                failed++;
                if (device.issues.some(issue => 
                    issue.includes('regression') || issue.includes('broken')
                )) {
                    critical++;
                } else {
                    warnings++;
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
        console.log(chalk.blue.bold('\n🖼️  Visual Test Results'));
        console.log(chalk.gray('─'.repeat(50)));

        Object.entries(results.pages).forEach(([pagePath, test]) => {
            if (test.error) {
                console.log(chalk.red(`❌ ${pagePath}: ${test.error}`));
                return;
            }

            const status = test.criticalIssues > 0 ? '🔴' : 
                          test.failedTests > 0 ? '🟡' : '🟢';
            
            console.log(chalk.cyan(`\n${status} ${pagePath}`));
            
            Object.entries(test.devices).forEach(([deviceName, device]) => {
                const deviceStatus = device.passed ? '✅' : '❌';
                console.log(`   ${deviceStatus} ${deviceName} (${device.viewport})`);
                
                if (device.diff) {
                    console.log(`      Diff: ${device.diff.diffPercentage.toFixed(2)}%`);
                }
                
                if (device.issues.length > 0) {
                    device.issues.forEach(issue => {
                        console.log(`      ⚠️  ${issue}`);
                    });
                }
            });
            
            console.log(`   Tests: ${test.passedTests}/${test.totalTests} passed`);
        });

        // Overall summary
        console.log(chalk.blue.bold('\n📋 Visual Test Summary'));
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
            console.log(chalk.red.bold('\n⚠️  Visual regression issues found!'));
            console.log('Review diff images in the screenshots directory.');
        } else if (results.failedTests > 0) {
            console.log(chalk.yellow.bold('\n⚠️  Some visual issues found.'));
            console.log('Check the detailed results for improvement opportunities.');
        } else {
            console.log(chalk.green.bold('\n✅ All visual tests passed!'));
        }

        console.log(chalk.gray('\n📁 Screenshots saved to: ' + this.config.visual.screenshotDir));
        console.log(chalk.gray('📁 Baselines saved to: ' + this.config.visual.baselineDir));
    }
}

module.exports = VisualTester; 