const test = require('node:test');
const assert = require('node:assert/strict');

const core = require('../tracker-core.js');

const NOW = '2026-10-31T12:00:00Z';

test('ships only verified CFP opportunities whose deadlines have not passed', () => {
  assert.equal(core.SEED_OPPORTUNITIES.length, 10);
  assert.deepEqual(
    core.SEED_OPPORTUNITIES.map(({name, eventDate, deadlineDate}) => ({name, eventDate, deadlineDate})),
    [
      {name: 'Data Saturday Denmark 2027', eventDate: '2027-01-30', deadlineDate: '2026-11-14'},
      {name: 'TDX 2027', eventDate: '2027-03-10', deadlineDate: '2026-11-16'},
      {name: 'FABCON & SQLCON 2027', eventDate: '2027-03-08', deadlineDate: '2026-11-22'},
      {name: 'AzureDay Poland 2027', eventDate: '2027-03-11', deadlineDate: '2026-11-30'},
      {name: 'AI Context New York', eventDate: '2027-03-16', deadlineDate: '2027-01-04'},
      {name: 'Optimized AI Conference 2027', eventDate: '2027-03-31', deadlineDate: '2027-02-28'},
      {name: 'Cloud & Code Oost', eventDate: '2027-02-01', deadlineDate: '2027-09-22'},
      {name: 'DataTune 2027', eventDate: '2027-03-12', deadlineDate: '2026-11-15'},
      {name: 'dreamOlé 2027', eventDate: '2027-03-12', deadlineDate: '2026-12-15'},
      {name: 'STARWEST 2027', eventDate: '2027-09-19', deadlineDate: '2027-01-31'},
    ]
  );
});

test('classifies every tracked CFP as open on 2026-10-31', () => {
  const states = core.SEED_OPPORTUNITIES.map(item => core.deadlineState(item.deadlineDate, NOW));
  assert.equal(states.every(state => state.days >= 0), true);
  assert.equal(states.some(state => state.key === 'passed'), false);
});

test('classifies date-only deadlines without time-of-day drift', () => {
  assert.equal(core.deadlineState('2026-10-30', NOW).key, 'passed');
  assert.equal(core.deadlineState('2026-10-31', NOW).key, 'today');
  assert.equal(core.deadlineState('2026-11-01', NOW).key, 'critical');
  assert.equal(core.deadlineState('2026-11-20', NOW).key, 'soon');
  assert.equal(core.deadlineState('2027-02-01', NOW).key, 'later');
});

test('matches talks deterministically and explains the score', () => {
  const result = core.matchTalk(core.SEED_OPPORTUNITIES[0], core.SEED_TALKS[0]);
  assert.equal(result.score, 85);
  assert.deepEqual(result.reasons, ['Agentic AI topic match', 'Azure/cloud relevance', 'Developer audience', 'Demo ready']);
});

test('search and filters combine with logical AND', () => {
  const changed = core.SEED_OPPORTUNITIES.map((item, index) => ({...item, status: index === 0 ? 'Drafting' : 'Not started'}));
  const result = core.filterOpportunities(changed, {search: 'cloud', status: 'Drafting', deadline: 'soon'}, NOW);
  assert.deepEqual(result.map(item => item.id), ['data-saturday-denmark-2027']);
});

test('CSV export round-trips commas, quotes, multiline text, and unicode', () => {
  const item = {...core.SEED_OPPORTUNITIES[0], notes: 'Agentic Systems, "Real World"\nRésumé'};
  const csv = core.toCsv([item]);
  assert.match(csv, /"Agentic Systems, ""Real World""\r?\nRésumé"/);
  assert.equal(csv.trimEnd().split(/\r?\n/).length, 3);
});

test('empty persisted opportunities are not reseeded', () => {
  const storage = {getItem: () => JSON.stringify({version: 3, opportunities: [], talks: []})};
  const state = core.loadState(storage);
  assert.deepEqual(state.opportunities, []);
  assert.deepEqual(state.talks, []);
});

test('active-only view removes opportunities once their deadline passes', () => {
  const items = [...core.SEED_OPPORTUNITIES, {id: 'closed', deadlineDate: '2026-10-30'}];
  const active = core.activeOpportunities(items, NOW);
  assert.equal(active.length, 10);
  assert.equal(active.some(item => item.id === 'closed'), false);
});

test('includes verified LinkedIn speaker leads with future deadlines', () => {
  const linkedIn = core.SEED_OPPORTUNITIES.filter(item => item.sourceType === 'LinkedIn lead');
  assert.equal(linkedIn.length, 3);
  assert.equal(linkedIn.every(item => item.sourceUrl.includes('linkedin.com')), true);
  assert.equal(linkedIn.every(item => core.deadlineState(item.deadlineDate, NOW).days >= 0), true);
});

test('filters LinkedIn speaker leads separately from official CFPs', () => {
  const linkedIn = core.filterOpportunities(core.SEED_OPPORTUNITIES, {source: 'LinkedIn lead'}, NOW);
  assert.equal(linkedIn.length, 3);
  assert.equal(linkedIn.every(item => item.sourceType === 'LinkedIn lead'), true);
});
