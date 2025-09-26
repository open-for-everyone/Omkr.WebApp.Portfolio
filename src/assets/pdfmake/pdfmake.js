// Slim pdfmake wrapper (will be replaced by build script if run). Fallback to full library.
/* global window */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfMake = require('../../../node_modules/pdfmake/build/pdfmake.js');
module.exports = pdfMake;
