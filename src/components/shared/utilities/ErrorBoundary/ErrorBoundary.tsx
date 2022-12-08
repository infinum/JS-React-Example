import { getErrorBoundary } from '@/lib/bugsnag';

// This is under the assumption that the Bugsnag client has already been initialized (e.g. call start() in the _app.tsx file)
export const ErrorBoundary = getErrorBoundary();
