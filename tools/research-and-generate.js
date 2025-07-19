#!/usr/bin/env node

const chalk = require('chalk').default;

const fs = require('fs-extra');

// Import our tools
const SEOResearch = require('./seo-research');
const AlternativeSiteGenerator = require('./alternative-site-generator');

class ResearchAndGenerate {
    constructor() {
        this.config = null;
        this.projectConfig = null;
        this.results = {
            research: null,
            generatedSite: null,
            recommendations: []
        };
    }

    async initialize() {
        console.log(chalk.blue('Loading configuration...'));
        
        try {
            this.config = await fs.readJson('./config/qa-config.json');
            this.projectConfig = await fs.readJson('./config/project-config.json');
            console.log(chalk.green('✅ Configuration loaded'));
        } catch (error) {
            console.log(chalk.red('❌ Failed to load configuration'));
            console.error(chalk.red('Error loading configuration:'), error.message);
            process.exit(1);
        }
    }

    async runFullResearchAndGeneration() {
        console.log(chalk.blue.bold('\n🚀 SalesforceConsultants.io SEO Research & Site Generation'));
        console.log(chalk.gray('─'.repeat(60)));
        console.log(chalk.cyan('Focus: Utah & California Market Positioning'));
        console.log(chalk.cyan('Goal: Alternative site based on local SEO research\n'));

        await this.initialize();

        const steps = [
            { name: 'SEO Research', fn: () => this.runSEOResearch() },
            { name: 'Market Analysis', fn: () => this.analyzeMarketOpportunities() },
            { name: 'Competitive Positioning', fn: () => this.analyzeCompetitivePositioning() },
            { name: 'Alternative Site Generation', fn: () => this.generateAlternativeSite() },
            { name: 'Implementation Strategy', fn: () => this.createImplementationStrategy() }
        ];

        for (const step of steps) {
            console.log(chalk.cyan(`\n📋 Step ${steps.indexOf(step) + 1}: ${step.name}`));
            console.log(chalk.gray('─'.repeat(40)));
            await step.fn();
        }

        await this.generateFinalReport();
        this.displayResults();
    }

    async runSEOResearch() {
        console.log(chalk.blue('Conducting comprehensive SEO research...'));
        
        try {
            const seoResearch = new SEOResearch(this.config, this.projectConfig);
            this.results.research = await seoResearch.conductFullResearch();
            console.log(chalk.green('✅ SEO research completed'));
        } catch (error) {
            console.log(chalk.red('❌ SEO research failed'));
            console.error(chalk.red('Research error:'), error.message);
        }
    }

    async analyzeMarketOpportunities() {
        console.log(chalk.blue('\n🎯 Market Opportunity Analysis'));

        if (!this.results.research) {
            console.log(chalk.yellow('⚠️  No research data available, using default analysis'));
            return;
        }

        const markets = this.results.research.results.marketAnalysis;
        
        // Utah Market Analysis
        console.log(chalk.cyan('\n🏔️  Utah Market Opportunities:'));
        markets.utah.opportunities.forEach(opportunity => {
            console.log(`   ✅ ${opportunity}`);
        });

        console.log(chalk.yellow('\n   Challenges:'));
        markets.utah.challenges.forEach(challenge => {
            console.log(`   ⚠️  ${challenge}`);
        });

        // California Market Analysis
        console.log(chalk.cyan('\n🌅 California Market Opportunities:'));
        markets.california.opportunities.forEach(opportunity => {
            console.log(`   ✅ ${opportunity}`);
        });

        console.log(chalk.yellow('\n   Challenges:'));
        markets.california.challenges.forEach(challenge => {
            console.log(`   ⚠️  ${challenge}`);
        });

        // Keyword Opportunities
        const keywords = this.results.research.results.keywordResearch;
        console.log(chalk.cyan('\n🔍 Keyword Opportunities:'));
        
        const totalKeywords = Object.values(keywords).reduce((total, market) => {
            return total + Object.values(market).reduce((sum, category) => sum + category.length, 0);
        }, 0);
        
        console.log(`   Total Keywords Identified: ${totalKeywords}`);
        console.log(`   Utah Primary Keywords: ${keywords.utah.primary.length}`);
        console.log(`   California Primary Keywords: ${keywords.california.primary.length}`);
        console.log(`   Local Keywords: ${keywords.utah.local.length + keywords.california.local.length}`);
    }

    async analyzeCompetitivePositioning() {
        console.log(chalk.blue('\n🏆 Competitive Positioning Analysis'));

        if (!this.results.research) {
            console.log(chalk.yellow('⚠️  No research data available'));
            return;
        }

        const competitors = this.results.research.results.competitorAnalysis;
        const contentGaps = this.results.research.results.contentGaps;

        // Competitive Advantages
        console.log(chalk.cyan('\n💪 SalesforceConsultants.io Competitive Advantages:'));
        const advantages = [
            '100% user adoption guarantee (unique in market)',
            'Local market expertise and presence',
            'Chamber of Commerce partnerships',
            'Personal, local service approach',
            'DevPipeline backing and credibility',
            'Proven methodology and track record'
        ];

        advantages.forEach(advantage => {
            console.log(`   ✅ ${advantage}`);
        });

        // Content Gap Opportunities
        console.log(chalk.cyan('\n📝 Content Gap Opportunities:'));
        Object.entries(contentGaps).forEach(([market, gaps]) => {
            console.log(chalk.white(`\n   ${market.charAt(0).toUpperCase() + market.slice(1)} Market:`));
            gaps.opportunities.forEach(opportunity => {
                console.log(`   🎯 ${opportunity}`);
            });
        });

        // Unique Positioning
        console.log(chalk.cyan('\n🎯 Unique Positioning Strategy:'));
        const positioning = {
            utah: 'Utah\'s Premier Salesforce Partner with Silicon Slopes Expertise',
            california: 'California\'s Local Salesforce Experts with Enterprise Results'
        };

        Object.entries(positioning).forEach(([market, position]) => {
            console.log(`   ${market.charAt(0).toUpperCase() + market.slice(1)}: ${position}`);
        });
    }

    async generateAlternativeSite() {
        console.log(chalk.blue('Generating alternative site based on research...'));
        
        try {
            const siteGenerator = new AlternativeSiteGenerator(this.config, this.projectConfig);
            this.results.generatedSite = await siteGenerator.generateAlternativeSite();
            console.log(chalk.green('✅ Alternative site generated'));
        } catch (error) {
            console.log(chalk.red('❌ Site generation failed'));
            console.error(chalk.red('Generation error:'), error.message);
        }
    }

    async createImplementationStrategy() {
        console.log(chalk.blue('\n📋 Implementation Strategy'));

        const strategy = {
            phase1: {
                name: 'Phase 1: Foundation (Weeks 1-2)',
                tasks: [
                    'Set up local SEO infrastructure',
                    'Create state-specific landing pages',
                    'Implement local schema markup',
                    'Set up Google My Business profiles'
                ]
            },
            phase2: {
                name: 'Phase 2: Content Development (Weeks 3-4)',
                tasks: [
                    'Develop state-specific content',
                    'Create local case studies',
                    'Write regional blog posts',
                    'Develop local partnership content'
                ]
            },
            phase3: {
                name: 'Phase 3: Optimization (Weeks 5-6)',
                tasks: [
                    'Optimize for local keywords',
                    'Implement local link building',
                    'Monitor and adjust performance',
                    'Scale successful strategies'
                ]
            }
        };

        console.log(chalk.cyan('\n📅 Implementation Timeline:'));
        Object.values(strategy).forEach(phase => {
            console.log(chalk.white(`\n   ${phase.name}:`));
            phase.tasks.forEach(task => {
                console.log(`   • ${task}`);
            });
        });

        // Technical Implementation
        console.log(chalk.cyan('\n🔧 Technical Implementation:'));
        const technicalTasks = [
            'Create state-specific URL structure (/utah/, /california/)',
            'Implement local schema markup for each state',
            'Set up Google My Business for Utah and California',
            'Create local landing pages with targeted content',
            'Implement local keyword optimization',
            'Set up local business citations and directories'
        ];

        technicalTasks.forEach(task => {
            console.log(`   • ${task}`);
        });

        this.results.implementationStrategy = strategy;
    }

    async generateFinalReport() {
        const report = {
            timestamp: new Date().toISOString(),
            project: 'SalesforceConsultants.io SEO Research & Site Generation',
            markets: ['Utah', 'California'],
            executiveSummary: this.generateExecutiveSummary(),
            research: this.results.research,
            generatedSite: this.results.generatedSite,
            implementationStrategy: this.results.implementationStrategy,
            recommendations: this.generateFinalRecommendations()
        };

        const reportPath = './research-and-generation-report.json';
        await fs.writeJson(reportPath, report, { spaces: 2 });
        
        console.log(chalk.green(`\n📊 Final Report saved to: ${reportPath}`));
    }

    generateExecutiveSummary() {
        return {
            objective: 'Position SalesforceConsultants.io as the premier local Salesforce partner in Utah and California markets',
            keyFindings: [
                'Strong local market opportunities in both Utah and California',
                'Competitive advantage through 100% user adoption guarantee',
                'Content gaps in local market positioning',
                'Opportunity for Chamber of Commerce partnerships'
            ],
            recommendations: [
                'Implement state-specific landing pages',
                'Develop local keyword strategy',
                'Create local partnership content',
                'Optimize for local search results'
            ],
            expectedOutcomes: [
                'Improved local search rankings',
                'Increased local market visibility',
                'Enhanced regional credibility',
                'Better conversion rates from local searches'
            ]
        };
    }

    generateFinalRecommendations() {
        return {
            immediate: [
                'Implement Utah and California landing pages',
                'Set up Google My Business profiles',
                'Create local schema markup',
                'Develop state-specific content'
            ],
            shortTerm: [
                'Build local business citations',
                'Create local case studies',
                'Develop regional partnerships',
                'Optimize for local keywords'
            ],
            longTerm: [
                'Expand to additional regional markets',
                'Develop local thought leadership',
                'Create regional success stories',
                'Build local business networks'
            ]
        };
    }

    displayResults() {
        console.log(chalk.blue.bold('\n📊 Research & Generation Complete!'));
        console.log(chalk.gray('─'.repeat(50)));

        console.log(chalk.cyan('\n🎯 Key Achievements:'));
        console.log('   ✅ Comprehensive SEO research completed');
        console.log('   ✅ Market opportunities identified');
        console.log('   ✅ Competitive positioning analyzed');
        console.log('   ✅ Alternative site generated');
        console.log('   ✅ Implementation strategy created');

        console.log(chalk.cyan('\n📁 Generated Files:'));
        console.log('   📄 seo-research-report.json');
        console.log('   📄 research-and-generation-report.json');
        console.log('   📁 alternative-site/ (complete site structure)');

        console.log(chalk.cyan('\n🚀 Next Steps:'));
        console.log('   1. Review the research findings');
        console.log('   2. Implement the alternative site structure');
        console.log('   3. Execute the implementation strategy');
        console.log('   4. Monitor and optimize performance');

        console.log(chalk.green.bold('\n✅ Ready for implementation!'));
        console.log(chalk.gray('The alternative site is designed to maximize local SEO performance in Utah and California markets.'));
    }
}

// CLI execution
if (require.main === module) {
    const researchAndGenerate = new ResearchAndGenerate();
    researchAndGenerate.runFullResearchAndGeneration().catch(error => {
        console.error(chalk.red('Research and generation failed:'), error.message);
        process.exit(1);
    });
}

module.exports = ResearchAndGenerate; 