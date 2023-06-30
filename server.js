// This is a cjs file
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next');

process.argv.length = 1;
process.argv.push(nextPath, 'start');

require(nextPath);
