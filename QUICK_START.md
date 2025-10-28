# Quick Start Guide - Mobile App Assignment 2

## 🚀 Starting the Web Application

### Option 1: Using VSCode Go Live Extension (Recommended)

1. **Install the Live Server extension** in VSCode if you haven't already:
   - Open VSCode Extensions (Ctrl+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

2. **Build the project** first:
   ```bash
   npm run build
   ```

3. **Start with Go Live**:
   - Open the `dist/index.html` file in VSCode
   - Right-click on the file
   - Select "Open with Live Server"
   - Or click the "Go Live" button in the status bar

The application will open at: **http://localhost:3000**

### Option 2: Using Express Server

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start the Express server**:
   ```bash
   npm run server:express
   ```

The application will open at: **http://localhost:3000**

### Option 3: Using NPM Scripts

1. **Start with live-server**:
   ```bash
   npm start
   ```

2. **Start with Express**:
   ```bash
   npm run dev:express
   ```

3. **Development mode with watch**:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
Mobile-App-Assignment-2/
├── Public/           # Source HTML, CSS files
├── Private/          # Private backend code
├── src/
│   ├── api/         # API modules (auth, bookmark, list, etc.)
│   ├── env.ts       # Environment configuration
│   ├── error.ts     # Error handling
│   ├── hash.ts      # Password hashing
│   ├── db.ts        # Database configuration
│   └── ...          # Other utility files
├── dist/            # Built files (where Go Live serves from)
├── server.js        # Express server
└── build.cjs        # Build script
```

## 🌐 Access Points

- **Main Index Page**: http://localhost:3000/index.html
- **Login Page**: http://localhost:3000/login.html
- **Dashboard**: http://localhost:3000/dashboard.html
- **Courses**: http://localhost:3000/courses.html
- **Favorites**: http://localhost:3000/favorites.html
- **Admin**: http://localhost:3000/admin.html
- **Profile**: http://localhost:3000/profile.html
- **Health Check**: http://localhost:3000/api/health

## ⚙️ Configuration

### VSCode Settings

The `.vscode/settings.json` file is configured with:
```json
{
  "liveServer.settings.root": "/dist",
  "liveServer.settings.port": 3000,
  "liveServer.settings.file": "index.html"
}
```

### Server Configuration

The `server.js` file serves:
- Static files from the `dist` folder
- API routes at `/api/*`
- SPA fallback to `index.html`

## 🔧 Development Commands

```bash
# Build the project
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Clean build directory
npm run clean

# Start Express server
npm run server:express

# Start with live-server
npm start

# Development mode
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 📝 Important Notes

1. **Always build before running**: The Go Live extension serves from the `dist` folder, so you need to build first with `npm run build`

2. **Development workflow**:
   - Edit files in `Public/` for HTML/CSS
   - Edit files in `src/` for TypeScript
   - Run `npm run build` to compile
   - Use Go Live to see changes

3. **API Integration**:
   - API files are in `src/api/`
   - They're bundled into `dist/src/api.js`
   - The server proxies API requests to external services

## 🐛 Troubleshooting

### Issue: "Cannot GET /"
- **Solution**: Make sure you built the project first with `npm run build`

### Issue: CSS not loading
- **Solution**: Check that all CSS files are in the `Public/` folder and run `npm run build` again

### Issue: Go Live not working
- **Solution**: 
  1. Install the Live Server extension
  2. Right-click on `dist/index.html`
  3. Select "Open with Live Server"

### Issue: Server port already in use
- **Solution**: Change the port in `server.js` or `.vscode/settings.json`

## ✅ Verification Checklist

- [ ] Project built successfully (`npm run build`)
- [ ] All files copied to `dist/` folder
- [ ] Go Live extension installed in VSCode
- [ ] Can access http://localhost:3000
- [ ] Can see the registration form on index.html
- [ ] CSS styles are loading correctly
- [ ] No console errors in browser

## 🎉 You're Ready to Go!

Once you can see the registration form at http://localhost:3000/index.html, you're all set to start development!

