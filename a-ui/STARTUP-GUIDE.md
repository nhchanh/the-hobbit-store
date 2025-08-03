# 🚀 Starting The Hobbit Online Store UI

This guide provides step-by-step instructions for starting the web UI application in the `a-ui` sub-module.

## ✅ Prerequisites

Before starting, ensure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

## 🏃‍♂️ Quick Start

### 1. Navigate to the UI Module
```bash
cd a-ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
- **URL**: http://localhost:3000
- **Status**: The development server will show compilation status
- **Hot Reload**: Changes will automatically refresh the browser

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server (requires build) |
| `npm run lint` | Run ESLint code analysis |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |

## 🔧 Development Environment

### Port Information
- **Default Port**: 3000
- **Automatic Port Selection**: If 3000 is busy, Next.js will use 3001, 3002, etc.
- **Check Terminal**: The actual port will be displayed in the terminal output

### Development Tools
- **React Query Devtools**: Available in development mode
- **Redux DevTools**: Compatible with browser extension
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Tailwind CSS**: Utility-first styling framework

## 🐛 Troubleshooting

### Common Issues

#### 404 Error in Browser
**Symptoms**: Browser shows "404 - This page could not be found"

**Solutions**:
1. ✅ Verify the correct URL: http://localhost:3000
2. ✅ Check terminal for the actual port (might be 3001, 3002, etc.)
3. ✅ Ensure development server is running (`npm run dev`)
4. ✅ Clear browser cache or try incognito mode
5. ✅ Restart the development server (Ctrl+C, then `npm run dev`)

#### Port Already in Use
**Symptoms**: Error message about port 3000 being in use

**Solutions**:
1. ✅ Next.js will automatically try the next available port (3001, 3002, etc.)
2. ✅ Check the terminal output for the actual port being used
3. ✅ Or manually stop other processes using port 3000

#### Compilation Errors
**Symptoms**: Red error messages in terminal or browser

**Solutions**:
1. ✅ Check for TypeScript errors in the terminal
2. ✅ Ensure all imports are correct
3. ✅ Verify file extensions are correct (.tsx for React components)
4. ✅ Restart the server if needed

#### Module Not Found Errors
**Symptoms**: "Module not found" errors

**Solutions**:
1. ✅ Run `npm install` to ensure dependencies are installed
2. ✅ Check import paths for typos
3. ✅ Verify the file exists at the specified path
4. ✅ Clear npm cache: `npm cache clean --force`

## 🏗️ Project Structure

```
a-ui/
├── src/
│   ├── pages/           # Next.js pages (using pages router)
│   ├── components/      # React components (atomic design)
│   ├── domain/          # Domain models and business logic
│   ├── application/     # Application services and DTOs
│   ├── infrastructure/  # API clients and external services
│   ├── store/           # Redux store configuration
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript type definitions
├── pages/               # Next.js pages directory
├── public/              # Static assets
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🎯 Next Steps

Once the application is running successfully:

1. **Explore the Homepage**: Visit http://localhost:3000
2. **Check the Terminal**: Look for compilation status and any warnings
3. **Open Browser DevTools**: Inspect React Query and Redux state
4. **Make Changes**: Edit files and see hot reload in action
5. **Run Tests**: Execute `npm test` to verify everything works

## 📚 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Query**: https://tanstack.com/query/latest
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Happy Coding! 🧙‍♂️✨**
