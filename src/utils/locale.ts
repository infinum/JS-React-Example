import i18nextConfig from '../../next-i18next.config';

export const getSafeLocale = (locale?: string) => locale || i18nextConfig?.i18n?.defaultLocale || 'en';
