# 🚀 Deployment Guide - Cloudflare Pages

This guide covers deploying the SalesforceConsultants.io website to Cloudflare Pages with proper environment management.

## 📋 Prerequisites

- GitHub repository with the project
- Cloudflare account (free tier available)
- Domain name (optional, for custom domain setup)

## 🌿 Branch Strategy

### **Production Branch (`main`)**
- **Purpose**: Live production website
- **Deployment**: Automatic deployment to production domain
- **URL**: `salesforceconsultants.io` (custom domain)
- **Use Case**: Client-facing, fully tested features

### **Staging Branch (`staging`)**
- **Purpose**: Pre-production testing and QA
- **Deployment**: Automatic deployment to staging subdomain
- **URL**: `staging.salesforceconsultants.io`
- **Use Case**: Client review, final testing before production

### **Development Branch (`dev`)**
- **Purpose**: Active development and feature testing
- **Deployment**: Automatic deployment to development subdomain
- **URL**: `dev.salesforceconsultants.io`
- **Use Case**: Feature development, internal testing

## 🔧 Cloudflare Pages Setup

### **Step 1: Create Cloudflare Pages Project**

1. **Log into Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Compute** → **Workers & Pages**

2. **Create New Pages Project**
   - Click **Create application**
   - Select **Pages**
   - Choose **Connect to Git**

3. **Connect GitHub Repository**
   - Select your GitHub account
   - Choose `salesforce-consultants-website` repository
   - Authorize Cloudflare access

### **Step 2: Configure Production Environment**

1. **Project Settings**
   - **Project name**: `salesforce-consultants-production`
   - **Production branch**: `main`
   - **Framework preset**: None (Static HTML)
   - **Build command**: `echo "Static site - no build required"`
   - **Build output directory**: `/` (root)

2. **Environment Variables** (if needed)
   - Add any environment-specific variables
   - For static sites, usually not required

### **Step 3: Configure Staging Environment**

1. **Add Environment**
   - Go to **Settings** → **Environment variables**
   - Add **Preview** environment
   - **Branch**: `staging`

2. **Staging Settings**
   - **Environment name**: `staging`
   - **Branch**: `staging`
   - **Build command**: `echo "Static site - no build required"`
   - **Build output directory**: `/`

### **Step 4: Configure Development Environment**

1. **Add Development Environment**
   - Add another **Preview** environment
   - **Branch**: `dev`

2. **Development Settings**
   - **Environment name**: `development`
   - **Branch**: `dev`
   - **Build command**: `echo "Static site - no build required"`
   - **Build output directory**: `/`

## 🌐 Custom Domain Setup

### **Primary Domain (Production)**

1. **Add Custom Domain**
   - Go to **Custom domains** tab
   - Click **Set up a custom domain**
   - Enter: `salesforceconsultants.io`

2. **DNS Configuration**
   - **Option A**: Migrate domain to Cloudflare DNS (recommended)
   - **Option B**: Point DNS to Cloudflare nameservers
   - **Option C**: Add CNAME record pointing to Pages URL

3. **SSL/TLS Settings**
   - **Encryption mode**: Full (strict)
   - **Always use HTTPS**: Enabled
   - **Minimum TLS Version**: 1.2

### **Subdomains (Staging & Development)**

1. **Staging Subdomain**
   - Add custom domain: `staging.salesforceconsultants.io`
   - Configure DNS record (CNAME to staging Pages URL)

2. **Development Subdomain**
   - Add custom domain: `dev.salesforceconsultants.io`
   - Configure DNS record (CNAME to dev Pages URL)

## 🔄 Deployment Workflow

### **Development Process**

1. **Feature Development**
   ```bash
   git checkout dev
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin dev
   ```
   - **Result**: Automatic deployment to `dev.salesforceconsultants.io`

2. **Testing & Review**
   - Test on development environment
   - Get client feedback if needed
   - Fix any issues

3. **Promote to Staging**
   ```bash
   git checkout staging
   git merge dev
   git push origin staging
   ```
   - **Result**: Automatic deployment to `staging.salesforceconsultants.io`

4. **Final Testing**
   - Test on staging environment
   - Client approval
   - Performance testing

5. **Deploy to Production**
   ```bash
   git checkout main
   git merge staging
   git push origin main
   ```
   - **Result**: Automatic deployment to `salesforceconsultants.io`

### **Hotfix Process**

1. **Create Hotfix Branch**
   ```bash
   git checkout main
   git checkout -b hotfix/critical-fix
   # Make urgent fix
   git commit -m "Critical fix"
   ```

2. **Deploy Hotfix**
   ```bash
   git checkout main
   git merge hotfix/critical-fix
   git push origin main
   git branch -d hotfix/critical-fix
   ```

## 📊 Monitoring & Analytics

### **Cloudflare Analytics**

1. **Enable Analytics**
   - Go to **Analytics** tab in Pages project
   - Enable **Web Analytics** (free tier available)

2. **Key Metrics to Monitor**
   - Page views and unique visitors
   - Performance metrics (Core Web Vitals)
   - Error rates and uptime
   - Geographic distribution

### **Performance Optimization**

1. **Caching Strategy**
   - Static assets: 1 year cache
   - HTML files: 1 hour cache
   - Images: 1 month cache

2. **Compression**
   - Enable Brotli compression
   - Enable Gzip fallback

3. **CDN Optimization**
   - Use Cloudflare's global CDN
   - Enable Auto Minify for CSS/JS/HTML

## 🔒 Security Configuration

### **Security Headers**

1. **Content Security Policy**
   - Configure CSP headers
   - Allow necessary external resources

2. **HTTPS Enforcement**
   - Force HTTPS redirects
   - Enable HSTS headers

3. **Rate Limiting**
   - Configure rate limiting rules
   - Protect against DDoS attacks

### **Access Control**

1. **Environment Protection**
   - Password protect staging/development environments
   - IP whitelist for admin access

2. **Form Protection**
   - Enable Cloudflare Bot Management
   - Configure form spam protection

## 🚨 Troubleshooting

### **Common Issues**

1. **Build Failures**
   - Check build logs in Cloudflare dashboard
   - Verify file paths and references
   - Ensure all dependencies are committed

2. **404 Errors**
   - Check custom domain DNS settings
   - Verify Cloudflare proxy status
   - Check for redirect rules

3. **Performance Issues**
   - Optimize images and assets
   - Enable Cloudflare caching
   - Check for large file sizes

### **Support Resources**

- **Cloudflare Documentation**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Community Forum**: [community.cloudflare.com](https://community.cloudflare.com)
- **Status Page**: [cloudflarestatus.com](https://cloudflarestatus.com)

## 📞 Contact Information

For deployment support:
- **Email**: info@salesforceconsultants.io
- **Phone**: 385-309-0807

---

**Last Updated**: July 2024
**Version**: 1.0 