# ⚡ Quick Deployment Reference

## 🚀 Cloudflare Pages Setup (One-Time)

### **1. Connect Repository**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Compute** → **Workers & Pages** → **Create application**
3. **Pages** → **Connect to Git**
4. Select: `salesforce-consultants-website`
5. **Production branch**: `main`

### **2. Configure Environments**
- **Production**: `main` branch → `salesforceconsultants.io`
- **Staging**: `staging` branch → `staging.salesforceconsultants.io`
- **Development**: `dev` branch → `dev.salesforceconsultants.io`

### **3. Build Settings**
```
Framework preset: None (Static HTML)
Build command: echo "Static site - no build required"
Build output directory: / (root)
```

## 🔄 Daily Workflow

### **Development**
```bash
git checkout dev
# Make changes
git add .
git commit -m "Feature description"
git push origin dev
# → Auto-deploys to dev.salesforceconsultants.io
```

### **Staging Review**
```bash
git checkout staging
git merge dev
git push origin staging
# → Auto-deploys to staging.salesforceconsultants.io
```

### **Production Deploy**
```bash
git checkout main
git merge staging
git push origin main
# → Auto-deploys to salesforceconsultants.io
```

### **Hotfix (Emergency)**
```bash
git checkout main
git checkout -b hotfix/urgent-fix
# Make fix
git commit -m "Hotfix: description"
git checkout main
git merge hotfix/urgent-fix
git push origin main
git branch -d hotfix/urgent-fix
```

## 🌐 Custom Domain Setup

### **Primary Domain**
1. **Custom domains** tab → **Set up custom domain**
2. Enter: `salesforceconsultants.io`
3. **DNS**: Migrate to Cloudflare (recommended)
4. **SSL**: Full (strict)

### **Subdomains**
- `staging.salesforceconsultants.io` → Staging environment
- `dev.salesforceconsultants.io` → Development environment

## 📊 Monitoring

### **Check Deployments**
- **Cloudflare Dashboard** → **Pages** → **Your Project**
- **Deployments** tab shows build status
- **Analytics** tab shows performance metrics

### **Common Issues**
- **404 Errors**: Check DNS settings
- **Build Failures**: Check file paths in logs
- **Slow Loading**: Enable Cloudflare caching

## 🔧 Useful Commands

### **Branch Management**
```bash
# View all branches
git branch -a

# Switch branches
git checkout [branch-name]

# Create new feature branch
git checkout -b feature/new-feature

# Delete local branch
git branch -d [branch-name]
```

### **Deployment Status**
```bash
# Check current branch
git branch

# Check remote status
git status

# View recent commits
git log --oneline -5
```

## 📞 Support

- **Cloudflare Docs**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Email**: info@salesforceconsultants.io
- **Phone**: 385-309-0807

---

**Remember**: Always test on staging before production! 🧪 