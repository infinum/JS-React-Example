# UI Components Guide

## Overview

The `@infinum/ui` package provides a shared component library built on ShadCN/ui. Components are generated using ShadCN CLI, then become fully owned and customizable by the team.

## ShadCN Setup

The UI package is configured with:

- **Style**: New York (modern, clean aesthetic)
- **Framework**: React Server Components with TypeScript
- **Theming**: CSS variables for light/dark mode support
- **Icons**: Lucide React icon library
- **Package**: Components export as `@infinum/ui/component-name`

Configuration is in `packages/ui/components.json`.

## Adding New Components

### 1. Generate Component

```bash
# Navigate to UI package
cd packages/ui

# Add any ShadCN component
npx shadcn add button
npx shadcn add card
npx shadcn add dialog
npx shadcn add form

# Add multiple components at once
npx shadcn add button card dialog
```

### 2. Fix Code Quality

After generation, automatically fix lint and formatting issues:

```bash
# Fix ESLint issues and format code
pnpm lint:fix && pnpm prettier:fix
```

This step is **required** because ShadCN generates code that may not match your project's linting rules and formatting preferences.

### 3. Verify Integration

```bash
# Check that everything builds correctly
pnpm --filter @infinum/ui build

# Test in Storybook
pnpm --filter storybook dev
```

## Important: Component Ownership

**After generation, forget about ShadCN.** The generated components are now **yours** to:

- **Customize freely**: Modify styling, behavior, props, and structure
- **Add features**: Extend functionality beyond the original ShadCN design
- **Refactor**: Change internal implementation without external constraints
- **Version control**: Components evolve independently of ShadCN updates

**Never run `shadcn update`** - it will overwrite your customizations. Instead, manually apply desired changes from new ShadCN versions.

## Component Development Workflow

### 1. Generate Base Component

```bash
cd packages/ui
npx shadcn add select
pnpm lint:fix && pnpm prettier:fix
```

### 2. Customize for Your Needs

```typescript
// packages/ui/src/components/select.tsx
// Modify variants, add props, change styling
const selectVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border",
  {
    variants: {
      variant: {
        default: "border-input bg-background",
        ghost: "border-transparent bg-transparent", // Custom variant
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 text-sm", // Custom size
        lg: "h-12 px-4", // Custom size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 3. Create Storybook Stories

```typescript
// Create comprehensive documentation
// packages/ui/src/components/select.stories.tsx
export default {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
};
```

### 4. Write Tests

```typescript
// packages/ui/src/components/__tests__/select.test.tsx
import { render, screen } from '@testing-library/react';
import { Select } from '../select';

describe('Select', () => {
  it('renders with custom variant', () => {
    render(<Select variant="ghost" />);
    // Test your customizations
  });
});
```

## Best Practices

### Component Naming

- **ShadCN generates**: `button.tsx`, `card.tsx`, `dialog.tsx`
- **Export as**: `Button`, `Card`, `Dialog` (PascalCase)
- **Import as**: `import { Button } from '@infinum/ui/button'`

### Customization Guidelines

- **Always add CVA variants** for consistent theming
- **Extend props interfaces** for additional functionality
- **Maintain accessibility** from original ShadCN components
- **Document changes** in Storybook stories

### File Organization

# Also mention __stories__
```
packages/ui/src/components/
├── button.tsx           # Generated + customized
├── card.tsx            # Generated + customized
├── select.tsx          # Generated + customized
├── __stories__/
│   ├── button.stories.tsx
│   ├── card.stories.tsx
│   └── select.stories.tsx
└── __tests__/
    ├── button.test.tsx
    ├── card.test.tsx
    └── select.test.tsx
```