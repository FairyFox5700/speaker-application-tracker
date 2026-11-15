const test = require('node:test');
const assert = require('node:assert/strict');

const EXPECTED_IDS = [
  'data-saturday-denmark-2027',
  'datatune-2027-linkedin',
  'sessionize-aws-community-day-bangladesh-2026',
  'sessionize-ai-agents-day',
  'sessionize-london-containerdays-and-ai-context-2027',
  'sessionize-gppb-ng2027',
  'sessionize-net-conf-2026-ahmedabad-in-person',
  'sessionize-net-conf-2026-net-baires',
  'sessionize-devfest-budapest-2026-on-campus',
  'sessionize-dotnet-local-conf-2026-coimbatore',
  'azureday-poland-2027',
  'sessionize-colorcloud-hamburg-2027',
  'sessionize-alohai-2026',
  'sessionize-cncf-hosted-co-located-events-europe-2027',
  'sessionize-global-ai-dubai'
];
const TALK_IDS = new Set(['reliable-agentic-workflows', 'copilot-to-production', 'human-loop-multi-agent']);

const catalog = require('../conference-research.js');
const core = require('../tracker-core.js');
const researchUi = require('../research-ui.js');

test('publishes exactly the 15 priority conference research records', () => {
  assert.equal(catalog.schemaVersion, 1);
  assert.equal(catalog.reviewedCount, 15);
  assert.deepEqual(catalog.items.map(item => item.opportunityId), EXPECTED_IDS);
  assert.equal(new Set(catalog.items.map(item => item.opportunityId)).size, 15);
});

test('every research record has explicit provenance, patterns, limitations, and two reusable-talk ideas', () => {
  for (const item of catalog.items) {
    assert.match(item.reviewedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.conferenceName.length > 3);
    assert.ok(['exact-prior-edition', 'related-organizer-evidence', 'current-program-only'].includes(item.editionEvidence.kind));
    assert.ok(item.editionEvidence.label.length > 8);
    assert.match(item.editionEvidence.url, /^https:\/\//);
    assert.ok(item.recurringPatterns.length >= 2);
    assert.ok(item.representativeSessions.length >= 3);
    assert.ok(item.sources.length >= 1);
    assert.equal(item.recommendations.length, 2);
    assert.ok(item.limitations.length >= 1);
    for (const session of item.representativeSessions) {
      assert.ok(session.title.length > 3);
      assert.ok(session.theme.length > 5);
      assert.match(session.url, /^https:\/\//);
      assert.ok(['exact-prior-edition', 'related-organizer-evidence', 'current-program-evidence'].includes(session.evidenceKind));
    }
    for (const source of item.sources) {
      assert.ok(source.title.length > 3);
      assert.match(source.url, /^https:\/\//);
    }
    for (const idea of item.recommendations) {
      assert.ok(idea.title.length > 8);
      assert.ok(idea.rationale.length > 20);
      assert.ok(TALK_IDS.has(idea.baseTalkId));
    }
  }
});

test('AI Agents Day honestly labels current-program evidence and the date inconsistency', () => {
  const item = catalog.byOpportunityId['sessionize-ai-agents-day'];
  assert.equal(item.editionEvidence.kind, 'current-program-only');
  assert.match(item.editionEvidence.label, /No verified prior edition/i);
  assert.ok(item.representativeSessions.every(session => session.evidenceKind === 'current-program-evidence'));
  assert.match(item.limitations.join(' '), /4 December 2026.*12 December 2026/i);
});

test('published current and prior programs retain exact representative session titles', () => {
  const aiAgents = catalog.byOpportunityId['sessionize-ai-agents-day'];
  assert.deepEqual(aiAgents.representativeSessions.map(session => session.title), [
    'Cuando los agentes de IA olvidan: cómo implementar Knowledge-Driven Development',
    'From Prototype to Production: Deploying AI Agents with Docker',
    'Give Your Agents Somewhere to Work'
  ]);
  const devFest = catalog.byOpportunityId['sessionize-devfest-budapest-2026-on-campus'];
  assert.deepEqual(devFest.representativeSessions.map(session => session.title), [
    'Navigating Agentic Frameworks: Practical guidance for developers',
    'The 30-Minute Agent: A Hands-On Live Build',
    'Agents to Zero: Experiments with Serverless Multi-Agent Architectures on Google Cloud'
  ]);
});

test('core resolves researched opportunities and falls back to generic matching for the rest', () => {
  const researched = core.SEED_OPPORTUNITIES.find(item => item.id === EXPECTED_IDS[0]);
  const resolved = core.resolveOpportunityResearch(researched, core.SEED_TALKS);
  assert.equal(resolved.research.opportunityId, researched.id);
  assert.equal(resolved.recommendations.length, 2);
  assert.equal(resolved.recommendations[0].baseTalk.id, resolved.recommendations[0].baseTalkId);
  assert.equal(resolved.kind, 'researched');

  const pending = core.SEED_OPPORTUNITIES.find(item => !EXPECTED_IDS.includes(item.id));
  const fallback = core.resolveOpportunityResearch(pending, core.SEED_TALKS);
  assert.equal(fallback.research, null);
  assert.equal(fallback.kind, 'generic');
  assert.equal(fallback.recommendations.length, 1);
  assert.equal(fallback.recommendations[0].baseTalk.id, core.bestTalk(pending, core.SEED_TALKS).talk.id);
});

test('v5 persistence remains compatible and never stores static research', () => {
  let saved = '';
  const storage = {
    getItem: () => JSON.stringify({
      version: 5,
      opportunities: [{...core.SEED_OPPORTUNITIES[0], status: 'Drafting'}],
      talks: core.SEED_TALKS,
      dismissedIds: []
    }),
    setItem: (_key, value) => { saved = value; }
  };
  const state = core.loadState(storage);
  assert.equal(state.version, 5);
  assert.equal(state.opportunities[0].status, 'Drafting');
  assert.equal(Object.hasOwn(state, 'conferenceResearch'), false);
  core.saveState(storage, state);
  assert.doesNotMatch(saved, /representativeSessions|recurringPatterns|editionEvidence/);
});

test('pure research rendering escapes external text and rejects unsafe links', () => {
  const html = researchUi.renderResearchRecord({
    opportunityId: 'unsafe', conferenceName: '<img src=x onerror=alert(1)>', reviewedOn: '2026-11-15',
    editionEvidence: {kind: 'related-organizer-evidence', label: '<b>archive</b>', url: 'javascript:alert(1)'},
    recurringPatterns: ['<script>alert(1)</script>'],
    representativeSessions: [{title: '<svg/onload=alert(1)>', theme: 'Safe theme', url: 'data:text/html,bad', evidenceKind: 'related-organizer-evidence'}],
    recommendations: [{title: '<em>idea</em>', rationale: 'Rationale & details', baseTalkId: 'copilot-to-production'}],
    limitations: ['Limit <tag>'], sources: []
  }, {'copilot-to-production': {title: 'Base <talk>'}});
  assert.doesNotMatch(html, /javascript:|data:text|<script|<img|<svg|<em|<b>/i);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /Base &lt;talk&gt;/);
  assert.match(html, /href="#"/);
});
