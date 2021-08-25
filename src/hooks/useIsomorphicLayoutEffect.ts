import { useEffect, useLayoutEffect } from 'react';

import { isBrowser } from '@/utils/env';

export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
