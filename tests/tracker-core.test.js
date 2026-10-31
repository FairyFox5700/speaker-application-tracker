const test = require('node:test');
const assert = require('node:assert/strict');

const core = require('../tracker-core.js');

const NOW = '2026-10-31T12:00:00Z';

test('ships exactly the three supplied CFP opportunities', () => {
  assert.equal(core.SEED_OPPORTUNITIES.length, 3);
  assert.deepEqual(
    core.SEED_OPPORTUNITIES.map(({name, eventDate, deadlineDate, location, sourceScore}) => ({name, eventDate, deadlineDate, location, sourceScore})),
    [
      {name: 'NextGen Intelligence Conference: Data, Cloud & AI', eventDate: '2026-11-16', deadlineDate: '2026-10-09', location: 'London, U.K., Online', sourceScore: 0.29},
      {name: 'AI for Developers', eventDate: '2026-12-17', deadlineDate: '2026-06-01', location: 'Online', sourceScore: 0.29},
      {name: 'AI Coding Summit', eventDate: '2026-02-26', deadlineDate: '2026-01-26', location: 'Online', sourceScore: 0.29},
    ]
  );
});

test('classifies all supplied CFP deadlines as passed on 2026-10-31', () => {
  const states = core.SEED_OPPORTUNITIES.map(item => core.deadlineState(item.deadlineDate, NOW));
  assert.deepEqual(states.map(state => state.key), ['passed', 'passed', 'passed']);
  assert.deepEqual(states.map(state => state.days), [-22, -152, -278]);
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
  const result = core.filterOpportunities(changed, {search: 'cloud', status: 'Drafting', deadline: 'passed'}, NOW);
  assert.deepEqual(result.map(item => item.id), ['nextgen-intelligence-2026']);
});

test('CSV export round-trips commas, quotes, multiline text, and unicode', () => {
  const item = {...core.SEED_OPPORTUNITIES[0], notes: 'Agentic Systems, "Real World"\nRésumé'};
  const csv = core.toCsv([item]);
  assert.match(csv, /"Agentic Systems, ""Real World""\r?\nRésumé"/);
  assert.equal(csv.trimEnd().split(/\r?\n/).length, 3);
});

test('empty persisted opportunities are not reseeded', () => {
  const storage = {getItem: () => JSON.stringify({version: 1, opportunities: [], talks: []})};
  const state = core.loadState(storage);
  assert.deepEqual(state.opportunities, []);
  assert.deepEqual(state.talks, []);
});
