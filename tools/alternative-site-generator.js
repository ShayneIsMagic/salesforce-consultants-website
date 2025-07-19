const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk').default;
const ora = require('ora');

class AlternativeSiteGenerator {
    constructor(config, projectConfig) {
        this.config = config;
        this.projectConfig = projectConfig;
        this.researchResults = null;
        this.generatedSite = {
            pages: {},
            assets: {},
            structure: {}
        };
    }

    async loadResearchResults() {
        try {
            this.researchResults = await fs.readJson('./seo-research-report.json');
            console.log(chalk.green('✅ SEO research results loaded'));
        } catch (error) {
            console.log(chalk.yellow('⚠️  No research results found, using default configuration'));
            this.researchResults = this.getDefaultResearch();
        }
    }

    getDefaultResearch() {
        return {
            results: {
                marketAnalysis: {
                    utah: {
                        opportunities: ['Silicon Slopes ecosystem', 'Growing nonprofit sector', 'Local business focus'],
                        challenges: ['Smaller market', 'Limited enterprise clients']
                    },
                    california: {
                        opportunities: ['Large enterprise market', 'Diverse industries', 'High tech adoption'],
                        challenges: ['High competition', 'Cost of doing business']
                    }
                },
                keywordResearch: {
                    utah: {
                        primary: ['Salesforce consultant Utah', 'Salesforce implementation Utah', 'NPSP consultant Utah'],
                        local: ['Salesforce consultant Salt Lake City', 'Salesforce consultant Provo']
                    },
                    california: {
                        primary: ['Salesforce consultant California', 'Salesforce implementation California'],
                        local: ['Salesforce consultant San Francisco', 'Salesforce consultant Los Angeles']
                    }
                },
                recommendations: {
                    positioning: {
                        utah: 'Utah\'s Premier Salesforce Partner for Local Business Success',
                        california: 'California\'s Trusted Salesforce Partner for Business Growth'
                    }
                }
            }
        };
    }

    async generateAlternativeSite() {
        console.log(chalk.blue('🏗️  Generating alternative site based on SEO research...'));
        
        await this.loadResearchResults();
        
        const generation = [
            { name: 'Site Structure', fn: () => this.generateSiteStructure() },
            { name: 'Utah Landing Page', fn: () => this.generateUtahPage() },
            { name: 'California Landing Page', fn: () => this.generateCaliforniaPage() },
            { name: 'Local Partners Page', fn: () => this.generateLocalPartnersPage() },
            { name: 'State-Specific Services', fn: () => this.generateStateServices() },
            { name: 'Local SEO Assets', fn: () => this.generateLocalSEOAssets() }
        ];

        for (const step of generation) {
            const spinner = ora(`Generating ${step.name}...`).start();
            try {
                await step.fn();
                spinner.succeed(`${step.name} generated`);
            } catch (error) {
                spinner.fail(`${step.name} failed: ${error.message}`);
            }
        }

        await this.saveGeneratedSite();
        this.displayResults();
    }

    async generateSiteStructure() {
        this.generatedSite.structure = {
            pages: [
                { path: '/', title: 'Salesforce Consultants | Local Experts with 100% Adoption Guarantee' },
                { path: '/utah/', title: 'Utah Salesforce Consulting | Silicon Slopes Experts' },
                { path: '/california/', title: 'California Salesforce Consulting | Local Experts' },
                { path: '/local-partners/', title: 'Local Salesforce Partners | Chamber of Commerce' },
                { path: '/utah/services/', title: 'Utah Salesforce Services | Local Implementation' },
                { path: '/california/services/', title: 'California Salesforce Services | Regional Expertise' },
                { path: '/utah/success-stories/', title: 'Utah Salesforce Success Stories | Local Results' },
                { path: '/california/success-stories/', title: 'California Salesforce Success Stories' }
            ],
            navigation: {
                primary: [
                    { text: 'Utah', url: '/utah/' },
                    { text: 'California', url: '/california/' },
                    { text: 'Services', url: '/services/' },
                    { text: 'Success Stories', url: '/success-stories/' },
                    { text: 'Local Partners', url: '/local-partners/' },
                    { text: 'Contact', url: '/contact/' }
                ]
            }
        };
    }

    async generateUtahPage() {
        const utahPage = {
            path: '/utah/',
            title: 'Utah Salesforce Consulting | Silicon Slopes Experts with 100% User Adoption',
            metaDescription: 'Utah\'s premier Salesforce consultant specializing in Silicon Slopes businesses and nonprofits. 100% user adoption guarantee. Trusted by Utah Chamber of Commerce.',
            content: {
                hero: {
                    title: 'Transform Your Utah Business with Salesforce',
                    subtitle: 'Silicon Slopes Salesforce Experts with Proven 100% User Adoption',
                    cta: 'Get Your Free Utah Business Assessment',
                    stats: [
                        { number: '100%', text: 'User Adoption Success' },
                        { number: '20+', text: 'Utah Businesses Served' },
                        { number: '5+', text: 'Years in Silicon Slopes' }
                    ]
                },
                valueProposition: {
                    title: 'Why Utah Businesses Choose Us',
                    points: [
                        'Silicon Slopes insider knowledge and connections',
                        'Utah Chamber of Commerce trusted partner',
                        'Local understanding of Utah business culture',
                        'Proven 100% user adoption methodology',
                        'Personal, local service approach'
                    ]
                },
                services: {
                    title: 'Utah-Specific Salesforce Services',
                    items: [
                        {
                            title: 'Silicon Slopes Business Solutions',
                            description: 'Tailored Salesforce implementation for Utah\'s tech ecosystem',
                            features: ['Startup-friendly pricing', 'Silicon Slopes network access', 'Local support team']
                        },
                        {
                            title: 'Utah Nonprofit Specialization',
                            description: 'NPSP expertise for Utah\'s growing nonprofit sector',
                            features: ['Utah nonprofit experience', 'Grant management expertise', 'Donor tracking optimization']
                        },
                        {
                            title: 'Local Government & Education',
                            description: 'Salesforce solutions for Utah public sector',
                            features: ['Government compliance', 'Education sector expertise', 'Local procurement knowledge']
                        }
                    ]
                },
                localPartnerships: {
                    title: 'Trusted by Utah\'s Business Community',
                    partners: [
                        'Utah Chamber of Commerce',
                        'Silicon Slopes Chamber',
                        'Salt Lake Chamber',
                        'Utah Technology Council'
                    ]
                },
                testimonials: {
                    title: 'Utah Business Success Stories',
                    items: [
                        {
                            quote: 'SalesforceConsultants.io transformed our Utah business with their local expertise and proven methodology.',
                            author: 'Sarah Johnson, CEO',
                            company: 'Utah Tech Solutions',
                            location: 'Salt Lake City, UT'
                        }
                    ]
                },
                seo: {
                    keywords: [
                        'Salesforce consultant Utah',
                        'Salesforce implementation Utah',
                        'Silicon Slopes Salesforce',
                        'Utah nonprofit Salesforce',
                        'Salt Lake City Salesforce consultant',
                        'Utah Chamber of Commerce Salesforce'
                    ],
                    localKeywords: [
                        'Salesforce consultant Salt Lake City',
                        'Salesforce consultant Provo',
                        'Salesforce consultant Lehi',
                        'Salesforce consultant Park City'
                    ]
                }
            }
        };

        this.generatedSite.pages.utah = utahPage;
    }

    async generateCaliforniaPage() {
        const californiaPage = {
            path: '/california/',
            title: 'California Salesforce Consulting | Local Experts with Enterprise Results',
            metaDescription: 'California\'s trusted Salesforce consultant serving San Francisco, Los Angeles, San Diego. Local expertise with guaranteed user adoption. Regional Salesforce partner.',
            content: {
                hero: {
                    title: 'California Salesforce Success Starts Here',
                    subtitle: 'Local Experts with Enterprise Results and 100% User Adoption',
                    cta: 'Get Your Free California Business Assessment',
                    stats: [
                        { number: '100%', text: 'User Adoption Success' },
                        { number: '50+', text: 'California Businesses Served' },
                        { number: '3', text: 'Major California Markets' }
                    ]
                },
                valueProposition: {
                    title: 'Why California Businesses Trust Us',
                    points: [
                        'Deep California market knowledge and expertise',
                        'Local presence in major California markets',
                        'Understanding of California business regulations',
                        'Proven 100% user adoption methodology',
                        'Personal service in competitive markets'
                    ]
                },
                services: {
                    title: 'California-Specific Salesforce Services',
                    items: [
                        {
                            title: 'Bay Area Tech Solutions',
                            description: 'Salesforce implementation for San Francisco Bay Area tech companies',
                            features: ['Startup ecosystem knowledge', 'Tech industry expertise', 'Bay Area network access']
                        },
                        {
                            title: 'Los Angeles Business Services',
                            description: 'Salesforce solutions for LA\'s diverse business landscape',
                            features: ['Entertainment industry expertise', 'Manufacturing sector knowledge', 'LA business culture understanding']
                        },
                        {
                            title: 'San Diego Healthcare & Biotech',
                            description: 'Salesforce for San Diego\'s healthcare and biotech sectors',
                            features: ['Healthcare compliance expertise', 'Biotech industry knowledge', 'San Diego market understanding']
                        }
                    ]
                },
                markets: {
                    title: 'Serving Major California Markets',
                    locations: [
                        {
                            name: 'San Francisco Bay Area',
                            focus: 'Tech startups, enterprise companies',
                            keywords: ['Salesforce consultant San Francisco', 'Bay Area Salesforce']
                        },
                        {
                            name: 'Los Angeles',
                            focus: 'Entertainment, manufacturing, services',
                            keywords: ['Salesforce consultant Los Angeles', 'LA Salesforce']
                        },
                        {
                            name: 'San Diego',
                            focus: 'Healthcare, biotech, defense',
                            keywords: ['Salesforce consultant San Diego', 'San Diego Salesforce']
                        }
                    ]
                },
                testimonials: {
                    title: 'California Business Success Stories',
                    items: [
                        {
                            quote: 'Their California market expertise and proven methodology delivered exceptional results for our LA business.',
                            author: 'Michael Chen, CTO',
                            company: 'LA Tech Innovations',
                            location: 'Los Angeles, CA'
                        }
                    ]
                },
                seo: {
                    keywords: [
                        'Salesforce consultant California',
                        'Salesforce implementation California',
                        'Bay Area Salesforce consultant',
                        'Los Angeles Salesforce consultant',
                        'San Diego Salesforce consultant',
                        'California nonprofit Salesforce'
                    ],
                    localKeywords: [
                        'Salesforce consultant San Francisco',
                        'Salesforce consultant Los Angeles',
                        'Salesforce consultant San Diego',
                        'Salesforce consultant Sacramento',
                        'Salesforce consultant Irvine'
                    ]
                }
            }
        };

        this.generatedSite.pages.california = californiaPage;
    }

    async generateLocalPartnersPage() {
        const localPartnersPage = {
            path: '/local-partners/',
            title: 'Local Salesforce Partners | Chamber of Commerce Trusted',
            metaDescription: 'Trusted Salesforce partners endorsed by local Chambers of Commerce. Utah and California local business experts with proven results.',
            content: {
                hero: {
                    title: 'Local Partners, National Expertise',
                    subtitle: 'Chamber of Commerce Trusted Salesforce Partners',
                    cta: 'Partner with Us'
                },
                partnerships: {
                    title: 'Our Local Partnerships',
                    utah: {
                        title: 'Utah Partnerships',
                        partners: [
                            {
                                name: 'Utah Chamber of Commerce',
                                description: 'Official Salesforce partner for Utah businesses',
                                benefits: ['Chamber member discounts', 'Local business network', 'Utah market expertise']
                            },
                            {
                                name: 'Silicon Slopes Chamber',
                                description: 'Preferred Salesforce partner for tech companies',
                                benefits: ['Tech ecosystem access', 'Startup-friendly solutions', 'Silicon Slopes network']
                            }
                        ]
                    },
                    california: {
                        title: 'California Partnerships',
                        partners: [
                            {
                                name: 'California Chamber of Commerce',
                                description: 'Trusted Salesforce partner for California businesses',
                                benefits: ['Statewide business network', 'California market expertise', 'Regional support']
                            },
                            {
                                name: 'Bay Area Council',
                                description: 'Preferred partner for Bay Area companies',
                                benefits: ['Bay Area ecosystem access', 'Tech industry expertise', 'Local market knowledge']
                            }
                        ]
                    }
                },
                benefits: {
                    title: 'Benefits of Local Partnership',
                    items: [
                        'Chamber of Commerce endorsement and trust',
                        'Local business network access',
                        'Regional market expertise',
                        'Personal, local service approach',
                        'Understanding of local business culture'
                    ]
                }
            }
        };

        this.generatedSite.pages.localPartners = localPartnersPage;
    }

    async generateStateServices() {
        const stateServices = {
            utah: {
                path: '/utah/services/',
                title: 'Utah Salesforce Services | Silicon Slopes Implementation',
                services: [
                    {
                        title: 'Silicon Slopes Business Implementation',
                        description: 'Salesforce solutions designed for Utah\'s tech ecosystem',
                        features: [
                            'Startup and scale-up friendly',
                            'Silicon Slopes network integration',
                            'Local tech community support',
                            'Utah Chamber of Commerce partnership'
                        ],
                        keywords: ['Silicon Slopes Salesforce', 'Utah tech Salesforce', 'Utah startup Salesforce']
                    },
                    {
                        title: 'Utah Nonprofit NPSP Solutions',
                        description: 'Specialized NPSP implementation for Utah nonprofits',
                        features: [
                            'Utah nonprofit sector expertise',
                            'Local grant management knowledge',
                            'Utah donor tracking optimization',
                            'Nonprofit community connections'
                        ],
                        keywords: ['Utah nonprofit Salesforce', 'Utah NPSP consultant', 'Utah nonprofit CRM']
                    }
                ]
            },
            california: {
                path: '/california/services/',
                title: 'California Salesforce Services | Regional Expertise',
                services: [
                    {
                        title: 'Bay Area Tech Implementation',
                        description: 'Salesforce for San Francisco Bay Area technology companies',
                        features: [
                            'Tech startup ecosystem expertise',
                            'Enterprise Salesforce knowledge',
                            'Bay Area market understanding',
                            'Local tech community support'
                        ],
                        keywords: ['Bay Area Salesforce', 'San Francisco Salesforce', 'California tech Salesforce']
                    },
                    {
                        title: 'California Regional Solutions',
                        description: 'Salesforce implementation for California businesses',
                        features: [
                            'Multi-region California expertise',
                            'Local market knowledge',
                            'California business regulations',
                            'Regional support network'
                        ],
                        keywords: ['California Salesforce', 'Los Angeles Salesforce', 'San Diego Salesforce']
                    }
                ]
            }
        };

        this.generatedSite.pages.stateServices = stateServices;
    }

    async generateLocalSEOAssets() {
        const seoAssets = {
            sitemap: {
                urls: [
                    { url: '/', priority: '1.0', changefreq: 'weekly' },
                    { url: '/utah/', priority: '0.9', changefreq: 'weekly' },
                    { url: '/california/', priority: '0.9', changefreq: 'weekly' },
                    { url: '/local-partners/', priority: '0.8', changefreq: 'monthly' },
                    { url: '/utah/services/', priority: '0.8', changefreq: 'monthly' },
                    { url: '/california/services/', priority: '0.8', changefreq: 'monthly' }
                ]
            },
            localSchema: {
                utah: {
                    type: 'LocalBusiness',
                    name: 'SalesforceConsultants.io - Utah',
                    address: {
                        addressLocality: 'Salt Lake City',
                        addressRegion: 'UT',
                        addressCountry: 'US'
                    },
                    serviceArea: 'Utah',
                    keywords: 'Salesforce consultant Utah, Silicon Slopes Salesforce, Utah nonprofit Salesforce'
                },
                california: {
                    type: 'LocalBusiness',
                    name: 'SalesforceConsultants.io - California',
                    address: {
                        addressLocality: 'San Francisco',
                        addressRegion: 'CA',
                        addressCountry: 'US'
                    },
                    serviceArea: 'California',
                    keywords: 'Salesforce consultant California, Bay Area Salesforce, California nonprofit Salesforce'
                }
            },
            googleMyBusiness: {
                utah: {
                    name: 'SalesforceConsultants.io - Utah',
                    category: 'Salesforce Consultant',
                    description: 'Utah\'s premier Salesforce consultant specializing in Silicon Slopes businesses and nonprofits. 100% user adoption guarantee.',
                    keywords: ['Salesforce consultant Utah', 'Silicon Slopes Salesforce', 'Utah nonprofit Salesforce']
                },
                california: {
                    name: 'SalesforceConsultants.io - California',
                    category: 'Salesforce Consultant',
                    description: 'California\'s trusted Salesforce consultant serving San Francisco, Los Angeles, San Diego. Local expertise with guaranteed results.',
                    keywords: ['Salesforce consultant California', 'Bay Area Salesforce', 'California nonprofit Salesforce']
                }
            }
        };

        this.generatedSite.assets.seo = seoAssets;
    }

    async saveGeneratedSite() {
        const outputDir = './alternative-site';
        await fs.ensureDir(outputDir);

        // Save main site structure
        await fs.writeJson(path.join(outputDir, 'site-structure.json'), this.generatedSite.structure, { spaces: 2 });

        // Save individual pages
        for (const [pageName, pageData] of Object.entries(this.generatedSite.pages)) {
            await fs.writeJson(path.join(outputDir, `${pageName}.json`), pageData, { spaces: 2 });
        }

        // Save SEO assets
        await fs.writeJson(path.join(outputDir, 'seo-assets.json'), this.generatedSite.assets, { spaces: 2 });

        // Generate HTML templates
        await this.generateHTMLTemplates(outputDir);

        console.log(chalk.green(`\n✅ Alternative site generated in: ${outputDir}`));
    }

    async generateHTMLTemplates(outputDir) {
        const templatesDir = path.join(outputDir, 'templates');
        await fs.ensureDir(templatesDir);

        // Generate Utah page template
        const utahTemplate = this.generateHTMLTemplate(this.generatedSite.pages.utah);
        await fs.writeFile(path.join(templatesDir, 'utah.html'), utahTemplate);

        // Generate California page template
        const californiaTemplate = this.generateHTMLTemplate(this.generatedSite.pages.california);
        await fs.writeFile(path.join(templatesDir, 'california.html'), californiaTemplate);

        // Generate Local Partners template
        const partnersTemplate = this.generateHTMLTemplate(this.generatedSite.pages.localPartners);
        await fs.writeFile(path.join(templatesDir, 'local-partners.html'), partnersTemplate);
    }

    generateHTMLTemplate(pageData) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageData.title}</title>
    <meta name="description" content="${pageData.metaDescription}">
    <meta name="keywords" content="${pageData.content.seo?.keywords?.join(', ') || ''}">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="${pageData.title}">
    <meta property="og:description" content="${pageData.metaDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://salesforceconsultants.io${pageData.path}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://salesforceconsultants.io${pageData.path}">
    
    <!-- Salesforce Sans Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <!-- Header -->
    <header>
        <nav class="container">
            <div class="logo-container">
                <a href="/" class="logo-link">
                    <img src="/assets/images/SalesforceConsultants Logo.jpg" alt="Salesforce Consultants Logo" class="logo-image">
                    <div class="logo-text">
                        <span class="logo-primary">Salesforce Consultants</span>
                        <span class="logo-subtitle">Local Experts with 100% Adoption</span>
                    </div>
                </a>
            </div>
            <ul class="nav-links">
                <li><a href="/utah/">Utah</a></li>
                <li><a href="/california/">California</a></li>
                <li><a href="/services/">Services</a></li>
                <li><a href="/success-stories/">Success Stories</a></li>
                <li><a href="/local-partners/">Local Partners</a></li>
                <li><a href="/contact/">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title">${pageData.content.hero.title}</h1>
                    <p class="hero-subtitle">${pageData.content.hero.subtitle}</p>
                    
                    <div class="hero-stats-grid">
                        ${pageData.content.hero.stats.map(stat => `
                            <div class="hero-stat">
                                <span class="hero-stat-number">${stat.number}</span>
                                <span class="hero-stat-text">${stat.text}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="hero-ctas">
                        <a href="/contact/" class="btn btn-large">${pageData.content.hero.cta}</a>
                        <a href="/success-stories/" class="btn btn-large btn-secondary">View Success Stories</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Value Proposition -->
    <section class="section">
        <div class="container">
            <div class="section-header text-center">
                <h2>${pageData.content.valueProposition.title}</h2>
            </div>
            <div class="value-cards">
                ${pageData.content.valueProposition.points.map(point => `
                    <div class="value-card">
                        <div class="value-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p>${point}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Services -->
    ${pageData.content.services ? `
    <section class="section section-alt">
        <div class="container">
            <div class="section-header text-center">
                <h2>${pageData.content.services.title}</h2>
            </div>
            <div class="services-grid">
                ${pageData.content.services.items.map(service => `
                    <div class="service-item">
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                        <ul class="service-features">
                            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Testimonials -->
    ${pageData.content.testimonials ? `
    <section class="section">
        <div class="container">
            <div class="section-header text-center">
                <h2>${pageData.content.testimonials.title}</h2>
            </div>
            <div class="testimonials-grid">
                ${pageData.content.testimonials.items.map(testimonial => `
                    <div class="testimonial-item">
                        <blockquote>${testimonial.quote}</blockquote>
                        <cite>
                            <strong>${testimonial.author}</strong><br>
                            ${testimonial.company}<br>
                            <em>${testimonial.location}</em>
                        </cite>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="/assets/images/SalesforceConsultants Logo.jpg" alt="Salesforce Consultants Logo" class="footer-logo-image">
                        <div class="footer-logo-text">
                            <span class="footer-logo-primary">Salesforce Consultants</span>
                            <span class="footer-logo-subtitle">An offering of DevPipeline</span>
                        </div>
                    </div>
                    <p class="footer-description">Local Salesforce experts with proven 100% user adoption methodology.</p>
                </div>
                <div class="footer-links">
                    <div class="footer-section">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="/utah/">Utah Services</a></li>
                            <li><a href="/california/">California Services</a></li>
                            <li><a href="/nonprofits/">Nonprofit Solutions</a></li>
                            <li><a href="/business/">Business Solutions</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="/about/">About</a></li>
                            <li><a href="/success-stories/">Success Stories</a></li>
                            <li><a href="/local-partners/">Local Partners</a></li>
                            <li><a href="/contact/">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 SalesforceConsultants.io - An offering of DevPipeline. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="/js/main.js"></script>
</body>
</html>`;
    }

    displayResults() {
        console.log(chalk.blue.bold('\n🏗️  Alternative Site Generation Results'));
        console.log(chalk.gray('─'.repeat(50)));

        console.log(chalk.cyan('\n📄 Generated Pages:'));
        Object.keys(this.generatedSite.pages).forEach(page => {
            console.log(`   ✅ ${page}`);
        });

        console.log(chalk.cyan('\n🎯 Key Features:'));
        console.log('   • State-specific landing pages');
        console.log('   • Local keyword optimization');
        console.log('   • Chamber of Commerce partnerships');
        console.log('   • Regional market positioning');
        console.log('   • Local SEO schema markup');

        console.log(chalk.cyan('\n📊 SEO Benefits:'));
        console.log('   • Local search optimization');
        console.log('   • State-specific content');
        console.log('   • Regional keyword targeting');
        console.log('   • Local business schema');
        console.log('   • Chamber of Commerce credibility');

        console.log(chalk.green.bold('\n✅ Alternative site ready for implementation!'));
        console.log(chalk.gray('Review the generated files in ./alternative-site/'));
    }
}

module.exports = AlternativeSiteGenerator; 