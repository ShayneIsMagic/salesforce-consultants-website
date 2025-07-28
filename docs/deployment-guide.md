# Deployment Guide

This guide covers deploying the Salesforce Consultants website to various platforms.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git repository set up
- Domain name (salesforceconsultants.io)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Building for Production

1. Create production build:
```bash
npm run build
```

2. Preview production build:
```bash
npm run preview
```

## Deployment Options

### Netlify (Recommended)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 (or latest LTS)

3. **Environment Variables** (if needed)
   - Go to Site settings > Environment variables
   - Add any required environment variables

4. **Custom Domain**
   - Go to Domain settings
   - Add custom domain: `salesforceconsultants.io`
   - Configure DNS settings

### Vercel

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Follow prompts** to configure deployment

### GitHub Pages

1. **Add GitHub Pages dependency**:
```bash
npm install --save-dev gh-pages
```

2. **Add scripts to package.json**:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Deploy**:
```bash
npm run deploy
```

### AWS S3 + CloudFront

1. **Build the project**:
```bash
npm run build
```

2. **Upload to S3**:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

3. **Configure CloudFront** for CDN and HTTPS

## Environment Configuration

### Development
Create `.env.development`:
```env
VITE_API_URL=http://localhost:3000
VITE_GA_TRACKING_ID=
```

### Production
Create `.env.production`:
```env
VITE_API_URL=https://api.salesforceconsultants.io
VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID
```

## SEO Optimization

1. **Meta Tags**: Already configured in `index.html`
2. **Sitemap**: Generate sitemap.xml
3. **Robots.txt**: Create robots.txt in public folder
4. **Google Analytics**: Add tracking ID to environment variables

## Performance Optimization

1. **Image Optimization**: Use WebP format and proper sizing
2. **Code Splitting**: Already configured in Vite
3. **Caching**: Configure proper cache headers
4. **CDN**: Use CloudFront or similar CDN

## Security

1. **HTTPS**: Ensure SSL certificate is configured
2. **Security Headers**: Add security headers in hosting configuration
3. **Content Security Policy**: Configure CSP headers

## Monitoring

1. **Error Tracking**: Set up Sentry or similar
2. **Performance Monitoring**: Use Google PageSpeed Insights
3. **Uptime Monitoring**: Configure uptime monitoring

## Backup Strategy

1. **Code**: Use Git for version control
2. **Database**: Regular backups if using database
3. **Files**: Backup uploaded files regularly

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Clear node_modules and reinstall
   - Check for syntax errors

2. **Deployment Issues**
   - Verify build command and output directory
   - Check environment variables
   - Review deployment logs

3. **Performance Issues**
   - Optimize images
   - Enable compression
   - Use CDN

### Support

For deployment issues:
1. Check hosting provider documentation
2. Review build logs
3. Contact hosting provider support

## Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Security Patches**: Apply security updates promptly
3. **Performance Monitoring**: Regular performance audits
4. **Backup Verification**: Test backup restoration

---

**Note**: This guide assumes you have the necessary permissions and access to configure the hosting platform of your choice. 