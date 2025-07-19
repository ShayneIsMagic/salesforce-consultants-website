const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk').default;

class ContentValidator {
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

    async validateAllPages() {
        console.log(chalk.blue('📝 Starting content validation...'));
        
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
            console.log(chalk.cyan(`\n📄 Validating ${pagePath}`));
            
            try {
                const validation = await this.validatePage(fullUrl, pagePath);
                results.pages[pagePath] = validation;
                results.totalTests += validation.totalTests || 0;
                results.passedTests += validation.passedTests || 0;
                results.failedTests += validation.failedTests || 0;
                results.warnings += validation.warnings || 0;
                if (validation.criticalIssues) results.criticalIssues += validation.criticalIssues;
            } catch (error) {
                console.error(chalk.red(`Error validating ${pagePath}:`), error.message);
                results.pages[pagePath] = { error: error.message };
            }
        }

        await this.browser.close();
        
        this.results = results;
        this.displayResults(results);
        
        return results;
    }

    async validatePage(url, pagePath) {
        const validation = {
            url,
            pagePath,
            timestamp: new Date().toISOString(),
            seo: {},
            content: {},
            accessibility: {},
            functionality: {},
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

            // Get page content
            const html = await page.content();
            const $ = cheerio.load(html);

            // SEO validation
            validation.seo = await this.validateSEO($, url);
            
            // Content validation
            validation.content = await this.validateContent($, pagePath);
            
            // Accessibility validation
            validation.accessibility = await this.validateAccessibility($);
            
            // Functionality validation
            validation.functionality = await this.validateFunctionality(page, $);

            // Count test results
            this.countValidationResults(validation);

            await page.close();

        } catch (error) {
            validation.error = error.message;
            validation.criticalIssues = 1;
        }

        return validation;
    }

    async validateSEO($, url) {
        const seo = {
            title: { valid: false, value: '', issues: [] },
            description: { valid: false, value: '', issues: [] },
            keywords: { valid: false, value: '', issues: [] },
            canonical: { valid: false, value: '', issues: [] },
            openGraph: { valid: false, value: {}, issues: [] },
            twitter: { valid: false, value: {}, issues: [] },
            structuredData: { valid: false, value: [], issues: [] },
            h1: { valid: false, value: '', issues: [] },
            h2: { valid: false, value: [], issues: [] },
            images: { valid: false, value: [], issues: [] }
        };

        // Title validation
        const title = $('title').text().trim();
        seo.title.value = title;
        if (title) {
            seo.title.valid = true;
            if (title.length > this.config.content.maxTitleLength) {
                seo.title.issues.push(`Title too long (${title.length} chars, max ${this.config.content.maxTitleLength})`);
            }
        } else {
            seo.title.issues.push('Missing title tag');
        }

        // Description validation
        const description = $('meta[name="description"]').attr('content') || '';
        seo.description.value = description;
        if (description) {
            seo.description.valid = true;
            if (description.length > this.config.content.maxDescriptionLength) {
                seo.description.issues.push(`Description too long (${description.length} chars, max ${this.config.content.maxDescriptionLength})`);
            }
        } else {
            seo.description.issues.push('Missing meta description');
        }

        // Keywords validation
        const keywords = $('meta[name="keywords"]').attr('content') || '';
        seo.keywords.value = keywords;
        if (keywords) {
            seo.keywords.valid = true;
        } else {
            seo.keywords.issues.push('Missing meta keywords');
        }

        // Canonical validation
        const canonical = $('link[rel="canonical"]').attr('href') || '';
        seo.canonical.value = canonical;
        if (canonical) {
            seo.canonical.valid = true;
            if (canonical !== url) {
                seo.canonical.issues.push('Canonical URL does not match current URL');
            }
        } else {
            seo.canonical.issues.push('Missing canonical URL');
        }

        // Open Graph validation
        const ogTags = {};
        $('meta[property^="og:"]').each((i, el) => {
            const property = $(el).attr('property');
            const content = $(el).attr('content');
            ogTags[property] = content;
        });
        seo.openGraph.value = ogTags;
        
        const requiredOG = this.config.seo.requiredOpenGraph;
        requiredOG.forEach(tag => {
            if (!ogTags[tag]) {
                seo.openGraph.issues.push(`Missing ${tag}`);
            }
        });
        seo.openGraph.valid = seo.openGraph.issues.length === 0;

        // Twitter Card validation
        const twitterTags = {};
        $('meta[name^="twitter:"]').each((i, el) => {
            const name = $(el).attr('name');
            const content = $(el).attr('content');
            twitterTags[name] = content;
        });
        seo.twitter.value = twitterTags;
        
        const requiredTwitter = this.config.seo.requiredTwitter;
        requiredTwitter.forEach(tag => {
            if (!twitterTags[tag]) {
                seo.twitter.issues.push(`Missing ${tag}`);
            }
        });
        seo.twitter.valid = seo.twitter.issues.length === 0;

        // Structured Data validation
        const structuredData = [];
        $('script[type="application/ld+json"]').each((i, el) => {
            try {
                const data = JSON.parse($(el).html());
                structuredData.push(data);
            } catch (e) {
                seo.structuredData.issues.push('Invalid JSON in structured data');
            }
        });
        seo.structuredData.value = structuredData;
        seo.structuredData.valid = structuredData.length > 0;

        // Heading validation
        const h1 = $('h1').first().text().trim();
        seo.h1.value = h1;
        if (h1) {
            seo.h1.valid = true;
        } else {
            seo.h1.issues.push('Missing H1 tag');
        }

        const h2s = [];
        $('h2').each((i, el) => {
            h2s.push($(el).text().trim());
        });
        seo.h2.value = h2s;
        seo.h2.valid = h2s.length > 0;

        // Image validation
        const images = [];
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            const alt = $(el).attr('alt');
            images.push({ src, alt });
            
            if (!alt) {
                seo.images.issues.push(`Image missing alt text: ${src}`);
            }
        });
        seo.images.value = images;
        seo.images.valid = seo.images.issues.length === 0;

        return seo;
    }

    async validateContent($, pagePath) {
        const content = {
            wordCount: { valid: false, value: 0, issues: [] },
            contentQuality: { valid: false, value: {}, issues: [] },
            ctaButtons: { valid: false, value: [], issues: [] },
            forms: { valid: false, value: [], issues: [] },
            links: { valid: false, value: [], issues: [] }
        };

        // Word count validation
        const text = $('body').text().trim();
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        content.wordCount.value = wordCount;
        
        if (wordCount >= this.config.content.minContentLength) {
            content.wordCount.valid = true;
        } else {
            content.wordCount.issues.push(`Insufficient content (${wordCount} words, min ${this.config.content.minContentLength})`);
        }

        // Content quality checks
        const contentQuality = {
            hasValueProposition: false,
            hasServices: false,
            hasContactInfo: false,
            hasSocialProof: false
        };

        // Check for value proposition (common phrases)
        const valueProps = ['expert', 'specializing', 'trusted', 'guaranteed', 'success'];
        const hasValueProp = valueProps.some(prop => text.toLowerCase().includes(prop));
        contentQuality.hasValueProposition = hasValueProp;

        // Check for services
        const serviceTerms = ['implementation', 'consulting', 'training', 'development', 'integration'];
        const hasServices = serviceTerms.some(term => text.toLowerCase().includes(term));
        contentQuality.hasServices = hasServices;

        // Check for contact information
        const contactPatterns = ['contact', 'phone', 'email', '@', 'salesforceconsultants.io'];
        const hasContact = contactPatterns.some(pattern => text.toLowerCase().includes(pattern));
        contentQuality.hasContactInfo = hasContact;

        // Check for social proof
        const socialProofTerms = ['chamber', 'certified', 'certification', 'client', 'customer'];
        const hasSocialProof = socialProofTerms.some(term => text.toLowerCase().includes(term));
        contentQuality.hasSocialProof = hasSocialProof;

        content.contentQuality.value = contentQuality;
        content.contentQuality.valid = Object.values(contentQuality).every(Boolean);

        // CTA button validation
        const ctaButtons = [];
        $('button, .btn, .cta, [class*="button"]').each((i, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href') || $(el).find('a').attr('href');
            ctaButtons.push({ text, href });
        });
        content.ctaButtons.value = ctaButtons;
        content.ctaButtons.valid = ctaButtons.length > 0;

        // Form validation
        const forms = [];
        $('form').each((i, el) => {
            const action = $(el).attr('action');
            const method = $(el).attr('method');
            forms.push({ action, method });
        });
        content.forms.value = forms;

        // Link validation
        const links = [];
        $('a[href]').each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            links.push({ href, text });
        });
        content.links.value = links;

        return content;
    }

    async validateAccessibility($) {
        const accessibility = {
            langAttribute: { valid: false, value: '', issues: [] },
            altText: { valid: false, value: [], issues: [] },
            formLabels: { valid: false, value: [], issues: [] },
            headingStructure: { valid: false, value: [], issues: [] },
            colorContrast: { valid: false, value: [], issues: [] }
        };

        // Language attribute
        const lang = $('html').attr('lang');
        accessibility.langAttribute.value = lang;
        if (lang) {
            accessibility.langAttribute.valid = true;
        } else {
            accessibility.langAttribute.issues.push('Missing lang attribute on html element');
        }

        // Alt text for images
        const images = [];
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            const alt = $(el).attr('alt');
            images.push({ src, alt });
            
            if (!alt) {
                accessibility.altText.issues.push(`Image missing alt text: ${src}`);
            }
        });
        accessibility.altText.value = images;
        accessibility.altText.valid = accessibility.altText.issues.length === 0;

        // Form labels
        const formControls = [];
        $('input, select, textarea').each((i, el) => {
            const type = $(el).attr('type') || $(el).prop('tagName').toLowerCase();
            const id = $(el).attr('id');
            const name = $(el).attr('name');
            const hasLabel = $(el).siblings('label').length > 0 || $(el).attr('aria-label');
            
            formControls.push({ type, id, name, hasLabel });
            
            if (!hasLabel) {
                accessibility.formLabels.issues.push(`Form control missing label: ${type} ${id || name}`);
            }
        });
        accessibility.formLabels.value = formControls;
        accessibility.formLabels.valid = accessibility.formLabels.issues.length === 0;

        // Heading structure
        const headings = [];
        $('h1, h2, h3, h4, h5, h6').each((i, el) => {
            const level = parseInt($(el).prop('tagName').charAt(1));
            const text = $(el).text().trim();
            headings.push({ level, text });
        });
        accessibility.headingStructure.value = headings;

        // Check for proper heading hierarchy
        let previousLevel = 0;
        headings.forEach(heading => {
            if (heading.level > previousLevel + 1) {
                accessibility.headingStructure.issues.push(`Heading structure skipped levels: H${heading.level} after H${previousLevel}`);
            }
            previousLevel = heading.level;
        });
        accessibility.headingStructure.valid = accessibility.headingStructure.issues.length === 0;

        return accessibility;
    }

    async validateFunctionality(page, $) {
        const functionality = {
            navigation: { valid: false, value: {}, issues: [] },
            responsive: { valid: false, value: {}, issues: [] },
            performance: { valid: false, value: {}, issues: [] }
        };

        // Navigation validation
        const navLinks = [];
        $('nav a, .nav-links a').each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            navLinks.push({ href, text });
        });
        functionality.navigation.value = { navLinks };
        functionality.navigation.valid = navLinks.length > 0;

        // Basic responsive check
        const viewport = $('meta[name="viewport"]').attr('content');
        functionality.responsive.value = { viewport };
        functionality.responsive.valid = !!viewport;

        // Performance indicators
        const performance = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                resourceCount: performance.getEntriesByType('resource').length
            };
        });
        functionality.performance.value = performance;
        functionality.performance.valid = performance.loadTime < this.config.performance.maxLoadTime;

        return functionality;
    }

    countValidationResults(validation) {
        let total = 0;
        let passed = 0;
        let failed = 0;
        let warnings = 0;
        let critical = 0;

        // Count SEO results
        Object.values(validation.seo).forEach(item => {
            if (item.valid !== undefined) {
                total++;
                if (item.valid) passed++;
                else {
                    failed++;
                    if (item.issues.some(issue => issue.includes('Missing'))) critical++;
                }
            }
        });

        // Count content results
        Object.values(validation.content).forEach(item => {
            if (item.valid !== undefined) {
                total++;
                if (item.valid) passed++;
                else {
                    failed++;
                    if (item.issues.some(issue => issue.includes('Insufficient'))) warnings++;
                }
            }
        });

        // Count accessibility results
        Object.values(validation.accessibility).forEach(item => {
            if (item.valid !== undefined) {
                total++;
                if (item.valid) passed++;
                else {
                    failed++;
                    if (item.issues.some(issue => issue.includes('Missing'))) critical++;
                }
            }
        });

        // Count functionality results
        Object.values(validation.functionality).forEach(item => {
            if (item.valid !== undefined) {
                total++;
                if (item.valid) passed++;
                else {
                    failed++;
                    warnings++;
                }
            }
        });

        validation.totalTests = total;
        validation.passedTests = passed;
        validation.failedTests = failed;
        validation.warnings = warnings;
        validation.criticalIssues = critical;
    }

    displayResults(results) {
        console.log(chalk.blue.bold('\n📝 Content Validation Results'));
        console.log(chalk.gray('─'.repeat(50)));

        Object.entries(results.pages).forEach(([pagePath, validation]) => {
            if (validation.error) {
                console.log(chalk.red(`❌ ${pagePath}: ${validation.error}`));
                return;
            }

            const status = validation.criticalIssues > 0 ? '🔴' : 
                          validation.failedTests > 0 ? '🟡' : '🟢';
            
            console.log(chalk.cyan(`\n${status} ${pagePath}`));
            console.log(`   Tests: ${validation.passedTests}/${validation.totalTests} passed`);
            console.log(`   Issues: ${validation.failedTests} failed, ${validation.warnings} warnings`);
            
            if (validation.criticalIssues > 0) {
                console.log(chalk.red(`   Critical: ${validation.criticalIssues} issues`));
            }
        });

        // Summary
        console.log(chalk.blue.bold('\n📋 Validation Summary'));
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

module.exports = ContentValidator; 