# Cloudflare Pages Deployment Guide

This guide covers deploying the SalesforceConsultants.io website to Cloudflare Pages.

## 🚀 Quick Start

### Prerequisites
- GitHub account with your code repository
- Cloudflare account (free)

### Deployment Steps

1. **Push Code to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/salesforce-consultants-website.git
   git push -u origin main
   ```

2. **Deploy to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages**
   - Click **"Create a project"**
   - Choose **"Connect to Git"**
   - Select your repository
   - Configure build settings (see below)

## ⚙️ Build Configuration

### Build Settings
- **Framework preset**: `None` (Static HTML)
- **Build command**: Leave empty
- **Build output directory**: `/` (root)
- **Root directory**: `/` (root)

### Environment Variables
```
NODE_VERSION=18
```

## 🌐 Custom Domain Setup

### 1. Add Custom Domain
- In your Pages project, go to **"Custom domains"**
- Click **"Set up a custom domain"**
- Enter: `salesforceconsultants.io`

### 2. DNS Configuration
If your domain is already on Cloudflare:
- DNS records will be automatically created
- SSL certificate will be automatically provisioned

If your domain is elsewhere:
- Add CNAME record: `salesforceconsultants.io` → `your-project.pages.dev`
- Or update nameservers to Cloudflare's

## 🔧 Cloudflare Optimizations

### 1. Page Rules
Create these page rules in Cloudflare:

**Cache Everything**
- URL: `salesforceconsultants.io/*`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 4 hours

**Security Headers**
- URL: `salesforceconsultants.io/*`
- Settings:
  - Security Level: High
  - Browser Integrity Check: On

### 2. Workers (Optional)
For advanced functionality, you can add Cloudflare Workers:

```javascript
// Example: Form handling worker
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'POST' && request.url.includes('/submit-contact')) {
    // Handle form submission
    const formData = await request.formData()
    // Process form data
    return new Response('Success', { status: 200 })
  }
  
  return fetch(request)
}
```

## 📊 Analytics Setup

### 1. Google Analytics
Add to all HTML files in `<head>`:
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

### 2. Cloudflare Analytics
- Enable in your Pages project settings
- Provides real-time analytics
- No additional code required

## 🔒 Security Features

### 1. SSL/TLS
- Automatically enabled
- Force HTTPS redirect
- HSTS headers included

### 2. Security Headers
Already configured in `public/_headers`:
- X-Frame-Options
- X-Content-Type-Options
- Content-Security-Policy
- Referrer-Policy

### 3. DDoS Protection
- Automatically included
- No configuration needed

## ⚡ Performance Features

### 1. Global CDN
- 200+ locations worldwide
- Automatic optimization
- Edge caching

### 2. Image Optimization
- Automatic WebP conversion
- Responsive images
- Lazy loading support

### 3. Minification
- Automatic CSS/JS minification
- HTML optimization
- Gzip compression

## 🔄 Continuous Deployment

### Automatic Deployments
- Deploys on every push to `main` branch
- Preview deployments for pull requests
- Automatic rollback on failures

### Manual Deployments
- Trigger from Cloudflare dashboard
- Deploy specific branches
- Clear cache when needed

## 📱 Mobile Optimization

### 1. Responsive Design
- Already implemented in CSS
- Mobile-first approach
- Touch-friendly navigation

### 2. Performance
- Optimized for mobile networks
- Reduced payload sizes
- Fast loading times

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build settings
   - Verify file paths
   - Check for syntax errors

2. **Custom Domain Issues**
   - Verify DNS records
   - Check SSL certificate status
   - Clear browser cache

3. **Performance Issues**
   - Check Page Rules
   - Optimize images
   - Review caching settings

### Support
- Cloudflare documentation: https://developers.cloudflare.com/pages/
- Community forum: https://community.cloudflare.com/
- Status page: https://www.cloudflarestatus.com/

## 📈 Monitoring

### 1. Performance Monitoring
- Page load times
- Core Web Vitals
- Error rates

### 2. Analytics
- Page views
- User behavior
- Conversion tracking

### 3. Security
- DDoS attacks
- Malicious requests
- SSL certificate status

---

**Last updated**: January 2024
**Version**: 1.0.0 