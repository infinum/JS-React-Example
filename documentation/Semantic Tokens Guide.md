# Semantic Tokens Guide

## Overview

Semantic tokens define design intent rather than specific values, enabling consistent theming across light/dark modes and custom themes. This approach follows the [Infinum Design Tokens Handbook](https://infinum.com/handbook/design/design-process/product-design/design-tokens).

## Token Structure

### Location
- **UI Package**: `packages/ui/src/themes/`
- **Frontend App**: Imports themes from UI package

### Organization
```
packages/ui/src/themes/
├── base.css              # Shared tokens (radius, spacing)
├── default/
│   ├── colors.css        # Light theme semantic colors
│   └── index.css         # Theme export
├── dark/
│   ├── colors.css        # Dark theme semantic colors
│   └── index.css         # Theme export
└── rainbow/
    ├── colors.css        # Custom theme colors
    └── index.css         # Theme export
```

## Semantic Token Categories

### Color Tokens
```css
/* Semantic meaning, not specific colors */
--color-background       /* Main background */
--color-foreground       /* Main text */
--color-primary          /* Brand/action color */
--color-secondary        /* Secondary actions */
--color-muted            /* Subtle backgrounds */
--color-destructive      /* Error/danger states */
--color-border           /* Component borders */
```

### Layout Tokens
```css
/* Base shared tokens */
--radius                 /* Default border radius */
--radius-lg              /* Large radius */
--radius-md              /* Medium radius */
--radius-sm              /* Small radius */
```

## Creating New Themes

### 1. Create Theme Directory
```bash
mkdir packages/ui/src/themes/brand
cd packages/ui/src/themes/brand
```

### 2. Define Color Mapping
```css
/* packages/ui/src/themes/brand/colors.css */
@theme {
  --color-background: var(--color-blue-50);
  --color-foreground: var(--color-blue-950);
  --color-primary: var(--color-blue-600);
  --color-primary-foreground: var(--color-white);
  --color-secondary: var(--color-blue-100);
  --color-secondary-foreground: var(--color-blue-900);
  /* Map all semantic tokens to brand colors */
}
```

### 3. Export Theme
```css
/* packages/ui/src/themes/brand/index.css */
@import './colors.css';
```

## Using Tokens in Components

### In UI Components
```typescript
// packages/ui/src/components/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
    },
  }
);
```

### In Frontend App
```typescript
// apps/frontend/src/app/layout.tsx
import '@infinum/ui/themes/base.css';
import '@infinum/ui/themes/default';
import '@infinum/ui/themes/dark';
```

## Theme Switching

### With next-themes
```typescript
// Frontend theme provider handles switching between:
// - "light" → uses default theme tokens
// - "dark" → uses dark variant tokens
// - "brand" → uses custom brand tokens

// Component automatically adapts:
<Button variant="primary">
  {/* Uses --color-primary from active theme */}
</Button>
```

## Best Practices

### Token Naming
- **Use semantic names**: `--color-destructive` not `--color-red-500`
- **Be consistent**: All themes must define the same semantic tokens
- **Group logically**: Related tokens like `primary` and `primary-foreground`

### Theme Development
```css
/* ✅ Good: Semantic meaning */
--color-success: var(--color-green-600);
--color-warning: var(--color-yellow-500);

/* ❌ Bad: Specific color names */
--color-green: var(--color-green-600);
--color-yellow: var(--color-yellow-500);
```

### Component Usage
```typescript
// ✅ Good: Use semantic classes
className="bg-background text-foreground border-border"

// ❌ Bad: Use specific color classes
className="bg-white text-black border-gray-200"
```

## Examples

### Light vs Dark Mapping
```css
/* Light theme */
@theme {
  --color-background: var(--color-white);
  --color-foreground: var(--color-slate-900);
}

/* Dark theme */
@variant dark {
  --color-background: var(--color-zinc-950);
  --color-foreground: var(--color-zinc-50);
}
```

### Custom Brand Theme
```css
/* Brand theme */
@theme {
  --color-primary: var(--color-indigo-600);
  --color-primary-foreground: var(--color-white);
  --color-secondary: var(--color-indigo-100);
  --color-accent: var(--color-amber-500);
}
```

