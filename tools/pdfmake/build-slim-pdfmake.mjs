#!/usr/bin/env node
// Simple slim pdfmake builder: copies core build and strips unused font definitions.
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const __dirname = __dirname; // already available in CommonJS

// Source pdfmake files from node_modules
const pdfmakePath = resolve(__dirname, '../../node_modules/pdfmake/build/pdfmake.js');
const vfsPath = resolve(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js');

let pdfmakeJs = readFileSync(pdfmakePath, 'utf8');
let vfsJs = readFileSync(vfsPath, 'utf8');

// We will keep only Roboto-Regular.ttf and Roboto-Medium.ttf
vfsJs = vfsJs.replace(/var pdfMake = pdfMake \|\| {};\s+pdfMake\._vfs = (\{[\s\S]*?\});/, (m, obj) => {
  // naive shrink: remove other font entries by regex
  const kept = obj.replace(/"Roboto-(?!Regular|Medium)[^"]+\.ttf":\s*"[^"]+",?\n?/g, '');
  return `var pdfMake = pdfMake || {};\npdfMake._vfs = ${kept};`;
});

// Write slim outputs into src/assets/pdfmake
const outDir = resolve(__dirname, '../../src/assets/pdfmake');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'pdfmake.js'), pdfmakeJs, 'utf8');
writeFileSync(resolve(outDir, 'vfs_fonts.js'), vfsJs, 'utf8');
console.log('Slim pdfmake build generated in src/assets/pdfmake');
