import Bugsnag from '@bugsnag/js';
import React from 'react';

// This is under the assumption that the Bugsnag client has already been initialized (e.g. call start() in the _app.tsx file)
export const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);
