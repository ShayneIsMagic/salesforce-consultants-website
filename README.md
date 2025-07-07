# SalesforceConsultants.io - Professional Website

A comprehensive Salesforce consulting website built with modern web technologies, featuring specialized solutions for nonprofits and businesses.

## 🚀 Quick Start

### Local Development
```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Deployment
This site is configured for Cloudflare Pages deployment with the following settings:
- Build command: `echo "Static site - no build required"`
- Build output directory: `/` (root)
- Node.js version: 18

## 📁 Project Structure

```
salesforce-consultants/
├── index.html                 # Homepage
├── css/                       # Stylesheets
│   ├── main.css              # Main styles (consolidated)
│   ├── nonprofit.css         # Nonprofit page styles
│   ├── business.css          # Business page styles
│   └── contact.css           # Contact page styles
├── js/                        # JavaScript files
│   └── main.js               # Main JavaScript (consolidated)
├── assets/                    # Static assets
│   └── images/               # Images and media
├── templates/                 # Reusable components
│   ├── header.html           # Header template
│   └── footer.html           # Footer template
├── nonprofits/               # Nonprofit solutions page
│   └── index.html
├── business/                 # Business solutions page
│   └── index.html
├── success-stories/          # Case studies page
│   └── index.html
├── about/                    # About us page
│   └── index.html
├── contact/                  # Contact page
│   └── index.html
├── services/                 # Services overview page
│   └── index.html
├── docs/                     # Documentation
├── public/                   # Public assets for deployment
├── wrangler.toml            # Cloudflare Pages config
├── package.json             # Dependencies
└── README.md               # This file
```

## 🎨 Design System

### Colors
- **Primary**: `#3aafaa` (Salesforce-inspired teal)
- **Secondary**: `#17252b` (Dark blue-gray)
- **Accent**: `#3aafaa` (Matching primary)
- **Success**: `#3aafaa` (Teal)
- **Background**: `#f5f5f5` (Light gray)

### Typography
- **Primary Font**: Inter (Salesforce Sans alternative)
- **Secondary Font**: Source Sans Pro
- **Weights**: 300, 400, 500, 600, 700, 800

### Spacing System
- **XS**: 8px
- **SM**: 16px
- **MD**: 24px
- **LG**: 32px
- **XL**: 48px
- **XXL**: 64px
- **XXXL**: 96px

## 📄 Pages

### Homepage (`index.html`)
- Hero section with dual market entry points
- Path selection for nonprofits vs businesses
- Success story highlights
- Service overview
- Contact information

### Nonprofit Solutions (`nonprofits/index.html`)
- NPSP implementation expertise
- Donor management solutions
- Grant tracking and reporting
- Fundraising automation
- Volunteer management

### Business Solutions (`business/index.html`)
- Sales process optimization
- Revenue operations alignment
- Customer service excellence
- Marketing automation
- AI-powered solutions

### Success Stories (`success-stories/index.html`)
- LA Chamber of Commerce case study
- Additional client success stories
- Results and metrics
- Testimonials

### About Us (`about/index.html`)
- Team story and mission
- 20+ Salesforce certifications
- Expertise areas
- Partners and clients

### Contact (`contact/index.html`)
- Contact form
- Service area information
- Free assessment offer
- Contact details

### Services (`services/index.html`)
- Comprehensive service catalog
- Implementation phases
- Training programs
- Integration services

## 🔧 Features

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Flexible grid system
- Touch-friendly navigation

### Interactive Elements
- Dropdown navigation
- Mobile menu
- Form validation
- Smooth scrolling
- Hover effects

### SEO Optimization
- Semantic HTML structure
- Meta tags and Open Graph
- Canonical URLs
- Structured data ready

### Performance
- Optimized CSS and JavaScript
- Minimal dependencies
- Fast loading times
- CDN-ready structure

## 🛠 Development Workflow

### File Organization
1. **HTML**: Each page in its own directory with `index.html`
2. **CSS**: Consolidated styles in `css/main.css` with page-specific overrides
3. **JavaScript**: Single `js/main.js` file with all functionality
4. **Assets**: Images and media in `assets/images/`
5. **Templates**: Reusable header/footer in `templates/`

### Best Practices
- DRY (Don't Repeat Yourself) principle
- Consistent naming conventions
- Modular CSS architecture
- Progressive enhancement
- Accessibility compliance

## 📊 Analytics & Tracking

The site is prepared for:
- Google Analytics integration
- Conversion tracking
- Form submission monitoring
- User behavior analysis

## 🔒 Security

- HTTPS ready
- Form validation
- XSS protection
- Secure headers configuration

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚀 Deployment

### Cloudflare Pages
1. Connect repository to Cloudflare Pages
2. Configure build settings in `wrangler.toml`
3. Deploy automatically on push to main branch

### Manual Deployment
1. Upload files to web server
2. Ensure proper file permissions
3. Configure server for SPA routing if needed

## 📞 Support

For technical support or questions about the website:
- **Email**: info@salesforceconsultants.io
- **Phone**: 385-309-0807

---

**Built with ❤️ for SalesforceConsultants.io** 