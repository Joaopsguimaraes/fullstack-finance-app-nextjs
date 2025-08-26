# Theme Setup and Improvements

This document outlines the theme system improvements implemented in the Finance App.

## Overview

The application now features a comprehensive theme system with:
- **Light theme as default** (clean, professional appearance)
- **Dark theme support** (reduced eye strain, modern design)
- **System theme detection** (follows user's OS preference)
- **Smooth theme transitions** (no flash of unstyled content)
- **Theme persistence** (remembers user's choice)

## Components Added

### 1. Theme Provider (`src/components/ui/theme-provider.tsx`)
- Wraps the application with theme context
- Handles theme switching and persistence
- Prevents hydration mismatches

### 2. Theme Toggle (`src/components/ui/theme-toggle.tsx`)
- Dropdown menu for theme selection
- Animated sun/moon icons
- Three options: Light, Dark, System

### 3. Dropdown Menu (`src/components/ui/dropdown-menu.tsx`)
- Radix UI-based dropdown component
- Accessible and keyboard navigable
- Smooth animations

### 4. Badge Component (`src/components/ui/badge.tsx`)
- Status indicators and labels
- Multiple variants: default, secondary, destructive, outline
- Theme-aware styling

## Configuration

### Root Layout (`src/app/layout.tsx`)
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem
  disableTransitionOnChange
>
  {/* App content */}
</ThemeProvider>
```

### CSS Variables (`src/app/globals.css`)
- Light theme variables in `:root`
- Dark theme variables in `.dark`
- Chart colors for data visualization
- Consistent color palette across components

## Usage

### Adding Theme Toggle to Components
```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function MyComponent() {
  return (
    <div className="flex items-center space-x-4">
      <h1>My App</h1>
      <ThemeToggle />
    </div>
  )
}
```

### Theme-Aware Styling
```tsx
// Use semantic color classes
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    <Button className="bg-primary text-primary-foreground">
      Click me
    </Button>
  </Card>
</div>
```

## Theme Demo

Visit `/theme-demo` to see all components in both light and dark themes.

## Color Palette

### Light Theme (Default)
- **Background**: Pure white (`#ffffff`)
- **Foreground**: Dark gray (`#0f172a`)
- **Primary**: Dark blue (`#0f172a`)
- **Secondary**: Light gray (`#f1f5f9`)
- **Muted**: Very light gray (`#f8fafc`)
- **Border**: Subtle gray (`#e2e8f0`)

### Dark Theme
- **Background**: Dark gray (`#0f172a`)
- **Foreground**: Light gray (`#f8fafc`)
- **Primary**: Bright blue (`#3b82f6`)
- **Secondary**: Darker gray (`#1e293b`)
- **Muted**: Medium gray (`#334155`)
- **Border**: Dark gray (`#475569`)

## Best Practices

1. **Always use semantic color classes** instead of hardcoded colors
2. **Test components in both themes** to ensure proper contrast
3. **Use the theme toggle** during development to verify styling
4. **Follow the design system** for consistent appearance

## Accessibility

- High contrast ratios in both themes
- Proper focus indicators
- Keyboard navigation support
- Screen reader friendly

## Performance

- CSS variables for instant theme switching
- No JavaScript required for theme application
- Optimized bundle size with tree-shaking
- Smooth transitions without layout shifts
