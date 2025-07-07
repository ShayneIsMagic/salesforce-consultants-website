# Deployment Guide - SalesforceConsultants.io

This guide covers deploying the SalesforceConsultants.io website to various hosting platforms.

## 🚀 Quick Start

### Local Development
1. Clone the repository
2. Navigate to the project directory
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open http://localhost:8000 in your browser

### Production Deployment

## 📋 Pre-Deployment Checklist

- [ ] Update all contact information and phone numbers
- [ ] Replace placeholder images with actual content
- [ ] Configure analytics tracking (Google Analytics 4)
- [ ] Set up form submission handling
- [ ] Test all links and navigation
- [ ] Optimize images for web
- [ ] Minify CSS and JavaScript (optional)
- [ ] Set up SSL certificate
- [ ] Configure custom domain

## 🌐 Hosting Options

### 1. Netlify (Recommended)

**Pros**: Free tier, automatic deployments, SSL, CDN
**Cons**: Limited server-side functionality

**Steps**:
1. Connect your GitHub repository to Netlify
2. Set build command: `echo "Static site - no build required"`
3. Set publish directory: `/` (root)
4. Configure custom domain in Netlify dashboard
5. Set up form handling in Netlify dashboard

**Form Handling**:
```html
<!-- Add to form action -->
<form action="/submit-contact" method="POST" data-netlify="true">
```

### 2. Vercel

**Pros**: Fast, global CDN, automatic deployments
**Cons**: Limited free tier

**Steps**:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts to deploy
4. Configure custom domain in Vercel dashboard

### 3. GitHub Pages

**Pros**: Free, integrated with GitHub
**Cons**: Limited features, slower than CDN

**Steps**:
1. Enable GitHub Pages in repository settings
2. Select source branch (usually `main`)
3. Configure custom domain in repository settings
4. Add CNAME file to repository

### 4. AWS S3 + CloudFront

**Pros**: Highly scalable, cost-effective
**Cons**: More complex setup

**Steps**:
1. Create S3 bucket for website hosting
2. Upload all files to S3 bucket
3. Configure bucket for static website hosting
4. Set up CloudFront distribution
5. Configure custom domain and SSL

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:
```env
# Analytics
GA_TRACKING_ID=G-XXXXXXXXXX

# Contact Form
FORM_SUBMISSION_URL=https://your-form-handler.com/submit

# Domain
SITE_URL=https://salesforceconsultants.io
```

### Analytics Setup

Add Google Analytics 4 tracking code to `<head>` section:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Form Handling

For production, you'll need a form handler. Options include:

1. **Netlify Forms** (if using Netlify)
2. **Formspree** (third-party service)
3. **Custom backend** (Node.js, PHP, etc.)

Example with Formspree:
```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

## 📱 Performance Optimization

### Image Optimization

1. Use WebP format where possible
2. Compress images (aim for <200KB each)
3. Implement lazy loading
4. Use appropriate image sizes for different devices

### Code Optimization

1. Minify CSS and JavaScript
2. Enable Gzip compression
3. Use CDN for external resources
4. Implement caching headers

### SEO Optimization

1. Add structured data markup
2. Optimize meta tags for each page
3. Create XML sitemap
4. Submit to Google Search Console

## 🔒 Security

### SSL Certificate

- Enable HTTPS for all pages
- Redirect HTTP to HTTPS
- Use HSTS headers

### Content Security Policy

Add CSP headers:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

### Form Security

- Implement CSRF protection
- Validate all form inputs
- Use reCAPTCHA for spam prevention
- Sanitize user inputs

## 📊 Monitoring

### Performance Monitoring

- Set up Google PageSpeed Insights
- Monitor Core Web Vitals
- Track page load times
- Monitor server response times

### Analytics

- Google Analytics 4 for user behavior
- Google Search Console for SEO
- Form submission tracking
- Conversion tracking

### Error Monitoring

- Set up error logging
- Monitor 404 errors
- Track broken links
- Monitor form submission failures

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Forms not submitting**: Check form action URL and handler configuration
2. **Images not loading**: Verify file paths and image optimization
3. **CSS not applying**: Check file paths and caching
4. **Analytics not tracking**: Verify tracking code and domain configuration

### Performance Issues

1. **Slow loading**: Optimize images and enable compression
2. **Mobile performance**: Test on actual devices
3. **SEO issues**: Check meta tags and structured data

## 📞 Support

For deployment issues:
- Check hosting provider documentation
- Review browser console for errors
- Test on multiple devices and browsers
- Verify all links and forms work correctly

---

**Last updated**: January 2024
**Version**: 1.0.0 