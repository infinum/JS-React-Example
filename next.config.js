const withPlugins = require('next-compose-plugins');

const { i18n } = require('./next-i18next.config');

/**
 * @type {import('next').NextConfig}
 */
const config = { i18n };

module.exports = withPlugins([config]);
