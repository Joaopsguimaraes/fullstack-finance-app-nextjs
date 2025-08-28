# Development Setup Guide

This document outlines the development setup and standards for this Next.js 15 application with
React 19.

## Code Quality Tools

### ESLint Configuration

The project uses ESLint with a modern flat configuration (`eslint.config.mjs`) that includes:

- **Next.js Core Web Vitals**: Performance and accessibility rules
- **TypeScript Support**: Type-aware linting rules
- **React 19 Support**: Latest React patterns and hooks
- **Custom Rules**: Tailored for modern development practices

Key features:

- Consistent type imports with `@typescript-eslint/consistent-type-imports`
- Unused variables warnings with underscore ignore pattern
- Import sorting with `sort-imports`
- React hooks rules for proper usage
- Next.js specific optimizations

### Prettier Configuration

The project uses Prettier with the following setup:

- **Configuration**: `prettier.config.mjs`
- **Plugins**: Tailwind CSS class sorting, XML support
- **Standards**: 80 character line width, single quotes, no semicolons
- **File Overrides**: Specific settings for JSON, Markdown, YAML, CSS

Key features:

- Tailwind CSS class sorting (must be last plugin)
- File-specific formatting rules
- Consistent code style across the project

### Integration

ESLint and Prettier are integrated to work together without conflicts:

- `eslint-config-prettier` disables conflicting ESLint rules
- Prettier handles code formatting
- ESLint focuses on code quality and best practices

## Available Scripts

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
npm run type-check   # Run TypeScript compiler check
npm run check        # Run all checks (type, lint, format)
npm run fix          # Fix all issues (lint + format)
```

## VS Code Setup

The project includes VS Code configuration for optimal development experience:

### Settings (`.vscode/settings.json`)

- Auto-format on save with Prettier
- ESLint auto-fix on save
- TypeScript auto-imports
- Tailwind CSS IntelliSense
- File nesting for better organization

### Extensions (`.vscode/extensions.json`)

Recommended extensions:

- Prettier - Code formatter
- ESLint - Linting
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- GitLens
- Prisma support

### Debugging (`.vscode/launch.json`)

Pre-configured debug configurations:

- Server-side debugging
- Client-side debugging
- Full-stack debugging

## File Structure Standards

### Import Order

1. Node.js built-ins
2. External packages
3. Internal modules (absolute imports)
4. Relative imports

### TypeScript

- Use `type` imports for type-only imports
- Prefer interfaces over types
- Use consistent naming conventions

### React

- Functional components with TypeScript
- Proper hook usage following rules of hooks
- Server Components by default (Next.js App Router)

## Git Hooks (Optional)

For automated code quality checks, consider setting up:

```bash
# Install husky and lint-staged
npm install --save-dev husky lint-staged

# Add to package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

## Troubleshooting

### ESLint Issues

- Restart VS Code ESLint server: `Cmd+Shift+P` → "ESLint: Restart ESLint Server"
- Check ESLint output panel for detailed errors

### Prettier Issues

- Ensure `prettier.requireConfig` is enabled in VS Code
- Check if `.prettierrc` or `prettier.config.mjs` exists
- Verify Prettier extension is set as default formatter

### TypeScript Issues

- Run `npm run type-check` to see all TypeScript errors
- Ensure TypeScript extension is up to date
- Check `tsconfig.json` configuration

## Performance Considerations

- Use Turbopack for faster development builds
- Leverage Next.js 15 App Router for optimal performance
- Follow React 19 best practices for concurrent features
- Use proper caching strategies with Next.js

## Best Practices

1. **Always run `npm run check` before committing**
2. **Use TypeScript strict mode**
3. **Follow the import order conventions**
4. **Write meaningful commit messages**
5. **Test your changes thoroughly**
6. **Use Server Components when possible**
7. **Optimize images with Next.js Image component**
8. **Follow accessibility guidelines**

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install recommended VS Code extensions

3. Start development server:

   ```bash
   npm run dev
   ```

4. Run code quality checks:
   ```bash
   npm run check
   ```

Your development environment is now ready! 🚀
