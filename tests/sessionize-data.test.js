const test = require('node:test');
const assert = require('node:assert/strict');

const data = require('../sessionize-opportunities.js');

test('generated Sessionize catalog reconciles its declared count', () => {
  assert.equal(data.items.length, data.retainedCount);
  assert.equal(data.candidatePages > data.retainedCount, true);
});

test('every generated Sessionize opportunity is unique, open, and strongly matched', () => {
  const urls = data.items.map(item => item.sourceUrl.toLowerCase().replace(/\/$/, ''));
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(data.items.every(item => item.deadlineDate >= data.cutoff), true);
  assert.equal(data.items.every(item => item.sourceType === 'Sessionize public CFP'), true);
  assert.equal(data.items.every(item => !item.location.includes('services.visualstudio')), true);
  assert.equal(data.items.every(item => item.matchScore >= data.minimumMatchScore), true);
});

test('travel-sponsored labels always include evidence details', () => {
  const sponsored = data.items.filter(item => item.travelSupport === 'Travel sponsored');
  assert.equal(sponsored.length > 0, true);
  assert.equal(sponsored.every(item => item.travelDetails.length > 20), true);
});
