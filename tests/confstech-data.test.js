const test = require('node:test');
const assert = require('node:assert/strict');

const data = require('../confstech-opportunities.js');

test('generated Confs.tech catalog reconciles its declared count', () => {
  assert.equal(data.items.length, data.retainedCount);
  assert.equal(data.checkedFiles > 0, true);
});

test('every generated Confs.tech opportunity is unique, open, and tagged', () => {
  const urls = data.items.map(item => item.sourceUrl.toLowerCase().replace(/\/$/, ''));
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(data.items.every(item => item.deadlineDate >= data.cutoff), true);
  assert.equal(data.items.every(item => item.sourceType === 'Confs.tech CFP'), true);
  assert.equal(data.items.every(item => item.matchScore >= data.minimumMatchScore), true);
  assert.equal(data.items.every(item => Array.isArray(item.topics) && item.topics.length > 0), true);
});

test('Confs.tech entries never fabricate travel sponsorship', () => {
  assert.equal(data.items.every(item => item.travelSupport === 'Not stated' || item.travelSupport === 'Online / no trip'), true);
});
