const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const icons = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../AppSymbols.js'), 'utf8'), icons);
const candidates = (...args) => Array.from(icons.appCandidates(...args));
const vscode = '\ue8da';

// A new window can have an empty IPC snapshot while Wayland already knows its app.
assert.equal(icons.nerdGlyph(candidates({}, 'code')[0], '', []), vscode);
assert.equal(icons.nerdGlyph(candidates({class: 'code'}, '')[0], '', []), vscode);
assert.equal(icons.nerdGlyph(candidates({initialClass: 'Code'}, null)[0], '', []), vscode);
assert.deepEqual(candidates({class: 'old-app', initialClass: 'launcher'}, 'code'), ['code', 'old-app', 'launcher']);
assert.deepEqual(candidates({class: 'code', initialClass: 'code'}, 'code'), ['code']);
assert.deepEqual(candidates(null, null), []);
assert.equal(icons.nerdGlyph(candidates({}, 'google-chrome')[0], '', []), '\uf268');
assert.equal(icons.nerdGlyph(candidates({}, 'foot')[0], '', []), '\uf489');
console.log('8 new-window icon identity checks passed.');
