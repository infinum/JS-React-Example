export const isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
export const isServer = !isBrowser;
