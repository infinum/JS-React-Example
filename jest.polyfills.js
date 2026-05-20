/* eslint-disable @typescript-eslint/no-var-requires */
const { TextDecoder, TextEncoder } = require('util');
const { TransformStream } = require('node:stream/web');

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.TransformStream = TransformStream;
