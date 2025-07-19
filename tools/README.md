# Zero Barriers QA Suite for Salesforce Consultants

A comprehensive quality assurance toolkit designed specifically for the Salesforce Consultants website, providing automated testing, competitor analysis, and deployment validation.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run complete QA suite
npm run qa:all

# Run specific tests
npm run qa:content      # Content validation
npm run qa:perf         # Performance audit
npm run qa:a11y         # Accessibility tests
npm run qa:visual       # Visual regression tests
npm run qa:competitor   # Competitor analysis

# Pre-deployment checks
npm run deploy:check
```

## 📋 Available Tools

### 1. Content Validator (`content-validator.js`)
Validates all pages for content quality, SEO elements, and required components.

**Features:**
- SEO meta tag validation
- Content quality assessment
- Accessibility compliance checks
- Functionality validation
- Form and link testing

**Usage:**
```bash
npm run qa:content
```

### 2. Performance Auditor (`performance-auditor.js`)
Runs comprehensive performance tests using Lighthouse and Puppeteer.

**Features:**
- Lighthouse audits (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals measurement
- Load time analysis
- Resource optimization checks
- Performance benchmarking

**Usage:**
```bash
npm run qa:perf
```

### 3. Accessibility Tester (`accessibility-tester.js`)
Ensures WCAG 2.1 AA compliance across all pages.

**Features:**
- Automated axe-core testing
- Manual accessibility checks
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation

**Usage:**
```bash
npm run qa:a11y
```

### 4. Visual Tester (`visual-tester.js`)
Performs visual regression testing across multiple devices.

**Features:**
- Cross-device screenshot comparison
- Visual regression detection
- Layout issue identification
- Responsive design validation
- Baseline management

**Usage:**
```bash
npm run qa:visual
```

### 5. Competitor Analyzer (`competitor-analysis.js`)
Analyzes competitor websites for strategic insights.

**Features:**
- Performance benchmarking
- Content analysis
- SEO comparison
- Accessibility assessment
- Strategic recommendations

**Usage:**
```bash
npm run qa:competitor
```

### 6. Deployment Checker (`deployment-checker.js`)
Validates deployment readiness and security.

**Features:**
- File structure validation
- Configuration checks
- Security header verification
- Performance asset optimization
- Pre-deployment validation

**Usage:**
```bash
npm run deploy:check
```

## 🎯 Target Metrics

### Performance Targets
- **Lighthouse Performance**: 90+
- **Lighthouse Accessibility**: 95+
- **Lighthouse Best Practices**: 90+
- **Lighthouse SEO**: 95+
- **Load Time**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds

### Content Targets
- **Word Count**: 300+ words per page
- **SEO Elements**: All required meta tags present
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile Responsiveness**: All devices supported

## 📊 Competitor Analysis

The toolkit analyzes these competitors:
- **Simplus** (https://www.simplus.com/)
- **Eide Bailly** (https://www.eidebailly.com/landing/campaigns/salesforce-consulting)
- **STG Consulting** (https://stgconsulting.com/)

**Analysis includes:**
- Performance benchmarking
- Content strategy comparison
- SEO optimization assessment
- User experience evaluation
- Strategic recommendations

## 🔧 Configuration

### Project Configuration (`config/project-config.json`)
```json
{
  "projectName": "Salesforce Consultants",
  "siteUrl": "https://salesforceconsultants.io",
  "brandColors": {
    "primary": "#3aafaa",
    "secondary": "#17252b"
  },
  "pages": [
    "/",
    "/about/",
    "/services/",
    "/nonprofits/",
    "/business/",
    "/success-stories/",
    "/contact/"
  ],
  "competitors": [
    {
      "name": "Simplus",
      "url": "https://www.simplus.com/",
      "focus": "Salesforce consulting and implementation"
    }
  ]
}
```

### QA Configuration (`config/qa-config.json`)
```json
{
  "lighthouse": {
    "performance": 90,
    "accessibility": 95,
    "bestPractices": 90,
    "seo": 95
  },
  "accessibility": {
    "standard": "WCAG21AA",
    "tags": ["wcag2a", "wcag2aa", "wcag21aa"]
  },
  "visual": {
    "threshold": 0.1,
    "devices": [
      {"name": "desktop", "width": 1920, "height": 1080},
      {"name": "tablet", "width": 768, "height": 1024},
      {"name": "mobile", "width": 375, "height": 667}
    ]
  }
}
```

## 📈 Reports and Outputs

### QA Report (`qa-report.json`)
Comprehensive report containing all test results, metrics, and recommendations.

### Deployment Report (`deployment-report.json`)
Pre-deployment validation report with security and performance checks.

### Visual Screenshots
- **Location**: `tests/visual/screenshots/`
- **Baselines**: `tests/visual/baseline/`
- **Diff Images**: Generated for visual regression detection

## 🎨 Salesforce Consultants Brand Compliance

The toolkit ensures compliance with the Salesforce Consultants brand:

### Color Palette
- **Primary**: #3aafaa (Salesforce teal)
- **Secondary**: #17252b (Dark blue)
- **Accent**: #3aafaa (Matching primary)

### Typography
- **Primary Font**: Inter
- **Secondary Font**: Source Sans Pro
- **Fallback**: System fonts

### Design System
- **Spacing**: 8px grid system
- **Border Radius**: 8px
- **Shadows**: Subtle elevation system
- **Responsive**: Mobile-first approach

## 🚀 Deployment Workflow

### 1. Pre-Deployment Checks
```bash
npm run deploy:check
```

### 2. Complete QA Suite
```bash
npm run qa:all
```

### 3. Review Results
- Check `qa-report.json` for detailed results
- Address any critical issues
- Review competitor analysis insights

### 4. Deploy
- Ensure all tests pass
- Deploy to staging environment
- Run final validation
- Deploy to production

## 🔍 Troubleshooting

### Common Issues

**Puppeteer Launch Failures**
```bash
# On macOS/Linux, ensure proper permissions
sudo chmod +x /usr/local/bin/chromium

# On Windows, check Chrome installation
npm install puppeteer --force
```

**Lighthouse Timeout**
```bash
# Increase timeout in config/qa-config.json
{
  "puppeteer": {
    "timeout": 60000
  }
}
```

**Visual Test Failures**
```bash
# Regenerate baselines
rm -rf tests/visual/baseline/*
npm run qa:visual
```

### Performance Optimization

**For Faster Tests**
```bash
# Run tests in parallel (modify qa-runner.js)
# Reduce screenshot quality
# Limit concurrent browser instances
```

## 📚 Best Practices

### Content Strategy
- Maintain 300+ words per page
- Include value propositions
- Add social proof elements
- Optimize for target keywords

### Performance Optimization
- Optimize images (WebP format)
- Minify CSS and JavaScript
- Implement lazy loading
- Use CDN for assets

### Accessibility
- Provide alt text for all images
- Ensure proper heading structure
- Test keyboard navigation
- Validate color contrast

### SEO
- Include meta descriptions
- Use proper canonical URLs
- Implement structured data
- Optimize for Core Web Vitals

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update configuration files
4. Document changes in README
5. Run full QA suite before submitting

## 📞 Support

For questions or issues:
- **Email**: shayne@devpipeline.com
- **Project**: Salesforce Consultants QA Suite
- **Documentation**: See individual tool READMEs

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Compatibility**: Node.js 14+, Puppeteer 21+, Lighthouse 11+ 