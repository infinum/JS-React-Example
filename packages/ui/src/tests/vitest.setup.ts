import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// RTL only registers its automatic cleanup when `afterEach` is a global, and we don't use globals
afterEach(() => cleanup());
