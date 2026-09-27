const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const model = vm.createContext({});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname, '../WorkspaceModel.js'), 'utf8'), model);
const ids = (...args) => Array.from(model.workspaceIds(...args));
assert.deepEqual(ids(5, [], 1), [1, 2, 3, 4, 5]);
assert.deepEqual(ids(3, [{id: 12}, {id: -99}, {id: 2}, {id: 8}], 12), [1, 2, 3, 8, 12]);
assert.deepEqual(ids(2, [], 7), [1, 2, 7]);
assert.equal(ids(100, [], 1).length, 20);
assert.equal(model.adjacentId([1, 2, 8], 2, -120), 8);
assert.equal(model.adjacentId([1, 2, 8], 8, -120), 8);
assert.equal(model.adjacentId([1, 2, 8], 1, 120), 1);
assert.equal(model.adjacentId([1, 2, 8], 8, 120), 2);
assert.equal(model.adjacentId([], 1, -120), 1);
const layout = (...args) => JSON.parse(JSON.stringify(model.slotLayout(...args)));
assert.deepEqual(layout([0, 2, 5], 3, true, 22, 18, 4), [
  {offset: 0, extent: 22, visible: 0, overflow: 0},
  {offset: 22, extent: 62, visible: 2, overflow: 0},
  {offset: 84, extent: 102, visible: 3, overflow: 2}
]);
assert.deepEqual(layout([5, 0], 3, false, 22, 18, 4), [
  {offset: 0, extent: 22, visible: 0, overflow: 0},
  {offset: 22, extent: 22, visible: 0, overflow: 0}
]);
// Closing a window must shrink its group and shift every following group.
assert.equal(layout([1, 2, 0], 3, true, 22, 18, 4)[2].offset, 106);
assert.equal(layout([1, 1, 0], 3, true, 22, 18, 4)[2].offset, 88);
console.log('13 workspace selection, navigation, and icon layout checks passed.');
