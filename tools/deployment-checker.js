#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk').default;
const ora = require('ora');

class DeploymentChecker {
    constructor() {
        this.config = null;
        this.projectConfig = null;
        this.results = {
            checks: {},
            totalChecks: 0,
            passedChecks: 0,
            failedChecks: 0,
            warnings: 0,
            criticalIssues: 0
        };
    }

    async initialize() {
        const spinner = ora('Loading deployment configuration...').start();
        
        try {
            this.config = await fs.readJson('./config/qa-config.json');
            this.projectConfig = await fs.readJson('./config/project-config.json');
            spinner.succeed('Deployment configuration loaded');
        } catch (error) {
            spinner.fail('Failed to load configuration');
            console.error(chalk.red('Error loading configuration:'), error.message);
            process.exit(1);
        }
    }

    async runDeploymentChecks() {
        console.log(chalk.blue.bold('\n🚀 Running deployment checks for Salesforce Consultants\n'));
        
        await this.initialize();
        
        const checks = [
            { name: 'File Structure', fn: () => this.checkFileStructure() },
            { name: 'Configuration Files', fn: () => this.checkConfigurationFiles() },
            { name: 'Build Assets', fn: () => this.checkBuildAssets() },
            { name: 'SEO Elements', fn: () => this.checkSEOElements() },
            { name: 'Security Headers', fn: () => this.checkSecurityHeaders() },
            { name: 'Performance Assets', fn: () => this.checkPerformanceAssets() },
            { name: 'Accessibility Compliance', fn: () => this.checkAccessibilityCompliance() },
            { name: 'Mobile Responsiveness', fn: () => this.checkMobileResponsiveness() }
        ];

        for (const check of checks) {
            console.log(chalk.cyan(`\n📋 Running ${check.name}...`));
            await check.fn();
        }

        this.displayResults();
        this.generateDeploymentReport();
    }

    async checkFileStructure() {
        const check = {
            name: 'File Structure',
            passed: true,
            issues: [],
            warnings: []
        };

        const requiredFiles = [
            'index.html',
            'css/main.css',
            'js/main.js',
            'assets/images/',
            'about/index.html',
            'services/index.html',
            'nonprofits/index.html',
            'business/index.html',
            'success-stories/index.html',
            'contact/index.html'
        ];

        const requiredDirs = [
            'assets',
            'css',
            'js',
            'about',
            'services',
            'nonprofits',
            'business',
            'success-stories',
            'contact'
        ];

        // Check required files
        for (const file of requiredFiles) {
            if (file.endsWith('/')) {
                // Directory check
                if (!(await fs.pathExists(file))) {
                    check.passed = false;
                    check.issues.push(`Missing directory: ${file}`);
                }
            } else {
                // File check
                if (!(await fs.pathExists(file))) {
                    check.passed = false;
                    check.issues.push(`Missing file: ${file}`);
                }
            }
        }

        // Check for unnecessary files
        const unnecessaryFiles = [
            'node_modules',
            '.git',
            '.DS_Store',
            '*.log',
            '*.tmp'
        ];

        for (const pattern of unnecessaryFiles) {
            const files = await this.findFiles(pattern);
            if (files.length > 0) {
                check.warnings.push(`Found ${files.length} unnecessary files matching: ${pattern}`);
            }
        }

        this.results.checks['fileStructure'] = check;
        this.countCheckResults(check);
    }

    async checkConfigurationFiles() {
        const check = {
            name: 'Configuration Files',
            passed: true,
            issues: [],
            warnings: []
        };

        const configFiles = [
            'package.json',
            'wrangler.toml',
            '_headers',
            '_redirects',
            '.gitignore'
        ];

        for (const file of configFiles) {
            if (await fs.pathExists(file)) {
                try {
                    const content = await fs.readFile(file, 'utf8');
                    if (content.length === 0) {
                        check.warnings.push(`Empty configuration file: ${file}`);
                    }
                } catch (error) {
                    check.issues.push(`Cannot read configuration file: ${file}`);
                }
            } else {
                check.warnings.push(`Missing configuration file: ${file}`);
            }
        }

        // Check package.json specific requirements
        if (await fs.pathExists('package.json')) {
            try {
                const packageJson = await fs.readJson('package.json');
                
                if (!packageJson.name) {
                    check.issues.push('Missing name in package.json');
                }
                if (!packageJson.version) {
                    check.issues.push('Missing version in package.json');
                }
                if (!packageJson.description) {
                    check.warnings.push('Missing description in package.json');
                }
            } catch (error) {
                check.issues.push('Invalid package.json format');
            }
        }

        this.results.checks['configurationFiles'] = check;
        this.countCheckResults(check);
    }

    async checkBuildAssets() {
        const check = {
            name: 'Build Assets',
            passed: true,
            issues: [],
            warnings: []
        };

        // Check CSS files
        const cssFiles = await this.findFiles('*.css');
        for (const cssFile of cssFiles) {
            try {
                const content = await fs.readFile(cssFile, 'utf8');
                if (content.length === 0) {
                    check.issues.push(`Empty CSS file: ${cssFile}`);
                }
                
                // Check for minification (basic check)
                const lines = content.split('\n');
                const avgLineLength = content.length / lines.length;
                if (avgLineLength > 200 && !cssFile.includes('.min.')) {
                    check.warnings.push(`CSS file may need minification: ${cssFile}`);
                }
            } catch (error) {
                check.issues.push(`Cannot read CSS file: ${cssFile}`);
            }
        }

        // Check JavaScript files
        const jsFiles = await this.findFiles('*.js');
        for (const jsFile of jsFiles) {
            try {
                const content = await fs.readFile(jsFile, 'utf8');
                if (content.length === 0) {
                    check.issues.push(`Empty JavaScript file: ${jsFile}`);
                }
            } catch (error) {
                check.issues.push(`Cannot read JavaScript file: ${jsFile}`);
            }
        }

        // Check image optimization
        const imageFiles = await this.findFiles('*.{jpg,jpeg,png,gif,webp}');
        for (const imageFile of imageFiles) {
            try {
                const stats = await fs.stat(imageFile);
                const sizeInMB = stats.size / (1024 * 1024);
                
                if (sizeInMB > 1) {
                    check.warnings.push(`Large image file: ${imageFile} (${sizeInMB.toFixed(2)}MB)`);
                }
            } catch (error) {
                check.issues.push(`Cannot read image file: ${imageFile}`);
            }
        }

        this.results.checks['buildAssets'] = check;
        this.countCheckResults(check);
    }

    async checkSEOElements() {
        const check = {
            name: 'SEO Elements',
            passed: true,
            issues: [],
            warnings: []
        };

        const htmlFiles = await this.findFiles('*.html');
        
        for (const htmlFile of htmlFiles) {
            try {
                const content = await fs.readFile(htmlFile, 'utf8');
                
                // Check for required meta tags
                if (!content.includes('<title>')) {
                    check.issues.push(`Missing title tag in: ${htmlFile}`);
                }
                if (!content.includes('meta name="description"')) {
                    check.warnings.push(`Missing meta description in: ${htmlFile}`);
                }
                if (!content.includes('meta name="viewport"')) {
                    check.issues.push(`Missing viewport meta tag in: ${htmlFile}`);
                }
                if (!content.includes('charset')) {
                    check.issues.push(`Missing charset declaration in: ${htmlFile}`);
                }

                // Check for Open Graph tags
                if (!content.includes('og:title') && !content.includes('og:description')) {
                    check.warnings.push(`Missing Open Graph tags in: ${htmlFile}`);
                }

                // Check for canonical URLs
                if (!content.includes('rel="canonical"')) {
                    check.warnings.push(`Missing canonical URL in: ${htmlFile}`);
                }

                // Check for proper heading structure
                const h1Count = (content.match(/<h1/g) || []).length;
                if (h1Count === 0) {
                    check.issues.push(`No H1 tag found in: ${htmlFile}`);
                } else if (h1Count > 1) {
                    check.warnings.push(`Multiple H1 tags found in: ${htmlFile}`);
                }

            } catch (error) {
                check.issues.push(`Cannot read HTML file: ${htmlFile}`);
            }
        }

        this.results.checks['seoElements'] = check;
        this.countCheckResults(check);
    }

    async checkSecurityHeaders() {
        const check = {
            name: 'Security Headers',
            passed: true,
            issues: [],
            warnings: []
        };

        // Check _headers file
        if (await fs.pathExists('_headers')) {
            try {
                const content = await fs.readFile('_headers', 'utf8');
                
                const requiredHeaders = [
                    'X-Frame-Options',
                    'X-Content-Type-Options',
                    'Referrer-Policy',
                    'Content-Security-Policy'
                ];

                for (const header of requiredHeaders) {
                    if (!content.includes(header)) {
                        check.warnings.push(`Missing security header: ${header}`);
                    }
                }

                // Check for HTTPS redirects
                if (!content.includes('Strict-Transport-Security')) {
                    check.warnings.push('Missing HSTS header');
                }

            } catch (error) {
                check.issues.push('Cannot read _headers file');
            }
        } else {
            check.warnings.push('Missing _headers file for security configuration');
        }

        // Check for HTTPS redirects in _redirects
        if (await fs.pathExists('_redirects')) {
            try {
                const content = await fs.readFile('_redirects', 'utf8');
                if (!content.includes('https://')) {
                    check.warnings.push('No HTTPS redirects configured in _redirects');
                }
            } catch (error) {
                check.issues.push('Cannot read _redirects file');
            }
        }

        this.results.checks['securityHeaders'] = check;
        this.countCheckResults(check);
    }

    async checkPerformanceAssets() {
        const check = {
            name: 'Performance Assets',
            passed: true,
            issues: [],
            warnings: []
        };

        // Check for image optimization
        const imageFiles = await this.findFiles('*.{jpg,jpeg,png}');
        const webpFiles = await this.findFiles('*.webp');
        
        if (imageFiles.length > 0 && webpFiles.length === 0) {
            check.warnings.push('No WebP images found - consider adding WebP alternatives');
        }

        // Check for lazy loading
        const htmlFiles = await this.findFiles('*.html');
        let lazyLoadingFound = false;
        
        for (const htmlFile of htmlFiles) {
            try {
                const content = await fs.readFile(htmlFile, 'utf8');
                if (content.includes('loading="lazy"')) {
                    lazyLoadingFound = true;
                    break;
                }
            } catch (error) {
                // Continue checking other files
            }
        }

        if (!lazyLoadingFound) {
            check.warnings.push('No lazy loading found on images');
        }

        // Check for CSS/JS minification
        const cssFiles = await this.findFiles('*.css');
        const jsFiles = await this.findFiles('*.js');
        
        const minifiedCss = cssFiles.filter(file => file.includes('.min.'));
        const minifiedJs = jsFiles.filter(file => file.includes('.min.'));

        if (cssFiles.length > 0 && minifiedCss.length === 0) {
            check.warnings.push('CSS files not minified');
        }
        if (jsFiles.length > 0 && minifiedJs.length === 0) {
            check.warnings.push('JavaScript files not minified');
        }

        this.results.checks['performanceAssets'] = check;
        this.countCheckResults(check);
    }

    async checkAccessibilityCompliance() {
        const check = {
            name: 'Accessibility Compliance',
            passed: true,
            issues: [],
            warnings: []
        };

        const htmlFiles = await this.findFiles('*.html');
        
        for (const htmlFile of htmlFiles) {
            try {
                const content = await fs.readFile(htmlFile, 'utf8');
                
                // Check for lang attribute
                if (!content.includes('lang="en"')) {
                    check.issues.push(`Missing lang attribute in: ${htmlFile}`);
                }

                // Check for alt attributes on images
                const imgTags = content.match(/<img[^>]*>/g) || [];
                for (const imgTag of imgTags) {
                    if (!imgTag.includes('alt=')) {
                        check.issues.push(`Image missing alt attribute in: ${htmlFile}`);
                    }
                }

                // Check for form labels
                const inputTags = content.match(/<input[^>]*>/g) || [];
                for (const inputTag of inputTags) {
                    if (!inputTag.includes('id=') && !inputTag.includes('aria-label=')) {
                        check.warnings.push(`Input missing id or aria-label in: ${htmlFile}`);
                    }
                }

                // Check for semantic HTML
                const semanticElements = ['nav', 'main', 'article', 'section', 'aside', 'header', 'footer'];
                let hasSemanticElements = false;
                
                for (const element of semanticElements) {
                    if (content.includes(`<${element}`)) {
                        hasSemanticElements = true;
                        break;
                    }
                }

                if (!hasSemanticElements) {
                    check.warnings.push(`Limited semantic HTML structure in: ${htmlFile}`);
                }

            } catch (error) {
                check.issues.push(`Cannot read HTML file: ${htmlFile}`);
            }
        }

        this.results.checks['accessibilityCompliance'] = check;
        this.countCheckResults(check);
    }

    async checkMobileResponsiveness() {
        const check = {
            name: 'Mobile Responsiveness',
            passed: true,
            issues: [],
            warnings: []
        };

        const htmlFiles = await this.findFiles('*.html');
        
        for (const htmlFile of htmlFiles) {
            try {
                const content = await fs.readFile(htmlFile, 'utf8');
                
                // Check for viewport meta tag
                if (!content.includes('meta name="viewport"')) {
                    check.issues.push(`Missing viewport meta tag in: ${htmlFile}`);
                }

                // Check for responsive CSS
                const cssFiles = await this.findFiles('*.css');
                let hasResponsiveCSS = false;
                
                for (const cssFile of cssFiles) {
                    try {
                        const cssContent = await fs.readFile(cssFile, 'utf8');
                        if (cssContent.includes('@media') || cssContent.includes('max-width')) {
                            hasResponsiveCSS = true;
                            break;
                        }
                    } catch (error) {
                        // Continue checking other files
                    }
                }

                if (!hasResponsiveCSS) {
                    check.warnings.push('No responsive CSS found');
                }

            } catch (error) {
                check.issues.push(`Cannot read HTML file: ${htmlFile}`);
            }
        }

        this.results.checks['mobileResponsiveness'] = check;
        this.countCheckResults(check);
    }

    async findFiles(pattern) {
        const files = [];
        const glob = require('glob');
        
        try {
            const matches = await new Promise((resolve, reject) => {
                glob(pattern, { ignore: ['node_modules/**', '.git/**'] }, (err, matches) => {
                    if (err) reject(err);
                    else resolve(matches);
                });
            });
            files.push(...matches);
        } catch (error) {
            // Pattern not found or other error
        }
        
        return files;
    }

    countCheckResults(check) {
        this.results.totalChecks++;
        
        if (check.passed) {
            this.results.passedChecks++;
        } else {
            this.results.failedChecks++;
        }
        
        this.results.warnings += check.warnings.length;
        this.results.criticalIssues += check.issues.length;
    }

    displayResults() {
        console.log(chalk.blue.bold('\n📊 Deployment Check Results'));
        console.log(chalk.gray('─'.repeat(50)));

        Object.entries(this.results.checks).forEach(([key, check]) => {
            const status = check.issues.length > 0 ? '🔴' : 
                          check.warnings.length > 0 ? '🟡' : '🟢';
            
            console.log(chalk.cyan(`\n${status} ${check.name}`));
            
            if (check.issues.length > 0) {
                check.issues.forEach(issue => {
                    console.log(chalk.red(`   ❌ ${issue}`));
                });
            }
            
            if (check.warnings.length > 0) {
                check.warnings.forEach(warning => {
                    console.log(chalk.yellow(`   ⚠️  ${warning}`));
                });
            }
            
            if (check.issues.length === 0 && check.warnings.length === 0) {
                console.log(chalk.green('   ✅ All checks passed'));
            }
        });

        // Summary
        console.log(chalk.blue.bold('\n📋 Deployment Summary'));
        console.log(chalk.gray('─'.repeat(30)));
        console.log(`Total Checks: ${this.results.totalChecks}`);
        console.log(`Passed: ${chalk.green(this.results.passedChecks)}`);
        console.log(`Failed: ${chalk.red(this.results.failedChecks)}`);
        console.log(`Warnings: ${chalk.yellow(this.results.warnings)}`);
        console.log(`Critical Issues: ${chalk.red(this.results.criticalIssues)}`);
        
        const passRate = this.results.totalChecks > 0 ? 
            (this.results.passedChecks / this.results.totalChecks * 100).toFixed(1) : 0;
        console.log(`Pass Rate: ${chalk.cyan(passRate)}%`);

        if (this.results.criticalIssues > 0) {
            console.log(chalk.red.bold('\n🚫 Deployment blocked! Critical issues must be resolved.'));
            process.exit(1);
        } else if (this.results.failedChecks > 0) {
            console.log(chalk.yellow.bold('\n⚠️  Deployment warnings. Review issues before proceeding.'));
        } else {
            console.log(chalk.green.bold('\n✅ Deployment checks passed! Ready to deploy.'));
        }
    }

    async generateDeploymentReport() {
        const report = {
            timestamp: new Date().toISOString(),
            project: this.projectConfig.projectName,
            results: this.results,
            recommendations: this.generateRecommendations()
        };

        const reportPath = './deployment-report.json';
        await fs.writeJson(reportPath, report, { spaces: 2 });
        
        console.log(chalk.gray(`\n📄 Deployment report saved to: ${reportPath}`));
    }

    generateRecommendations() {
        const recommendations = [];

        if (this.results.criticalIssues > 0) {
            recommendations.push({
                priority: 'Critical',
                action: 'Fix all critical issues before deployment',
                impact: 'Security and functionality'
            });
        }

        if (this.results.warnings > 0) {
            recommendations.push({
                priority: 'Medium',
                action: 'Address warnings for better performance and SEO',
                impact: 'User experience and search rankings'
            });
        }

        return recommendations;
    }
}

// CLI execution
if (require.main === module) {
    const checker = new DeploymentChecker();
    checker.runDeploymentChecks().catch(error => {
        console.error(chalk.red('Deployment check failed:'), error.message);
        process.exit(1);
    });
}

module.exports = DeploymentChecker; 